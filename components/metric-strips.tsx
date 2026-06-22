"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatScientific } from "@/lib/energy-calculation";
import { formatTime } from "@/lib/time";
import type { EarthquakeMetrics } from "@/types/earthquakes";

interface Props {
  metrics: EarthquakeMetrics;
  generatedAt: number;
}

export function MetricStrips({ metrics, generatedAt }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <MetricCard
        label="Total PH Incidents"
        value={metrics.totalCount.toString()}
        sub="earthquakes this week"
      />
      <MetricCard
        label="Peak Magnitude"
        value={
          metrics.peakMag !== null ? `M${metrics.peakMag.toFixed(1)}` : "—"
        }
        sub={metrics.peakLocation}
      />
      <MetricCard
        label="Highest Energy Region"
        value={metrics.topRegion}
        sub={formatScientific(metrics.topRegionEnergy)}
      />
      <div className="col-span-full mt-1 text-right text-muted-foreground text-xs">
        Data from USGS · generated {formatTime(generatedAt)}
      </div>
    </div>
  );
}

interface CardProps {
  label: string;
  value: string;
  sub: string;
}

function MetricCard({ label, value, sub }: CardProps) {
  return (
    //TODO: improve ui
    <Card className="rounded-md border">
      <CardContent className="p-6">
        <p className="mb-2 font-medium text-muted-foreground text-xs uppercase tracking-widest">
          {label}
        </p>
        <p className="mb-1 font-bold text-3xl leading-none tracking-tight">
          {value}
        </p>
        <p className="truncate text-muted-foreground text-xs">{sub}</p>
      </CardContent>
    </Card>
  );
}
