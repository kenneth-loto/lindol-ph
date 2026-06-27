import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fil"],
  defaultLocale: "en",
});

export const localeLabels: Record<(typeof routing.locales)[number], string> = {
  en: "English",
  fil: "Filipino",
};
