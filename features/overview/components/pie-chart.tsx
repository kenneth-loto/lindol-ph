"use client";

import { useTranslations } from "next-intl";
import { Pie, PieChart, type PieSectorShapeProps, Sector } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

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
  const t = useTranslations("Charts");
  const chartConfig: ChartConfig = {
    minor: { label: t("minor"), color: "var(--chart-3)" },
    light: { label: t("light"), color: "var(--chart-2)" },
    strong: { label: t("strong"), color: "var(--chart-1)" },
  };

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
