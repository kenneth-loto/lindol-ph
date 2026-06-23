"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ColumnHeader } from "@/components/data-table/components";
import { Checkbox } from "@/components/ui/checkbox";
import { formatScientific } from "@/lib/energy-calculation";
import type { RegionGroup } from "@/types/earthquakes";

export const energyColumns: ColumnDef<RegionGroup>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: { enableGlobalFilter: false },
  },
  {
    id: "rowNumber",
    header: () => <span className="text-muted-foreground text-xs">#</span>,
    enableSorting: false,
    enableHiding: false,
    meta: { enableGlobalFilter: false },
  },
  {
    accessorKey: "name",
    header: ({ column }) => <ColumnHeader column={column} title="Region" />,
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("name")}</span>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "count",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Earthquakes" />
    ),
    cell: ({ row }) => <div className="text-sm">{row.getValue("count")}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "avgMag",
    header: ({ column }) => <ColumnHeader column={column} title="Avg Mag" />,
    cell: ({ row }) => (
      <div className="text-sm">
        {(row.getValue("avgMag") as number).toFixed(2)}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "avgDepth",
    header: ({ column }) => <ColumnHeader column={column} title="Avg Depth" />,
    cell: ({ row }) => (
      <div className="text-sm">
        {(row.getValue("avgDepth") as number).toFixed(1)} km
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "totalEnergy",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Est. Energy" />
    ),
    cell: ({ row }) => (
      <div className="font-mono text-sm">
        {formatScientific(row.getValue("totalEnergy"))}
      </div>
    ),
  },
];
