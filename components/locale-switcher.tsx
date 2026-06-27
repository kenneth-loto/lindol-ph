"use client";

import { Check, Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "@/i18n/navigation";
import { localeLabels, routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const t = useTranslations("Locale");
  const activeLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchLocale(nextLocale: string) {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("switch")}
            disabled={isPending}
          >
            <Languages className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {routing.locales.map((localeCode) => (
          <DropdownMenuItem
            key={localeCode}
            onClick={() => switchLocale(localeCode)}
          >
            <span className="flex-1">{localeLabels[localeCode]}</span>
            {activeLocale === localeCode && <Check className="size-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
