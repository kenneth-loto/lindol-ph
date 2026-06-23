"use client";

import { Pie, PieChart, type PieSectorShapeProps, Sector } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig: ChartConfig = {
  minor: { label: "Minor (<3.0)", color: "var(--chart-3)" },
  light: { label: "Light (3.0–4.9)", color: "var(--chart-2)" },
  strong: { label: "Strong (5.0+)", color: "var(--chart-1)" },
};

interface SeverityDataItem {
  key: string;
  name: string;
  value: number;
  fill: string;
}

interface Props {
  data: SeverityDataItem[];
}

export function SeverityChart({ data }: Props) {
  return (
    <ChartContainer config={chartConfig} className="min-h-65 w-full">
      <PieChart>
        <Pie
          data={data}
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
              payload && typeof payload === "object" && "key" in payload
                ? payload.key
                : undefined;
            return (
              <Sector {...props} fill={`var(--color-${key ?? "value"})`} />
            );
          }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent nameKey="key" />} />
      </PieChart>
    </ChartContainer>
  );
}
