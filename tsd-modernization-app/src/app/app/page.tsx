import Link from "next/link";
import { requireUser, getMemberships } from "@/lib/auth/require";
import { packageByTier } from "@/lib/packages";

export default async function PortalHome() {
  const { user } = await requireUser();
  const memberships = await getMemberships(user.id);
  const ownerships = memberships.filter((m) => m.role !== "admin");

  if (ownerships.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-8">
        <h1 className="text-2xl font-semibold text-[#13294B]">
          You&apos;re signed in
        </h1>
        <p className="mt-2 text-zinc-700">
          You don&apos;t have a TSD client account linked to {user.email} yet.
          Email <a className="underline" href="mailto:hello@tsd-modernization.com">hello@tsd-modernization.com</a>{" "}
          and we&apos;ll get you set up.
        </p>
      </div>
    );
  }

  const primary = ownerships[0];
  const client = primary.clients as
    | { id: string; name: string; package_tier: string }
    | null;
  const pkg = client ? packageByTier(client.package_tier) : null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-[#4B9CD3]">
          Welcome back
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#13294B]">
          {client?.name ?? "Your TSD Portal"}
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <PortalCard
          title="Your package"
          desc={pkg ? pkg.name : "Not yet assigned"}
          href="/app/package"
        />
        <PortalCard
          title="Progress"
          desc="See what's done, doing, and queued."
          href="/app/progress"
        />
        <PortalCard
          title="Deployment"
          desc="Latest production build of your site."
          href="/app/deployment"
        />
        <PortalCard
          title="Voice"
          desc="Try your AI receptionist live."
          href="/app/voice"
        />
        <PortalCard
          title="Monthly snapshot"
          desc="See how your presence is trending vs last month."
          href="/app/snapshot"
        />
      </div>
    </div>
  );
}

function PortalCard({
  title,
  desc,
  href,
}: {
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-lg border border-zinc-200 bg-white p-5 transition hover:border-[#4B9CD3] hover:shadow-sm"
    >
      <h3 className="font-semibold text-[#13294B]">{title}</h3>
      <p className="mt-1 text-sm text-zinc-600">{desc}</p>
    </Link>
  );
}
