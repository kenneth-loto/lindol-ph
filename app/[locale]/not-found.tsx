// "use client";

import { ArrowLeftIcon, FileQuestionMarkIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileQuestionMarkIcon />
        </EmptyMedia>
        <EmptyTitle as="h1" className="font-semibold text-lg">
          {t("title")}
        </EmptyTitle>
        <EmptyDescription>{t("description")}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link href="/" className={buttonVariants()}>
          <ArrowLeftIcon aria-hidden="true" />
          {t("backHome")}
        </Link>
      </EmptyContent>
    </Empty>
  );
}
