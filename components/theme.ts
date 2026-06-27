"use client";

import { createThemes } from "@teispace/next-themes";

export const { ThemeProvider, useTheme } = createThemes({
  themes: ["light", "dark"] as const,
  defaultTheme: "system",
  attribute: "class",
  storage: "hybrid",
  enableSystem: true,
  disableTransitionOnChange: true,
});
