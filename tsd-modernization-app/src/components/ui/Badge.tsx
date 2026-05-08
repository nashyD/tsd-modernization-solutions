import type { ReactNode } from "react";

type Tone = "neutral" | "navy" | "blue" | "amber" | "red" | "emerald";

const TONE: Record<Tone, string> = {
  neutral: "bg-[var(--surface-2)] text-[var(--text-muted)]",
  navy: "bg-[var(--navy)] text-white light:bg-[var(--navy)]",
  blue: "bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/30",
  amber:
    "bg-[var(--warning-soft)] text-[var(--warning)] border border-[var(--warning)]/30",
  red: "bg-[var(--danger-soft)] text-[var(--danger)] border border-[var(--danger)]/30",
  emerald:
    "bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success)]/30",
};

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${TONE[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
