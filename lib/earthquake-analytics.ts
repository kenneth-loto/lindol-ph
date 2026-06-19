import type {
  EarthquakeMetrics,
  MagnitudeBuckets,
  RegionGroup,
  USGSFeature,
} from "@/types/earthquakes";
import { calculateSeismicEnergy } from "./energy-calculation";

/**
 * Filter global USGS feed to Philippine events only.
 * USGS place strings for PH events typically end with ", Philippines"
 * or contain known PH region names.
 */
export function filterPhilippineQuakes(features: USGSFeature[]): USGSFeature[] {
  return features.filter((feature) => {
    const place = feature.properties.place.toLowerCase();

    return (
      place.includes("philippines") ||
      place.includes("philippine islands") ||
      place.includes("mindanao") ||
      place.includes("luzon") ||
      place.includes("visayas")
    );
  });
}

/**
 * Strip directional prefix like "12km NW of " and return the location name.
 * "12km NW of Davao City, Philippines" → "Davao City, Philippines"
 */
export function stripPrefix(place: string): string {
  return place.replace(/^\d+(\.\d+)?\s*km\s+\w+\s+of\s+/i, "").trim();
}

/**
 * Extract the primary city/province from a cleaned place string.
 * "Davao City, Philippines" → "Davao City"
 * "Mindanao" (no comma) → "Mindanao"
 */
export function extractRegion(place: string): string {
  const cleaned = stripPrefix(place);
  const parts = cleaned.split(",");
  if (parts.length >= 2) {
    return parts[parts.length - 2].trim();
  }
  return cleaned.trim();
}

interface RegionAccumulator {
  validMags: number[];
  depths: number[];
  totalEnergy: number;
  totalCount: number;
}

/**
 * Get the accumulator for a region, creating it on first use.
 * Returns the entry directly so callers never need a follow-up
 * `map.get(region)!` non-null assertion.
 */
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
 * Group PH earthquakes by extracted region name.
 *
 * Unreviewed (mag === null) events still count toward `count` and
 * `avgDepth`, but are excluded from `avgMag` and `totalEnergy` —
 * folding them in as 0 would silently drag averages down and
 * miscategorize them as "minor" earthquakes.
 */
export function groupByRegion(earthquakes: USGSFeature[]): RegionGroup[] {
  const map = new Map<string, RegionAccumulator>();

  for (const earthquake of earthquakes) {
    const region = extractRegion(earthquake.properties.place);
    const mag = earthquake.properties.mag; // number | null
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
 * Bucket quakes into severity tiers by magnitude.
 * Unreviewed (mag === null) events are skipped, not counted as minor.
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
 * Compute top-level KPI metrics from filtered PH earthquakes and region groups.
 * peakMag stays null (never 0) when no rated event exists, matching
 * EarthquakeMetrics' own type contract.
 */
export function getMetrics(
  earthquakes: USGSFeature[],
  regionGroups: RegionGroup[],
): EarthquakeMetrics {
  if (earthquakes.length === 0) {
    return {
      totalCount: 0,
      peakMag: null,
      peakLocation: "N/A",
      topRegion: "N/A",
      topRegionEnergy: 0,
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
  };
}
