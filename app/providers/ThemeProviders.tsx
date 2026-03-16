"use client";

import { ThemeProvider, useTheme } from "next-themes";
import { ReactNode, useEffect } from "react";

function ThemeClassSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!resolvedTheme) return;
    const isDark = resolvedTheme === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    document.body.classList.toggle("dark", isDark);
  }, [resolvedTheme]);

  return null;
}

export default function AppThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
    >
      <ThemeClassSync />
      {children}
    </ThemeProvider>
  );
}
