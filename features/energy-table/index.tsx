"use client";

import { useTranslations } from "next-intl";
import { DataTable } from "@/components/data-table";
import { groupByRegion } from "@/lib/earthquake-analytics";
import type { USGSFeature } from "@/lib/schema/usgs-feature";
import { useEnergyColumns } from "./components/columns";

interface EnergyTableProps {
  features: USGSFeature[];
}

export function EnergyTable({ features }: EnergyTableProps) {
  const t = useTranslations("EnergyTable");
  const columns = useEnergyColumns();
  const regionGroups = groupByRegion(features);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        <h2 className="font-semibold text-xl tracking-tight">{t("title")}</h2>
        <p className="text-muted-foreground text-sm">{t("description")}</p>
      </div>
      <DataTable id="et" columns={columns} data={regionGroups} />
      <p className="mt-4 text-center text-muted-foreground text-xs italic">
        {t("formula")}
      </p>
    </div>
  );
}
