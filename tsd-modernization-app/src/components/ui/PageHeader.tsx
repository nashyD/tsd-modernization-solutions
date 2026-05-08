import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className = "",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header className={`flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between ${className}`}>
      <div className="min-w-0 flex-1">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-1 text-balance font-display text-3xl font-semibold leading-[1.05] tracking-tight text-[var(--text)] sm:text-[34px]">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-pretty text-base leading-relaxed text-[var(--text-muted)] sm:max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}
