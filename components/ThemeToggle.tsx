"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-full border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-white/5 backdrop-blur-md shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 transition"
    >
      <span className="text-xs">{isDark ? "🌙" : "☀️"}</span>
      <span>{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}
