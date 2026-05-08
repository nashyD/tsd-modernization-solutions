"use client";
import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";

function getSnapshot(): Theme {
  return (localStorage.getItem("tsd-theme") as Theme | null) ?? "dark";
}
function getServerSnapshot(): Theme {
  return "dark";
}
function subscribe(cb: () => void) {
  // Storage events fire across tabs; our toggle dispatches "storage" manually
  // so listeners in the same tab also re-render.
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("tsd-theme", next);
    if (next === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
    window.dispatchEvent(new Event("storage"));
  }

  const Icon = theme === "dark" ? Sun : Moon;
  const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-subtle)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text)] ${className}`}
    >
      <Icon size={16} strokeWidth={1.75} />
    </button>
  );
}
