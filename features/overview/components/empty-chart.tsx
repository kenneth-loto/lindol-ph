"use client";

import { useTranslations } from "next-intl";

export function EmptyChart() {
  const t = useTranslations("Overview");

  return (
    <div className="flex h-65 items-center justify-center text-muted-foreground text-sm">
      {t("noData")}
    </div>
  );
}
