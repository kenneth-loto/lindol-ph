import { Suspense } from "react";
import { getCachedWeeklyPhilippineQuakes } from "@/app/dal/earthquake";
import { EnergyTable } from "@/components/energy-table";
import { MetricStrips } from "@/components/metric-strips";
import { RegionalCharts } from "@/components/regional-charts";
import {
  filterPhilippineEarthquakes,
  getMagnitudeBuckets,
  getMetrics,
  groupByRegion,
} from "@/lib/earthquake-analytics";

export default async function Home() {
  const allQuakes = await getCachedWeeklyPhilippineQuakes();
  const phQuakes = filterPhilippineEarthquakes(allQuakes);
  const regionGroups = groupByRegion(phQuakes);
  const buckets = getMagnitudeBuckets(phQuakes);
  const metrics = getMetrics(phQuakes, regionGroups);

  return (
    <>
      <div className="mb-8">
        <h1 className="font-bold text-2xl tracking-tight">LindolPH</h1>
        <p className="text-base text-muted-foreground">
          Philippine seismic activity — past 7 days · USGS data
        </p>
      </div>

      <MetricStrips metrics={metrics} />

      {/* TODO: create a data table skeleton*/}
      <Suspense fallback={<div>Loading...</div>}>
        <RegionalCharts regionGroups={regionGroups} buckets={buckets} />
      </Suspense>

      {/* TODO: create a data table skeleton*/}
      <Suspense fallback={<div>Loading...</div>}>
        <EnergyTable regionGroups={regionGroups} />
      </Suspense>
    </>
  );
}
