import { DataTable } from "@/components/data-table";
import type { FilterConfig } from "@/types/data-table";
import type { IncidentFeedItem } from "@/types/earthquakes";
import { incidentFeedColumns } from "./components/columns";

interface IncidentFeedTableProps {
  incidentFeedItems: IncidentFeedItem[];
}

const magnitudeFilters: FilterConfig[] = [
  {
    columnId: "mag",
    title: "Magnitude",
    options: [
      { label: "Minor (< 3.0)", value: "minor" },
      { label: "Light (3.0 - 4.9)", value: "light" },
      { label: "Strong (5.0+)", value: "strong" },
    ],
  },
];

export function IncidentFeedTable({
  incidentFeedItems,
}: IncidentFeedTableProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        <h2 className="font-semibold text-xl tracking-tight">Incident Feed</h2>
        <p className="text-muted-foreground text-sm">
          All recorded Philippine earthquakes, in the past 7 days
        </p>
      </div>

      <DataTable
        id="ift"
        columns={incidentFeedColumns}
        data={incidentFeedItems}
        filters={magnitudeFilters}
      />
    </div>
  );
}
