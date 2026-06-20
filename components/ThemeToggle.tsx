"use client";

import { SunIcon, MoonIcon } from "@/components/icons";

export function ThemeToggle() {
  const toggle = () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // localStorage may be blocked in private browsing
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="flex h-10 w-10 items-center justify-center rounded-full bg-surface border border-border text-foreground transition-colors duration-200 hover:border-foreground/40 hover:text-foreground active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent cursor-pointer"
    >
      {/* Both icons always rendered — CSS shows the correct one, no hydration mismatch */}
      <span className="dark:hidden"><MoonIcon size={18} /></span>
      <span className="hidden dark:block"><SunIcon size={18} /></span>
    </button>
  );
}
