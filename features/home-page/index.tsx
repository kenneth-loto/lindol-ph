import { connection } from "next/server";
import { getWeeklyPhilippineEarthquakes } from "@/app/dal/earthquakes";
import { EnergyTable } from "@/features/energy-table";
import { HomePageTabs } from "@/features/home-page/components/tabs";
import { IncidentFeedTable } from "@/features/incident-feed-table";
import { Overview } from "@/features/overview";
import {
  getMagnitudeBuckets,
  getMetrics,
  groupByRegion,
  toIncidentFeedItems,
} from "@/lib/earthquake-analytics";

export async function HomePageContent() {
  await connection();

  const { features, previousWeekFeatures, generatedAt } =
    await getWeeklyPhilippineEarthquakes();

  const regionGroups = groupByRegion(features);
  const buckets = getMagnitudeBuckets(features);
  const metrics = getMetrics(
    features,
    regionGroups,
    previousWeekFeatures.length,
  );
  const incidentFeedItems = toIncidentFeedItems(features);

  return (
    <HomePageTabs
      overview={
        <Overview
          metrics={metrics}
          regionGroups={regionGroups}
          buckets={buckets}
          generatedAt={generatedAt}
        />
      }
      energyTable={<EnergyTable features={features} />}
      incidentFeedTable={
        <IncidentFeedTable incidentFeedItems={incidentFeedItems} />
      }
    />
  );
}
