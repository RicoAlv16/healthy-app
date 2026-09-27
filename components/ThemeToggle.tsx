"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  variant?: "default" | "compact" | "pill";
  showLabel?: boolean;
}

export default function ThemeToggle({
  className = "",
  variant = "default",
  showLabel = false,
}: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<"light" | "dark">;
      if (customEvent.detail) {
        setTheme(customEvent.detail);
      } else {
        const currentDark = document.documentElement.classList.contains("dark");
        setTheme(currentDark ? "dark" : "light");
      }
    };

    window.addEventListener("care-theme-change", handleThemeChange);
    return () => window.removeEventListener("care-theme-change", handleThemeChange);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);

    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      try {
        localStorage.setItem("care_theme", "dark");
      } catch (err) {
        console.error(err);
      }
    } else {
      document.documentElement.classList.remove("dark");
      try {
        localStorage.setItem("care_theme", "light");
      } catch (err) {
        console.error(err);
      }
    }

    window.dispatchEvent(
      new CustomEvent("care-theme-change", { detail: nextTheme })
    );
  };

  // Tant que le composant n'est pas monté côté client, on rend un placeholder pour éviter les erreurs d'hydratation
  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 animate-pulse ${className}`}
      />
    );
  }

  const isDark = theme === "dark";

  if (variant === "pill") {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
        title={isDark ? "Passer en mode clair (Clarté)" : "Passer en mode sombre (Nuit)"}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all active:scale-95 text-xs font-bold ${
          isDark
            ? "bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700"
            : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
        } ${className}`}
      >
        {isDark ? (
          <>
            <Sun className="w-4 h-4 text-amber-400 rotate-0 transition-transform duration-300" />
            {showLabel && <span>Mode Clair</span>}
          </>
        ) : (
          <>
            <Moon className="w-4 h-4 text-teal-600 transition-transform duration-300" />
            {showLabel && <span>Mode Sombre</span>}
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
      title={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      className={`relative p-2 rounded-xl border transition-all duration-300 active:scale-90 flex items-center justify-center ${
        isDark
          ? "bg-slate-800/90 hover:bg-slate-700 text-amber-300 border-slate-700 shadow-sm"
          : "bg-slate-100 hover:bg-slate-200/90 text-slate-700 border-slate-200/80 shadow-2xs"
      } ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 animate-spin-slow hover:rotate-45 transition-transform" />
      ) : (
        <Moon className="w-4 h-4 text-teal-700 dark:text-teal-400 hover:-rotate-12 transition-transform" />
      )}
      {showLabel && (
        <span className="ml-2 text-xs font-semibold">
          {isDark ? "Clair" : "Sombre"}
        </span>
      )}
    </button>
  );
}
