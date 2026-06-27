import { describe, expect, test } from "bun:test";
import type { MagnitudeBuckets, RegionGroup } from "@/types/earthquakes";
import { getSeverityData, getTopRegions } from "../earthquakes";

describe("getTopRegions", () => {
  const groups: RegionGroup[] = [
    { name: "Luzon", count: 12, avgMag: 3.2, avgDepth: 25, totalEnergy: 1e10 },
    {
      name: "Visayas",
      count: 27,
      avgMag: 4.1,
      avgDepth: 15,
      totalEnergy: 5e11,
    },
    {
      name: "Mindanao",
      count: 8,
      avgMag: 3.8,
      avgDepth: 40,
      totalEnergy: 2e10,
    },
    { name: "Palawan", count: 3, avgMag: 2.5, avgDepth: 10, totalEnergy: 1e9 },
    { name: "Bicol", count: 5, avgMag: 3.0, avgDepth: 30, totalEnergy: 5e9 },
    { name: "Ilocos", count: 1, avgMag: 4.5, avgDepth: 50, totalEnergy: 1e11 },
  ];

  test("returns top 5 regions sorted by count descending by default", () => {
    const top = getTopRegions(groups);

    expect(top).toHaveLength(5);
    expect(top[0]).toEqual({ name: "Visayas", count: 27 });
    expect(top[1]).toEqual({ name: "Luzon", count: 12 });
    expect(top[2]).toEqual({ name: "Mindanao", count: 8 });
    expect(top[3]).toEqual({ name: "Bicol", count: 5 });
    expect(top[4]).toEqual({ name: "Palawan", count: 3 });
  });

  test("respects custom limit", () => {
    const top2 = getTopRegions(groups, 2);

    expect(top2).toHaveLength(2);
    expect(top2[0]).toEqual({ name: "Visayas", count: 27 });
    expect(top2[1]).toEqual({ name: "Luzon", count: 12 });
  });

  test("returns all groups when limit exceeds array length", () => {
    const top = getTopRegions(groups, 99);

    expect(top).toHaveLength(groups.length);
  });

  test("returns empty array for empty input", () => {
    expect(getTopRegions([])).toEqual([]);
  });

  test("does not mutate the original array", () => {
    const copy = [...groups];

    getTopRegions(groups);
    expect(groups).toEqual(copy);
  });

  test("handles single-element array", () => {
    const single: RegionGroup[] = [
      { name: "Luzon", count: 5, avgMag: 3.0, avgDepth: 20, totalEnergy: 1e9 },
    ];

    expect(getTopRegions(single, 1)).toEqual([{ name: "Luzon", count: 5 }]);
  });

  test("returns only { name, count } shape, not the full RegionGroup", () => {
    const top = getTopRegions(groups, 1);

    expect(Object.keys(top[0])).toEqual(["name", "count"]);
  });
});

describe("getSeverityData", () => {
  test("returns correctly structured array", () => {
    const buckets: MagnitudeBuckets = { minor: 10, light: 5, strong: 2 };
    const data = getSeverityData(buckets);

    expect(data).toHaveLength(3);

    expect(data[0]).toEqual({
      key: "minor",
      name: "Minor (<3.0)",
      value: 10,
      fill: "var(--chart-3)",
    });

    expect(data[1]).toEqual({
      key: "light",
      name: "Light (3.0–4.9)",
      value: 5,
      fill: "var(--chart-2)",
    });

    expect(data[2]).toEqual({
      key: "strong",
      name: "Strong (5.0+)",
      value: 2,
      fill: "var(--chart-1)",
    });
  });

  test("handles zero counts", () => {
    const buckets: MagnitudeBuckets = { minor: 0, light: 0, strong: 0 };
    const data = getSeverityData(buckets);

    expect(data.every((d) => d.value === 0)).toBe(true);
  });

  test("maintains consistent ordering: minor, light, strong", () => {
    const buckets: MagnitudeBuckets = { minor: 1, light: 2, strong: 3 };
    const data = getSeverityData(buckets);

    expect(data[0].key).toBe("minor");
    expect(data[1].key).toBe("light");
    expect(data[2].key).toBe("strong");
  });

  test("fill colors use CSS variable references", () => {
    const buckets: MagnitudeBuckets = { minor: 0, light: 0, strong: 0 };
    const data = getSeverityData(buckets);

    expect(data[0].fill).toMatch(/^var\(--chart-/);
    expect(data[1].fill).toMatch(/^var\(--chart-/);
    expect(data[2].fill).toMatch(/^var\(--chart-/);
  });
});
