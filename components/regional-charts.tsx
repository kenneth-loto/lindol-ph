"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  type PieSectorShapeProps,
  Sector,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getSeverityData, getTopRegions } from "@/lib/earthquakes";
import type { MagnitudeBuckets, RegionGroup } from "@/types/earthquakes";

interface RegionalChartsProps {
  regionGroups: RegionGroup[];
  buckets: MagnitudeBuckets;
}

const regionChartConfig: ChartConfig = {
  count: {
    label: "Earthquakes",
    color: "var(--chart-1)",
  },
};

const severityChartConfig: ChartConfig = {
  minor: {
    label: "Minor (<3.0)",
    color: "var(--chart-3)",
  },
  light: {
    label: "Light (3.0–4.9)",
    color: "var(--chart-2)",
  },
  strong: {
    label: "Strong (5.0+)",
    color: "var(--chart-1)",
  },
};

export function RegionalCharts({ regionGroups, buckets }: RegionalChartsProps) {
  const topRegions = getTopRegions(regionGroups);
  const severityData = getSeverityData(buckets);
  const hasData = regionGroups.length > 0;

  return (
    <div className="mt-12">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="rounded-md border">
          <CardHeader>
            <CardTitle>Most Active Regions</CardTitle>
            <CardDescription>Top 5 by quake count, past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            {hasData ? (
              <ChartContainer
                config={regionChartConfig}
                className="min-h-[260px] w-full"
              >
                <BarChart
                  data={topRegions}
                  layout="vertical"
                  margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                >
                  <CartesianGrid horizontal={false} />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="count"
                    fill="var(--color-count)"
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ChartContainer>
            ) : (
              // TODO: make this a reusable component
              <div className="flex h-[260px] items-center justify-center text-muted-foreground text-sm">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-md border">
          <CardHeader>
            <CardTitle>Severity Distribution</CardTitle>
            <CardDescription>By magnitude tier, past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            {hasData ? (
              <ChartContainer
                config={severityChartConfig}
                className="min-h-[260px] w-full"
              >
                <PieChart>
                  <Pie
                    data={severityData}
                    dataKey="value"
                    nameKey="key"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={2}
                    shape={(props: PieSectorShapeProps) => {
                      const payload = props.payload;
                      const key =
                        payload &&
                        typeof payload === "object" &&
                        "key" in payload
                          ? payload.key
                          : undefined;

                      return (
                        <Sector
                          {...props}
                          fill={`var(--color-${key ?? "value"})`}
                        />
                      );
                    }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent nameKey="key" />} />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="flex h-[260px] items-center justify-center text-muted-foreground text-sm">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
