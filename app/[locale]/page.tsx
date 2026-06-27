import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ModeToggle } from "@/components/mode-toggle";
import { Spinner } from "@/components/ui/spinner";
import { HomePageContent } from "@/features/home-page";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations("HomePage");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-2xl tracking-tight">{t("title")}</h1>
          <div className="flex items-center gap-1">
            <LocaleSwitcher />
            <ModeToggle />
          </div>
        </div>
        <p className="text-base text-muted-foreground">{t("subtitle")}</p>
      </div>

      <Suspense
        fallback={
          <div className="mx-auto flex min-h-[50vh] items-center gap-2">
            <Spinner />
            <p className="text-muted-foreground text-sm">{t("loading")}</p>
          </div>
        }
      >
        <HomePageContent />
      </Suspense>
    </div>
  );
}
