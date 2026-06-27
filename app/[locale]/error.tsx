"use client";

import * as Sentry from "@sentry/nextjs";
import { RotateCcw, ServerCrash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface ErrorProps {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}

export default function ErrorPage({ error, unstable_retry }: ErrorProps) {
  const t = useTranslations("ErrorPage");

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ServerCrash />
        </EmptyMedia>
        <EmptyTitle as="h1" className="font-semibold text-lg">
          {t("title")}
        </EmptyTitle>
        <EmptyDescription>{t("description")}</EmptyDescription>
        {error.digest && (
          <p className="font-mono text-muted-foreground text-xs">
            {t("errorId", { digest: error.digest })}
          </p>
        )}
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={() => unstable_retry()}>
          <RotateCcw aria-hidden="true" />
          {t("retry")}
        </Button>
      </EmptyContent>
    </Empty>
  );
}
