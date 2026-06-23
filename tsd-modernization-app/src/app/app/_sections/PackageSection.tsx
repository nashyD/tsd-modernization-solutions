import { Check, Package as PackageIcon, ShieldCheck } from "lucide-react";
import { packageByTier } from "@/lib/packages";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";

/**
 * "Your package" — what the client bought, what's included, and the guarantee.
 * Presentational + synchronous (the package is derived from the tier, no I/O).
 * Lives as a section so it can sit inline on the portal Overview rather than
 * owning its own route. Falls back to a compact empty state when no tier is
 * assigned yet.
 */
export function PackageSection({ tier }: { tier: string }) {
  const pkg = packageByTier(tier);
  if (!pkg) {
    return (
      <EmptyState
        icon={<PackageIcon size={20} />}
        title="No package assigned yet"
        description="The TSD team will assign you a package once your engagement starts."
      />
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
            Your package
          </h2>
          <p className="mt-1 font-display text-2xl font-semibold tracking-tight text-[var(--text)]">
            {pkg.name}
          </p>
          {pkg.tagline && (
            <p className="mt-1 max-w-prose text-sm leading-relaxed text-[var(--text-muted)]">
              {pkg.tagline}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-display text-3xl font-semibold tracking-tight text-[var(--text)]">
            {pkg.price}
          </span>
          {pkg.anchor && (
            <span className="text-sm text-[var(--text-subtle)] line-through">
              {pkg.anchor}
            </span>
          )}
          {pkg.cap && <Badge tone="blue">{pkg.cap}</Badge>}
        </div>
      </div>

      <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
        <h3 className="text-base font-semibold tracking-tight text-[var(--text)]">
          What&apos;s included
        </h3>
        <ul className="mt-5 grid gap-3.5 sm:grid-cols-2">
          {pkg.included.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                <Check size={13} strokeWidth={3} />
              </span>
              <span className="text-sm leading-relaxed text-[var(--text-muted)]">
                {item}
              </span>
            </li>
          ))}
        </ul>

        {pkg.guarantee && (
          <div className="mt-6 flex items-start gap-2.5 border-t border-[var(--border)] pt-4 text-sm text-[var(--text-muted)]">
            <ShieldCheck
              size={16}
              strokeWidth={2}
              className="mt-0.5 flex-none text-[var(--success)]"
              aria-hidden
            />
            <span>
              <span className="font-semibold text-[var(--text)]">
                Guarantee.
              </span>{" "}
              {pkg.guarantee}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
