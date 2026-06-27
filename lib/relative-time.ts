import { DAYS, HOURS, MINUTES, WEEKS } from "./constants";

/**
 * Formats a past Unix epoch timestamp (ms) as a relative "time ago" string,
 * falling back to a short date once it's a week or older.
 *
 * @param epochMs - The timestamp to format, in milliseconds since the Unix epoch.
 * @param t - Optional translate function for locale-aware strings.
 * @returns A relative time string (e.g. `"Just now"`, `"5m ago"`, `"3h ago"`,
 * `"2d ago"`), or a short date string (e.g. `"Apr 25"`) if older than a week.
 */
export function formatRelativeTime(
  epochMs: number,
  t?: (key: string, params?: Record<string, string | number>) => string,
): string {
  const diffMs = Date.now() - epochMs;

  if (diffMs < MINUTES) return t?.("justNow") ?? "Just now";

  if (diffMs < HOURS)
    return (
      t?.("minutesAgo", { count: Math.floor(diffMs / MINUTES) }) ??
      `${Math.floor(diffMs / MINUTES)}m ago`
    );

  if (diffMs < DAYS)
    return (
      t?.("hoursAgo", { count: Math.floor(diffMs / HOURS) }) ??
      `${Math.floor(diffMs / HOURS)}h ago`
    );

  if (diffMs < WEEKS)
    return (
      t?.("daysAgo", { count: Math.floor(diffMs / DAYS) }) ??
      `${Math.floor(diffMs / DAYS)}d ago`
    );

  return new Date(epochMs).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Subtracts a number of weeks from a given date.
 *
 * @param date - The starting date.
 * @param weeks - Number of weeks to subtract.
 * @returns A new `Date` set to `weeks` weeks before `date`.
 *
 * @example
 * subtractWeeks(new Date("2026-04-25"), 2) // Date: 2026-04-11
 */
export function subtractWeeks(date: Date, weeks: number): Date {
  return new Date(date.getTime() - weeks * WEEKS);
}
