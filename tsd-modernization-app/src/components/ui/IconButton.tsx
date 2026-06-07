import type { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * Small 32px icon-only button with the portal's standard hover/focus treatment.
 * `label` becomes both the accessible name and the tooltip. `danger` swaps the
 * hover to the danger tone (for destructive actions like remove).
 */
export function IconButton({
  label,
  danger = false,
  className = "",
  children,
  ...rest
}: {
  label: string;
  danger?: boolean;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label" | "title">) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 ${
        danger
          ? "text-[var(--text-subtle)] hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]"
          : "text-[var(--text-subtle)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
