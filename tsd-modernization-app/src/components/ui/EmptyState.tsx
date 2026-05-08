import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: {
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[16px] border border-dashed border-[var(--border-strong)] bg-[var(--surface)] px-6 py-14 text-center ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,var(--accent-soft),transparent_60%)]" />
      <div className="relative flex flex-col items-center">
        {icon && (
          <div className="relative mb-5">
            <div className="absolute inset-0 -m-2 rounded-full bg-[var(--accent-soft)] blur-md" aria-hidden />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-2)] text-[var(--accent)] shadow-[var(--shadow-card)]">
              {icon}
            </div>
          </div>
        )}
        <h3 className="text-base font-semibold text-[var(--text)]">{title}</h3>
        {description && (
          <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--text-muted)]">
            {description}
          </p>
        )}
        {action && <div className="mt-6">{action}</div>}
      </div>
    </div>
  );
}
