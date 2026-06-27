"use client";

import { useTranslations } from "next-intl";
import { DataTable } from "@/components/data-table";
import type { FilterConfig } from "@/types/data-table";
import type { IncidentFeedItem } from "@/types/earthquakes";
import { useIncidentFeedColumns } from "./components/columns";

interface IncidentFeedTableProps {
  incidentFeedItems: IncidentFeedItem[];
}

export function IncidentFeedTable({
  incidentFeedItems,
}: IncidentFeedTableProps) {
  const t = useTranslations("IncidentFeed");
  const columns = useIncidentFeedColumns();

  const magnitudeFilters: FilterConfig[] = [
    {
      columnId: "mag",
      title: t("filterMagnitude"),
      options: [
        { label: t("filterMinor"), value: "minor" },
        { label: t("filterLight"), value: "light" },
        { label: t("filterStrong"), value: "strong" },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        <h2 className="font-semibold text-xl tracking-tight">{t("title")}</h2>
        <p className="text-muted-foreground text-sm">{t("description")}</p>
      </div>
      <DataTable
        id="ift"
        columns={columns}
        data={incidentFeedItems}
        filters={magnitudeFilters}
      />
    </div>
  );
}
