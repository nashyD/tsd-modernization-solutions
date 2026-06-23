import {
  requireUser,
  getMemberships,
  getActiveClient,
} from "@/lib/auth/require";
import { packageByTier } from "@/lib/packages";
import { Badge } from "@/components/ui/Badge";
import PasskeyNudge from "./PasskeyNudge";
import { PackageSection } from "./_sections/PackageSection";
import { ProgressSection } from "./_sections/ProgressSection";

export const dynamic = "force-dynamic";

export default async function PortalHome() {
  const { user } = await requireUser();
  const memberships = await getMemberships(user.id);
  const active = await getActiveClient(memberships);

  if (!active) {
    return (
      <div className="space-y-6 animate-fade-up">
        <PasskeyNudge />
        <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-10 shadow-[var(--shadow-card)]">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--text)]">
            You&apos;re signed in
          </h1>
          <p className="mt-2 max-w-prose text-[var(--text-muted)]">
            You don&apos;t have a TSD client account linked to{" "}
            <span className="font-medium text-[var(--text)]">{user.email}</span>{" "}
            yet. Email{" "}
            <a
              className="font-medium text-[var(--accent)] underline underline-offset-2 hover:text-[var(--accent-hover)]"
              href="mailto:hello@tsd-modernization.com"
            >
              hello@tsd-modernization.com
            </a>{" "}
            and we&apos;ll get you set up.
          </p>
        </div>
      </div>
    );
  }

  const client = active.client;
  const pkg = packageByTier(client.package_tier);

  return (
    <div className="space-y-10">
      <PasskeyNudge />
      <header className="animate-fade-up">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Welcome back
          </p>
          {pkg && <Badge tone="blue">{pkg.name}</Badge>}
        </div>
        <h1 className="mt-2 text-balance font-display text-[34px] font-semibold leading-[1.05] tracking-tight text-[var(--text)] sm:text-[40px]">
          {client.name}
        </h1>
        <p className="mt-3 max-w-2xl text-pretty text-base leading-relaxed text-[var(--text-muted)]">
          A single place to see what we&apos;re building for you, what&apos;s
          shipping, and what your AI receptionist sounds like in production.
        </p>
      </header>

      <PackageSection tier={client.package_tier} />
      <ProgressSection clientId={active.client_id} />
    </div>
  );
}
