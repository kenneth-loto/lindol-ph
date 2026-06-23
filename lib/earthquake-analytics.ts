import type {
  EarthquakeMetrics,
  IncidentFeedItem,
  MagnitudeBuckets,
  RegionAccumulator,
  RegionGroup,
} from "@/types/earthquakes";
import { PH_BOUNDS } from "./constants";
import { calculateSeismicEnergy } from "./energy-calculation";
import type { USGSFeature } from "./schema/usgs-feature";

/**
 * Filters a list of USGS earthquake features down to those located in or
 * near the Philippines, matched either by place-name keywords or by
 * coordinate bounds.
 *
 * @param features - Raw USGS earthquake features to filter.
 * @returns Only the features that match a Philippine place name (e.g.
 * "Mindanao", "Luzon", "Visayas") or fall within `PH_BOUNDS`.
 */
export function filterPhilippineEarthquakes(
  features: USGSFeature[],
): USGSFeature[] {
  return features.filter((feature) => {
    const place = feature.properties.place.toLowerCase();
    const [lon, lat] = feature.geometry.coordinates;

    const matchesName =
      place.includes("philippines") ||
      place.includes("philippine islands") ||
      place.includes("mindanao") ||
      place.includes("luzon") ||
      place.includes("visayas");

    const inBounds =
      lat >= PH_BOUNDS.latMin &&
      lat <= PH_BOUNDS.latMax &&
      lon >= PH_BOUNDS.lonMin &&
      lon <= PH_BOUNDS.lonMax;

    return matchesName || inBounds;
  });
}

/**
 * Strips the leading distance-and-direction prefix from a USGS place
 * string (e.g. `"12km N of"`), leaving just the location name.
 *
 * @param place - Raw USGS place string.
 * @returns The place string with any `"<number>km <direction> of "` prefix
 * removed.
 *
 * @example
 * stripPrefix("12km N of Davao City, Philippines") // "Davao City, Philippines"
 */
export function stripPrefix(place: string): string {
  return place.replace(/^\d+(\.\d+)?\s*km\s+\w+\s+of\s+/i, "").trim();
}

/**
 * Extracts the region name from a USGS place string by stripping the
 * distance prefix and taking the second-to-last comma-separated segment.
 *
 * @param place - Raw USGS place string.
 * @returns The extracted region name, or the full cleaned string if it has
 * no comma-separated segments.
 *
 * @example
 * extractRegion("12km N of Davao City, Davao del Sur, Philippines") // "Davao del Sur"
 * extractRegion("Offshore Mindanao") // "Offshore Mindanao"
 */
export function extractRegion(place: string): string {
  const cleaned = stripPrefix(place);
  const parts = cleaned.split(",");

  if (parts.length >= 2) {
    return parts[parts.length - 2].trim();
  }

  return cleaned.trim();
}

function getOrCreateRegionEntry(
  map: Map<string, RegionAccumulator>,
  region: string,
): RegionAccumulator {
  const existing = map.get(region);

  if (existing) return existing;

  const fresh: RegionAccumulator = {
    validMags: [],
    depths: [],
    totalEnergy: 0,
    totalCount: 0,
  };
  map.set(region, fresh);

  return fresh;
}

/**
 * Aggregates earthquakes by region, computing per-region count, average
 * magnitude, average depth, and total seismic energy.
 *
 * @param earthquakes - USGS earthquake features to group.
 * @returns One `RegionGroup` per region, sorted by total seismic energy
 * descending. `avgMag` and `avgDepth` are `null` if no valid values exist
 * for that region.
 */
export function groupByRegion(earthquakes: USGSFeature[]): RegionGroup[] {
  const map = new Map<string, RegionAccumulator>();

  for (const earthquake of earthquakes) {
    const region = extractRegion(earthquake.properties.place);
    const mag = earthquake.properties.mag;
    const depth = earthquake.geometry.coordinates[2];

    const entry = getOrCreateRegionEntry(map, region);
    entry.totalCount += 1;
    entry.depths.push(depth);

    if (mag !== null) {
      entry.validMags.push(mag);
      entry.totalEnergy += calculateSeismicEnergy(mag);
    }
  }

  const groups: RegionGroup[] = [];

  for (const [
    name,
    { validMags, depths, totalEnergy, totalCount },
  ] of map.entries()) {
    const avgMag =
      validMags.length > 0
        ? validMags.reduce((a, b) => a + b, 0) / validMags.length
        : null;

    const avgDepth =
      depths.length > 0
        ? depths.reduce((a, b) => a + b, 0) / depths.length
        : null;

    groups.push({ name, count: totalCount, avgMag, avgDepth, totalEnergy });
  }

  return groups.sort((a, b) => b.totalEnergy - a.totalEnergy);
}

/**
 * Buckets earthquakes into severity tiers by magnitude, ignoring entries
 * with a `null` magnitude.
 *
 * @param quakes - USGS earthquake features to bucket.
 * @returns Counts for `minor` (`<3.0`), `light` (`3.0`–`4.9`), and `strong`
 * (`5.0+`) magnitude tiers.
 */
export function getMagnitudeBuckets(quakes: USGSFeature[]): MagnitudeBuckets {
  let minor = 0,
    light = 0,
    strong = 0;

  for (const quake of quakes) {
    const mag = quake.properties.mag;

    if (mag === null) continue;

    if (mag < 3.0) minor++;
    else if (mag < 5.0) light++;
    else strong++;
  }

  return { minor, light, strong };
}

/**
 * Computes summary metrics for a set of earthquakes: total count, the
 * strongest quake, the top region by energy, and the percentage change
 * versus a previous period.
 *
 * @param earthquakes - USGS earthquake features to summarize.
 * @param regionGroups - Pre-computed region groups, used to determine the
 * top region (assumed sorted by energy descending, e.g. from {@link groupByRegion}).
 * @param previousWeekCount - Optional count from the prior week, used to
 * compute `vsLastWeek`. Omitted or `0` results in a `null` value.
 * @returns Aggregate metrics, with safe fallback values (`"N/A"`, `null`,
 * `0`) when `earthquakes` is empty.
 */
export function getMetrics(
  earthquakes: USGSFeature[],
  regionGroups: RegionGroup[],
  previousWeekCount?: number,
): EarthquakeMetrics {
  const vsLastWeek =
    previousWeekCount && previousWeekCount > 0
      ? Math.round(
          ((earthquakes.length - previousWeekCount) / previousWeekCount) * 100,
        )
      : null;

  if (earthquakes.length === 0) {
    return {
      totalCount: 0,
      peakMag: null,
      peakLocation: "N/A",
      topRegion: "N/A",
      topRegionEnergy: 0,
      vsLastWeek,
    };
  }

  let strongestQuake: USGSFeature | null = null;
  let strongestMag = -Infinity;

  for (const earthquake of earthquakes) {
    const mag = earthquake.properties.mag;

    if (mag === null) continue;

    if (strongestQuake === null || mag > strongestMag) {
      strongestQuake = earthquake;
      strongestMag = mag;
    }
  }

  const top = regionGroups[0];

  return {
    totalCount: earthquakes.length,
    peakMag: strongestQuake ? strongestMag : null,
    peakLocation: strongestQuake
      ? stripPrefix(strongestQuake.properties.place)
      : "N/A",
    topRegion: top?.name ?? "N/A",
    topRegionEnergy: top?.totalEnergy ?? 0,
    vsLastWeek,
  };
}

/**
 * Converts USGS earthquake features into incident feed items, sorted by
 * most recent first.
 *
 * @param earthquakes - USGS earthquake features to convert.
 * @returns Feed items with `id`, `mag`, cleaned `location`, and `time`,
 * sorted descending by `time`.
 */
export function toIncidentFeedItems(
  earthquakes: USGSFeature[],
): IncidentFeedItem[] {
  return earthquakes
    .map((earthquake) => ({
      id: earthquake.id,
      mag: earthquake.properties.mag,
      location: stripPrefix(earthquake.properties.place),
      time: earthquake.properties.time,
    }))
    .sort((a, b) => b.time - a.time);
}
