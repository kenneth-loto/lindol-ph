"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ColumnHeader } from "@/components/data-table/components";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { formatTime } from "@/lib/time";
import type { IncidentFeedItem } from "@/types/earthquakes";

export const incidentFeedColumns: ColumnDef<IncidentFeedItem>[] = [
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
    accessorKey: "location",
    header: ({ column }) => <ColumnHeader column={column} title="Location" />,
    cell: ({ row }) => (
      <span className="max-w-64 truncate">{row.getValue("location")}</span>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "mag",
    header: ({ column }) => <ColumnHeader column={column} title="Magnitude" />,
    cell: ({ row }) => {
      const mag = row.getValue<number | null>("mag");

      if (mag === null) {
        return (
          <Badge
            variant="secondary"
            className="w-12 shrink-0 justify-center font-mono text-xs"
          >
            —
          </Badge>
        );
      }

      const variant =
        mag >= 5.0 ? "destructive" : mag >= 3.0 ? "default" : "secondary";

      return (
        <Badge
          variant={variant}
          className="w-12 shrink-0 justify-center font-mono"
        >
          M{mag.toFixed(1)}
        </Badge>
      );
    },
    enableHiding: false,
    filterFn: (row, _columnId, filterValue) => {
      const mag = row.getValue<number | null>("mag");
      const selected = filterValue as string[] | undefined;

      if (!selected?.length) return true;

      if (mag === null) return false;

      return selected.some((value) => {
        switch (value) {
          case "minor":
            return mag < 3;
          case "light":
            return mag >= 3 && mag < 5;
          case "strong":
            return mag >= 5;
          default:
            return false;
        }
      });
    },
  },
  {
    accessorKey: "time",
    header: ({ column }) => <ColumnHeader column={column} title="Time" />,
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">
        {formatTime(row.original.time)}
      </span>
    ),
  },
];
