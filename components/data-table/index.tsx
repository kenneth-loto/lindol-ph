"use no memo";
"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQueryStates } from "nuqs";
import { useState } from "react";
import { Pagination, Toolbar } from "@/components/data-table/components";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { applyUpdater, tableSearchParams } from "@/lib/data-table-parsers";
import type { FilterConfig } from "@/types/data-table";

interface DataTableProps<TData, TValue> {
  id?: string; // for same page table state persistence
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
  filters?: FilterConfig[];
  error?: string;
  shallow?: boolean;
}

//TODO: fix the rerender issue when using react compiler, but not possible in v8 so wait for v9
export function DataTable<TData, TValue>({
  id,
  columns,
  data,
  searchPlaceholder,
  filters,
  error,
  shallow = true,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});

  const [
    { q, page, per_page, sort, filters: columnFilters, cols },
    setTableState,
  ] = useQueryStates(tableSearchParams, {
    shallow,
    urlKeys: {
      q: `${id}_q`,
      page: `${id}_page`,
      per_page: `${id}_per_page`,
      sort: `${id}_sort`,
      filters: `${id}_filters`,
      cols: `${id}_cols`,
    },
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: sort,
      columnVisibility: cols,
      rowSelection,
      columnFilters,
      globalFilter: q,
      pagination: { pageIndex: page - 1, pageSize: per_page },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,

    onSortingChange: (updater) =>
      setTableState({ sort: applyUpdater(updater, sort), page: 1 }),
    onColumnFiltersChange: (updater) =>
      setTableState({
        filters: applyUpdater(updater, columnFilters),
        page: 1,
      }),
    onColumnVisibilityChange: (updater) =>
      setTableState({ cols: applyUpdater(updater, cols) }),
    onGlobalFilterChange: (value: string) =>
      setTableState({ q: value, page: 1 }),
    onPaginationChange: (updater) => {
      const next = applyUpdater(updater, {
        pageIndex: page - 1,
        pageSize: per_page,
      });
      setTableState({
        page: next.pageSize !== per_page ? 1 : next.pageIndex + 1,
        per_page: next.pageSize,
      });
    },

    globalFilterFn: (row, _columnId, filterValue) => {
      const search = String(filterValue).trim().toLowerCase();

      if (!search) return true;

      return row.getAllCells().some((cell) => {
        const enabled = cell.column.columnDef.meta?.enableGlobalFilter ?? true;

        if (!enabled) return false;

        const value = cell.getValue();

        if (value == null) return false;

        return String(value).toLowerCase().includes(search);
      });
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const renderTableBody = () => {
    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            <span className="text-destructive">{error}</span>
          </TableCell>
        </TableRow>
      );
    }

    if (!table.getRowModel().rows?.length) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      );
    }

    return table.getRowModel().rows.map((row, index) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {cell.column.id === "rowNumber"
              ? table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                index +
                1
              : flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <div className="flex flex-col gap-4">
      <Toolbar
        table={table}
        searchPlaceholder={searchPlaceholder}
        filters={filters}
      />
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>{renderTableBody()}</TableBody>
        </Table>
      </div>
      <Pagination table={table} />
    </div>
  );
}
