"use no memo";

import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FilterConfig } from "@/types/data-table";
import { FacetedFilter } from "./faceted-filter";
import { ViewOptions } from "./view-options";

interface ToolbarProps<TData> {
  table: Table<TData>;
  searchPlaceholder?: string;
  filters?: FilterConfig[];
  actions?: ReactNode;
}

export function Toolbar<TData>({
  table,
  searchPlaceholder,
  filters = [],
  actions,
}: ToolbarProps<TData>) {
  const t = useTranslations("DataTable");
  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    !!table.getState().globalFilter;

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2 sm:flex-1 sm:flex-row sm:flex-wrap sm:items-center">
        <Input
          placeholder={searchPlaceholder ?? t("search")}
          value={table.getState().globalFilter ?? ""}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          className="h-8 w-[250px]"
        />
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => {
            const column = table.getColumn(filter.columnId);
            return column ? (
              <FacetedFilter
                key={filter.columnId}
                column={column}
                title={filter.title}
                options={filter.options}
              />
            ) : null;
          })}
          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                table.resetColumnFilters();
                table.setGlobalFilter("");
              }}
            >
              {t("reset")}
              <X />
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-start gap-2 sm:justify-end">
        <ViewOptions table={table} />
        {actions}
      </div>
    </div>
  );
}
