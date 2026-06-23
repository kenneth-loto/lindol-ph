import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSeverityData, getTopRegions } from "@/lib/earthquakes";
import type { MagnitudeBuckets, RegionGroup } from "@/types/earthquakes";
import { ActiveRegionsChart } from "./components/bar-chart";
import { EmptyChart } from "./components/empty-chart";
import { SeverityChart } from "./components/pie-chart";

interface Props {
  regionGroups: RegionGroup[];
  buckets: MagnitudeBuckets;
}

export function RegionalCharts({ regionGroups, buckets }: Props) {
  const topRegions = getTopRegions(regionGroups);
  const severityData = getSeverityData(buckets);
  const hasData = regionGroups.length > 0;

  return (
    <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
      <Card className="rounded-md border">
        <CardHeader>
          <CardTitle>Most Active Regions</CardTitle>
          <CardDescription>Top 5 by quake count, past 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          {hasData ? <ActiveRegionsChart data={topRegions} /> : <EmptyChart />}
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
  );
}
