import { DAYS, HOURS, MINUTES, WEEKS } from "./constants";

/**
 * Formats a past Unix epoch timestamp (ms) as a relative "time ago" string,
 * falling back to a short date once it's a week or older.
 *
 * @param epochMs - The timestamp to format, in milliseconds since the Unix epoch.
 * @returns A relative time string (e.g. `"just now"`, `"5m ago"`, `"3h ago"`,
 * `"2d ago"`), or a short date string (e.g. `"Apr 25"`) if older than a week.
 *
 * @example
 * formatRelativeTime(Date.now() - 30_000)              // "just now"
 * formatRelativeTime(Date.now() - 5 * 60 * 1000)       // "5m ago"
 * formatRelativeTime(Date.now() - 3 * 60 * 60 * 1000)  // "3h ago"
 * formatRelativeTime(Date.now() - 2 * 24 * 60 * 60 * 1000)  // "2d ago"
 * formatRelativeTime(Date.now() - 10 * 86_400_000)     // "Apr 25"
 */
export function formatRelativeTime(epochMs: number): string {
  const diffMs = Date.now() - epochMs;

  if (diffMs < MINUTES) return "just now";
  if (diffMs < HOURS) return `${Math.floor(diffMs / MINUTES)}m ago`;
  if (diffMs < DAYS) return `${Math.floor(diffMs / HOURS)}h ago`;
  if (diffMs < WEEKS) return `${Math.floor(diffMs / DAYS)}d ago`;

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
