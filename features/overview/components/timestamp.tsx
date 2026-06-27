"use client";

import { useTranslations } from "next-intl";
import { formatRelativeTime } from "@/lib/relative-time";

export function Timestamp({ timestamp }: { timestamp: number }) {
  const t = useTranslations("RelativeTime");

  return <span>{formatRelativeTime(timestamp, t)}</span>;
}
