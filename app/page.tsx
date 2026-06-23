import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table/components";
import { EnergyTable } from "@/features/energy-table";
import { IncidentFeedTable } from "@/features/incident-feed-table";
import { MetricStrips } from "@/features/metric-strips";
import { RegionalCharts } from "@/features/regional-charts";
import {
  getMagnitudeBuckets,
  getMetrics,
  groupByRegion,
  toIncidentFeedItems,
} from "@/lib/earthquake-analytics";
import { getWeeklyPhilippineEarthquakes } from "./dal/earthquakes";

export default async function Home() {
  const {
    features: philippineEarthquakes,
    previousWeekFeatures,
    generatedAt,
  } = await getWeeklyPhilippineEarthquakes();

  const regionGroups = groupByRegion(philippineEarthquakes);
  const buckets = getMagnitudeBuckets(philippineEarthquakes);
  const metrics = getMetrics(
    philippineEarthquakes,
    regionGroups,
    previousWeekFeatures.length,
  );
  const incidentFeedItems = toIncidentFeedItems(philippineEarthquakes);

  return (
    <>
      <MetricStrips metrics={metrics} generatedAt={generatedAt} />

      <RegionalCharts regionGroups={regionGroups} buckets={buckets} />

      <Suspense fallback={<DataTableSkeleton />}>
        <EnergyTable />
      </Suspense>

      <Suspense fallback={<DataTableSkeleton />}>
        <IncidentFeedTable items={incidentFeedItems} />
      </Suspense>
    </>
  );
}
