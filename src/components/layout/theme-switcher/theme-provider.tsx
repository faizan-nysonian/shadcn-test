"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { THEME_COOKIE_KEY } from "@/lib/theme";

function ThemeCookieSyncer() {
  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
    if (resolvedTheme) {
      document.cookie = `${THEME_COOKIE_KEY}=${resolvedTheme}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, [resolvedTheme]);

  return null;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey={THEME_COOKIE_KEY}
      {...props}
    >
      <ThemeCookieSyncer />
      {children}
    </NextThemesProvider>
  );
}