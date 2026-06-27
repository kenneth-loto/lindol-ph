import { ActivityIcon, MapPinIcon, ZapIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
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

export async function Overview({
  metrics,
  regionGroups,
  buckets,
  generatedAt,
}: OverviewProps) {
  const t = await getTranslations("Overview");
  const topRegions = getTopRegions(regionGroups);
  const severityData = getSeverityData(buckets);
  const hasData = regionGroups.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6">
        <MetricsCard
          label={t("totalIncidents")}
          icon={<ActivityIcon className="h-4 w-4" />}
          value={metrics.totalCount.toString()}
          sub={
            metrics.vsLastWeek !== null
              ? `${metrics.vsLastWeek > 0 ? "+" : ""}${metrics.vsLastWeek}% ${t("vsLastWeek")}`
              : "—"
          }
        />

        <MetricsCard
          label={t("peakMagnitude")}
          icon={<ZapIcon className="h-4 w-4" />}
          value={
            metrics.peakMag !== null ? `M${metrics.peakMag.toFixed(1)}` : "—"
          }
          sub={metrics.peakLocation}
        />

        <MetricsCard
          label={t("highestEnergyRegion")}
          icon={<MapPinIcon className="h-4 w-4" />}
          value={metrics.topRegion}
          sub={formatScientific(metrics.topRegionEnergy)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
        <Card className="rounded-md border">
          <CardHeader>
            <CardTitle>{t("mostActiveRegions")}</CardTitle>
            <CardDescription>{t("mostActiveDesc")}</CardDescription>
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
            <CardTitle>{t("severityDistribution")}</CardTitle>
            <CardDescription>{t("severityDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            {hasData ? <SeverityChart data={severityData} /> : <EmptyChart />}
          </CardContent>
        </Card>
      </div>

      <p className="text-right text-muted-foreground text-sm">
        {t("lastUpdated")} {" - "} <Timestamp timestamp={generatedAt} />
      </p>
    </div>
  );
}
