import { ActivityIcon, MapPinIcon, ZapIcon } from "lucide-react";
import { Suspense } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { formatScientific } from "@/lib/energy-calculation";
import type { EarthquakeMetrics } from "@/types/earthquakes";
import { MetricsCard } from "./components/metrics-card";
import { Timestamp } from "./components/timestamp";

interface Props {
  metrics: EarthquakeMetrics;
  generatedAt: number;
}

export function MetricStrips({ metrics, generatedAt }: Props) {
  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-2xl tracking-tight">Lindol PH</h1>
          <ModeToggle />
        </div>
        <p className="text-base text-muted-foreground">
          Philippine seismic activity — past 7 days
        </p>
        <em className="text-muted-foreground text-sm">
          Source: USGS{" - "}
          <Suspense fallback={<span>loading...</span>}>
            <Timestamp timestamp={generatedAt} />
          </Suspense>
        </em>
      </div>

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
    </>
  );
}
