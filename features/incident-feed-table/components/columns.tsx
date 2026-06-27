"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { ColumnHeader } from "@/components/data-table/components";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { formatRelativeTime } from "@/lib/relative-time";
import type { IncidentFeedItem } from "@/types/earthquakes";

export function useIncidentFeedColumns(): ColumnDef<IncidentFeedItem>[] {
  const t = useTranslations("IncidentFeed.columns");
  const tTable = useTranslations("Table");

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={
            table.getIsSomePageRowsSelected() &&
            !table.getIsAllPageRowsSelected()
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={tTable("selectAll")}
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={tTable("selectRow")}
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
      header: ({ column }) => (
        <ColumnHeader column={column} title={t("location")} />
      ),
      cell: ({ row }) => (
        <span className="max-w-64 truncate">{row.getValue("location")}</span>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "mag",
      header: ({ column }) => (
        <ColumnHeader column={column} title={t("magnitude")} />
      ),
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
      header: ({ column }) => (
        <ColumnHeader column={column} title={t("time")} />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs">
          {formatRelativeTime(row.original.time)}
        </span>
      ),
    },
  ];
}
