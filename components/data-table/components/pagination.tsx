"use no memo";

import type { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationProps<TData> {
  table: Table<TData>;
}

export function Pagination<TData>({ table }: PaginationProps<TData>) {
  const t = useTranslations("DataTable");
  const pageText = (
    <div className="flex w-[100px] items-center justify-center font-medium text-sm">
      {t("page", {
        current: table.getState().pagination.pageIndex + 1,
        total: table.getPageCount(),
      })}
    </div>
  );

  return (
    <div className="flex flex-col gap-4 px-2 md:flex-row md:items-center md:justify-between md:gap-0">
      <div className="order-1 flex items-center justify-center gap-2 md:order-3">
        <div className="md:hidden">{pageText}</div>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">{t("goFirstPage")}</span>
          <ChevronsLeft />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">{t("goPreviousPage")}</span>
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">{t("goNextPage")}</span>
          <ChevronRight />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">{t("goLastPage")}</span>
          <ChevronsRight />
        </Button>
      </div>

      <div className="order-2 flex items-center justify-center gap-6 md:order-2 md:gap-8">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm">{t("rowsPerPage")}</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="hidden md:block">{pageText}</div>
      </div>

      <div className="order-3 flex-1 text-center text-muted-foreground text-sm md:order-1 md:text-left">
        {t("rowsSelected", {
          selected: table.getFilteredSelectedRowModel().rows.length,
          total: table.getFilteredRowModel().rows.length,
        })}
      </div>
    </div>
  );
}
