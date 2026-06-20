import type { Updater } from "@tanstack/react-table";
import { parseAsInteger, parseAsJson, parseAsString } from "nuqs";
import * as v from "valibot";

const sortingSchema = v.array(v.object({ id: v.string(), desc: v.boolean() }));

const columnFiltersSchema = v.array(
  v.object({ id: v.string(), value: v.unknown() }),
);

const columnVisibilitySchema = v.record(v.string(), v.boolean());

function safeParseJson<T extends NonNullable<unknown>>(
  schema: v.BaseSchema<unknown, T, v.BaseIssue<unknown>>,
  fallback: T,
) {
  return parseAsJson<T>((value) => {
    const result = v.safeParse(schema, value);

    return result.success ? result.output : fallback;
  }).withDefault(fallback);
}

export const tableSearchParams = {
  q: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  per_page: parseAsInteger.withDefault(10),
  sort: safeParseJson(sortingSchema, []),
  filters: safeParseJson(columnFiltersSchema, []),
  cols: safeParseJson(columnVisibilitySchema, {}),
};

export function applyUpdater<T>(updater: Updater<T>, current: T): T {
  return typeof updater === "function"
    ? (updater as (old: T) => T)(current)
    : updater;
}
