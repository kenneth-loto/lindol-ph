"use client";

import { type ComponentProps, useEffect } from "react";
import {
  ThemeProvider as NextThemesProvider,
  useTheme,
} from "@/components/theme";
import { announce } from "@/lib/announce";
import { THEME_TOGGLE_KEY } from "@/lib/constants";

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  );
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme();
  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) {
        return;
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (event.key.toLowerCase() !== THEME_TOGGLE_KEY) {
        return;
      }

      if (isTypingTarget(event.target)) {
        return;
      }

      setTheme(nextTheme);
      announce(`Switched to ${nextTheme} theme`);
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [nextTheme, setTheme]);

  return null;
}

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <div
        aria-live="polite"
        aria-atomic="true"
        id="announcer"
        className="sr-only"
      />
      <ThemeHotkey />
      {children}
    </NextThemesProvider>
  );
}
