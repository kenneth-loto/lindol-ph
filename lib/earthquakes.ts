import type { MagnitudeBuckets, RegionGroup } from "@/types/earthquakes";

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
