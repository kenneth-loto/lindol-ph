import type { MagnitudeBuckets, RegionGroup } from "@/types/earthquakes";

/**
 * Returns the top N regions ranked by earthquake count, descending.
 *
 * @param regionGroups - List of region groups with their earthquake counts.
 * @param limit - Maximum number of regions to return. Defaults to `5`.
 * @returns An array of `{ name, count }` objects for the top regions, sorted
 * from highest to lowest count.
 *
 * @example
 * getTopRegions([
 *   { name: "Luzon", count: 12 },
 *   { name: "Visayas", count: 27 },
 *   { name: "Mindanao", count: 8 },
 * ], 2)
 * // [
 * //   { name: "Visayas", count: 27 },
 * //   { name: "Luzon", count: 12 },
 * // ]
 */
export function getTopRegions(regionGroups: RegionGroup[], limit = 5) {
  return [...regionGroups]
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map((region) => ({ name: region.name, count: region.count }));
}

export function getSeverityData(buckets: MagnitudeBuckets) {
  return [
    {
      key: "minor",
      name: "Minor (<3.0)",
      value: buckets.minor,
      fill: "var(--chart-3)",
    },
    {
      key: "light",
      name: "Light (3.0–4.9)",
      value: buckets.light,
      fill: "var(--chart-2)",
    },
    {
      key: "strong",
      name: "Strong (5.0+)",
      value: buckets.strong,
      fill: "var(--chart-1)",
    },
  ];
}
