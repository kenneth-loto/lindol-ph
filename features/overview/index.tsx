import { ActivityIcon, MapPinIcon, ZapIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSeverityData, getTopRegions } from "@/lib/earthquakes";
import { formatScientific } from "@/lib/energy-calculation";
import type {
  EarthquakeMetrics,
  MagnitudeBuckets,
  RegionGroup,
} from "@/types/earthquakes";
import { ActiveRegionsChart } from "./components/bar-chart";
import { EmptyChart } from "./components/empty-chart";
import { MetricsCard } from "./components/metrics-card";
import { SeverityChart } from "./components/pie-chart";
import { Timestamp } from "./components/timestamp";

interface OverviewProps {
  metrics: EarthquakeMetrics;
  regionGroups: RegionGroup[];
  buckets: MagnitudeBuckets;
  generatedAt: number;
}

export function Overview({
  metrics,
  regionGroups,
  buckets,
  generatedAt,
}: OverviewProps) {
  const topRegions = getTopRegions(regionGroups);
  const severityData = getSeverityData(buckets);
  const hasData = regionGroups.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6">
        <MetricsCard
          label="Total PH Incidents"
          icon={<ActivityIcon className="h-4 w-4" />}
          value={metrics.totalCount.toString()}
          sub={
            metrics.vsLastWeek !== null
              ? `${metrics.vsLastWeek > 0 ? "+" : ""}${metrics.vsLastWeek}% vs last week`
              : "—"
          }
        />

        <MetricsCard
          label="Peak Magnitude"
          icon={<ZapIcon className="h-4 w-4" />}
          value={
            metrics.peakMag !== null ? `M${metrics.peakMag.toFixed(1)}` : "—"
          }
          sub={metrics.peakLocation}
        />

        <MetricsCard
          label="Highest Energy Region"
          icon={<MapPinIcon className="h-4 w-4" />}
          value={metrics.topRegion}
          sub={formatScientific(metrics.topRegionEnergy)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
        <Card className="rounded-md border">
          <CardHeader>
            <CardTitle>Most Active Regions</CardTitle>
            <CardDescription>Top 5 by quake count, past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            {hasData ? (
              <ActiveRegionsChart data={topRegions} />
            ) : (
              <EmptyChart />
            )}
          </CardContent>
        </Card>

        <Card className="rounded-md border">
          <CardHeader>
            <CardTitle>Severity Distribution</CardTitle>
            <CardDescription>By magnitude tier, past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            {hasData ? <SeverityChart data={severityData} /> : <EmptyChart />}
          </CardContent>
        </Card>
      </div>

      <p className="text-right text-muted-foreground text-sm">
        Last updated {" - "} <Timestamp timestamp={generatedAt} />
      </p>
    </div>
  );
}
