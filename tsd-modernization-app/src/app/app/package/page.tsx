import { Check, Package as PackageIcon } from "lucide-react";
import { requireUser, getMemberships } from "@/lib/auth/require";
import { packageByTier } from "@/lib/packages";
import BackLink from "@/components/BackLink";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function PackagePage() {
  const { user } = await requireUser();
  const memberships = await getMemberships(user.id);
  const ownership = memberships.find((m) => m.role !== "admin");
  const client = ownership?.clients;
  const pkg = client ? packageByTier(client.package_tier) : null;

  if (!pkg) {
    return (
      <div className="space-y-6">
        <BackLink href="/app" label="Dashboard" />
        <EmptyState
          icon={<PackageIcon size={20} />}
          title="No package assigned yet"
          description="The TSD team will assign you a package once your engagement starts."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <BackLink href="/app" label="Dashboard" />

      <PageHeader
        eyebrow="Your package"
        title={pkg.name}
        description={pkg.tagline}
      />

      <div className="flex flex-wrap items-baseline gap-3">
        <span className="font-display text-5xl font-semibold tracking-tight text-[var(--text)]">
          {pkg.price}
        </span>
        <span className="text-sm text-[var(--text-subtle)] line-through">
          {pkg.anchor}
        </span>
        <Badge tone="blue">Founding cohort rate</Badge>
      </div>

      <section className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
        <h2 className="text-base font-semibold tracking-tight text-[var(--text)]">
          What&apos;s included
        </h2>
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
        {pkg.cap && (
          <p className="mt-6 border-t border-[var(--border)] pt-4 text-sm text-[var(--text-subtle)]">
            {pkg.cap}
          </p>
        )}
      </section>
    </div>
  );
}
