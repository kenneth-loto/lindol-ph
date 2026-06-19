import { describe, expect, test } from "bun:test";
import {
  extractRegion,
  filterPhilippineEarthquakes,
  getMagnitudeBuckets,
  getMetrics,
  groupByRegion,
  stripPrefix,
} from "../earthquake-analytics";
import {
  calculateSeismicEnergy,
  formatScientific,
} from "../energy-calculation";
import type { USGSFeature } from "../schema/usgs-feature";

// Mock data matching the actual USGSFeature contract.
// Note: no `depth` field on `properties` — depth only lives in
// geometry.coordinates[2] per the real USGS schema.
const mockFeatures: USGSFeature[] = [
  {
    id: "us7000mock1",
    properties: {
      mag: 4.5,
      place: "23km NW of Davao City, Philippines",
      time: 1718800000000,
    },
    geometry: { coordinates: [125.1, 7.2, 33] },
  },
  {
    id: "us7000mock2",
    properties: {
      mag: 2.8,
      place: "10km SSE of Calapan, Philippines",
      time: 1718803600000,
    },
    geometry: { coordinates: [121.2, 13.4, 10] },
  },
  {
    id: "us7000mock3",
    properties: {
      mag: 5.1,
      place: "45km NE of Davao City, Philippines",
      time: 1718807200000,
    },
    geometry: { coordinates: [125.4, 7.5, 55] },
  },
  {
    id: "us7000mock4", // unrated event edge case
    properties: {
      mag: null,
      place: "Mindanao, Philippines",
      time: 1718810800000,
    },
    geometry: { coordinates: [125.0, 8.0, 15] },
  },
  {
    id: "us7000mock5", // should be filtered OUT — not PH
    properties: {
      mag: 6.2,
      place: "30km E of Tokyo, Japan",
      time: 1718800000000,
    },
    geometry: { coordinates: [140.5, 35.7, 40] },
  },
];

describe("Earthquake Analytics Suite", () => {
  test("filterPhilippineQuakes excludes non-PH locations", () => {
    const filtered = filterPhilippineEarthquakes(mockFeatures);
    // Davao (2) + Calapan (1) + Mindanao (1) = 4. Tokyo excluded.
    expect(filtered.length).toBe(4);
    expect(filtered.some((quake) => quake.id === "us7000mock5")).toBe(false);
  });

  test("stripPrefix removes distance data correctly", () => {
    expect(stripPrefix("23km NW of Davao City, Philippines")).toBe(
      "Davao City, Philippines",
    );
    expect(stripPrefix("5km S of Manila")).toBe("Manila");
  });

  test("extractRegion cleanly parses cities and raw regions", () => {
    expect(extractRegion("23km NW of Davao City, Philippines")).toBe(
      "Davao City",
    );
    expect(extractRegion("Mindanao, Philippines")).toBe("Mindanao");
  });

  test("groupByRegion aggregates and sorts by energy descending", () => {
    const phQuakes = filterPhilippineEarthquakes(mockFeatures);
    const groups = groupByRegion(phQuakes);

    expect(groups.length).toBe(3); // Davao City, Calapan, Mindanao

    const davao = groups.find((g) => g.name === "Davao City");
    expect(davao).toBeDefined();
    expect(davao?.count).toBe(2);
    // (4.5 + 5.1) / 2 = 4.8
    expect(davao?.avgMag).toBeCloseTo(4.8, 1);

    const mindanao = groups.find((g) => g.name === "Mindanao");
    expect(mindanao).toBeDefined();
    // Only event in this group has mag: null, so validMags was empty
    expect(mindanao?.avgMag).toBeNull();
    expect(mindanao?.count).toBe(1);

    // Highest-energy region must sort first
    expect(groups[0].name).toBe("Davao City");
  });

  test("getMagnitudeBuckets distributes magnitudes correctly, skipping nulls", () => {
    const phQuakes = filterPhilippineEarthquakes(mockFeatures);
    const buckets = getMagnitudeBuckets(phQuakes);

    // 2.8 -> minor, 4.5 -> light, 5.1 -> strong, null -> skipped
    expect(buckets).toEqual({ minor: 1, light: 1, strong: 1 });
  });

  test("getMetrics generates accurate high-level summary KPIs", () => {
    const phQuakes = filterPhilippineEarthquakes(mockFeatures);
    const groups = groupByRegion(phQuakes);
    const metrics = getMetrics(phQuakes, groups);

    expect(metrics.totalCount).toBe(4);
    expect(metrics.peakMag).toBe(5.1);
    expect(metrics.peakLocation).toBe("Davao City, Philippines");
    expect(metrics.topRegion).toBe("Davao City");
  });

  test("Gutenberg-Richter conversion and formatting accuracy", () => {
    const energy = calculateSeismicEnergy(5.0);
    const formatted = formatScientific(energy);

    // 10^(1.5*5.0 + 4.8) = 10^12.3 ≈ 1.99526 × 10¹²
    expect(formatted).toBe("2.00 × 10¹² J");
  });

  test("getMetrics returns null peakMag, not 0, when every quake is unreviewed", () => {
    const allUnreviewed: USGSFeature[] = [
      {
        id: "us-null-1",
        properties: {
          mag: null,
          place: "10km N of Iloilo, Philippines",
          time: Date.now(),
        },
        geometry: { coordinates: [122.5, 10.7, 20] },
      },
    ];
    const groups = groupByRegion(allUnreviewed);
    const metrics = getMetrics(allUnreviewed, groups);

    expect(metrics.peakMag).toBeNull();
  });
});
