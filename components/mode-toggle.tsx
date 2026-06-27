"use client";

import { useTheme } from "@teispace/next-themes";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const t = useTranslations("Theme");
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative cursor-pointer"
      onClick={toggleTheme}
      aria-label={t("toggle")}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />

      <Moon className="dark:-rotate-90 absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:scale-0" />

      <span className="sr-only">{t("toggle")}</span>
    </Button>
  );
}
