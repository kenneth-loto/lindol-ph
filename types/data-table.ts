import type { RowData } from "@tanstack/react-table";
import type { ComponentType } from "react";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    enableGlobalFilter?: boolean;
    readonly _metaTypes?: [TData, TValue];
  }
}

export interface FilterOption {
  label: string;
  value: string;
  icon?: ComponentType<{ className?: string }>;
}

export interface FilterConfig {
  columnId: string;
  title: string;
  options: FilterOption[];
}
