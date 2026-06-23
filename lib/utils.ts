import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { serverEnv } from "@/env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Builds an FDSN-compliant GeoJSON query URL for fetching seismic event data.
 *
 * @param starttime - Start of the query time window.
 * @param endtime - End of the query time window.
 * @returns A fully-formed URL string pointing to the FDSN endpoint, requesting
 * GeoJSON format within the given time range.
 *
 * @example
 * fdnsUrl(new Date("2026-01-01"), new Date("2026-01-02"))
 * // "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2026-01-01T00:00:00.000Z&endtime=2026-01-02T00:00:00.000Z"
 */
export function fdnsUrl(starttime: Date, endtime: Date): string {
  return `${serverEnv.FDSN_BASE_URL}?format=geojson&starttime=${starttime.toISOString()}&endtime=${endtime.toISOString()}`;
}
