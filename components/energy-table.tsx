import { DataTable } from "@/components/data-table";
import { regionColumns } from "@/components/region-columns";
import type { RegionGroup } from "@/types/earthquakes";

interface EnergyTableProps {
  regionGroups: RegionGroup[];
}

export function EnergyTable({ regionGroups }: EnergyTableProps) {
  return (
    <div className="mt-12 rounded-md border-2 p-6">
      <div className="mb-4">
        <h2 className="font-semibold text-xl tracking-tight">
          Energy Release by Region
        </h2>
        <p className="text-muted-foreground text-sm">
          Ranked by estimated total seismic energy released
        </p>
      </div>

      <DataTable id="et" columns={regionColumns} data={regionGroups} />

      <p className="mt-4 text-center text-muted-foreground text-xs italic">
        Formula: E = 10^(1.5M + 4.8) joules · Gutenberg &amp; Richter (1956).
        Values are estimates for analytical purposes only.
      </p>
    </div>
  );
}
