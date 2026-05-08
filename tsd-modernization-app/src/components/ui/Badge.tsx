import type { ReactNode } from "react";

type Tone = "neutral" | "navy" | "blue" | "amber" | "red" | "emerald";

const TONE: Record<Tone, string> = {
  neutral: "bg-zinc-100 text-zinc-700",
  navy: "bg-[#13294B] text-white",
  blue: "bg-[#eef7fc] text-[#0e3d5e]",
  amber: "bg-amber-50 text-amber-900 border border-amber-200",
  red: "bg-red-50 text-red-900 border border-red-200",
  emerald: "bg-emerald-50 text-emerald-900 border border-emerald-200",
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
