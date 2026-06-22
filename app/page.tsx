import { Suspense } from "react";
import { EnergyTable } from "@/components/energy-table";
import { IncidentFeedTable } from "@/components/incident-feed-table";
import { MetricStrips } from "@/components/metric-strips";
import { RegionalCharts } from "@/components/regional-charts";
import {
  getMagnitudeBuckets,
  getMetrics,
  groupByRegion,
  toIncidentFeedItems,
} from "@/lib/earthquake-analytics";
import { getWeeklyPhilippineEarthquakes } from "./dal/earthquakes";

export default async function Home() {
  const { features: philippineEarthquakes, generatedAt } =
    await getWeeklyPhilippineEarthquakes();
  const regionGroups = groupByRegion(philippineEarthquakes);
  const buckets = getMagnitudeBuckets(philippineEarthquakes);
  const metrics = getMetrics(philippineEarthquakes, regionGroups);
  const incidentFeedItems = toIncidentFeedItems(philippineEarthquakes);

  return (
    <>
      <div className="mb-8">
        <h1 className="font-bold text-2xl tracking-tight">LindolPH</h1>
        <p className="text-base text-muted-foreground">
          Philippine seismic activity — past 7 days · USGS data
        </p>
      </div>

      {/* TODO: create a data table skeleton*/}
      {/* TODO: refactor metric strips only the timestamp is dynamic */}
      <Suspense fallback={<div>Loading...</div>}>
        <MetricStrips metrics={metrics} generatedAt={generatedAt} />
      </Suspense>

      {/* TODO: create a data table skeleton*/}
      <Suspense fallback={<div>Loading...</div>}>
        <RegionalCharts regionGroups={regionGroups} buckets={buckets} />
      </Suspense>

      {/* TODO: create a data table skeleton*/}
      <Suspense fallback={<div>Loading...</div>}>
        <EnergyTable regionGroups={regionGroups} />
      </Suspense>

      {/* TODO: create a data table skeleton*/}
      <Suspense fallback={<div>Loading...</div>}>
        <IncidentFeedTable items={incidentFeedItems} />
      </Suspense>
    </>
  );
}
