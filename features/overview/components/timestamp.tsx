"use client";

import { formatRelativeTime } from "@/lib/relative-time";

export function Timestamp({ timestamp }: { timestamp: number }) {
  return <span>{formatRelativeTime(timestamp)}</span>;
}
