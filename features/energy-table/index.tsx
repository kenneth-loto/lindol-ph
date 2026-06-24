import { DataTable } from "@/components/data-table";
import { groupByRegion } from "@/lib/earthquake-analytics";
import type { USGSFeature } from "@/lib/schema/usgs-feature";
import { energyColumns } from "./components/columns";

interface EnergyTableProps {
  features: USGSFeature[];
}

export async function EnergyTable({ features }: EnergyTableProps) {
  const regionGroups = groupByRegion(features);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        <h2 className="font-semibold text-xl tracking-tight">
          Energy Release by Region
        </h2>
        <p className="text-muted-foreground text-sm">
          Ranked by estimated total seismic energy released
        </p>
      </div>
      <DataTable id="et" columns={energyColumns} data={regionGroups} />
      <p className="mt-4 text-center text-muted-foreground text-xs italic">
        Formula: E = 10^(1.5M + 4.8) joules · Gutenberg &amp; Richter (1956).
        Values are estimates for analytical purposes only.
      </p>
    </div>
  );
}
