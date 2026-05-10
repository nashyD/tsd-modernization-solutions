import Link from "next/link";
import {
  Package,
  ListChecks,
  CloudUpload,
  PhoneCall,
  LineChart,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import {
  requireUser,
  getMemberships,
  getActiveClient,
} from "@/lib/auth/require";
import { packageByTier } from "@/lib/packages";
import { Badge } from "@/components/ui/Badge";

interface ModuleCard {
  title: string;
  desc: string;
  href: string;
  icon: LucideIcon;
  delay: string;
}

const MODULES: ModuleCard[] = [
  {
    title: "Your package",
    desc: "What you bought, what's included, and the founding-cohort terms.",
    href: "/app/package",
    icon: Package,
    delay: "animate-fade-up-d100",
  },
  {
    title: "Progress",
    desc: "What's done, what we're on, and what's queued for the build.",
    href: "/app/progress",
    icon: ListChecks,
    delay: "animate-fade-up-d200",
  },
  {
    title: "Deployment",
    desc: "The latest production build of your site, every push tracked.",
    href: "/app/deployment",
    icon: CloudUpload,
    delay: "animate-fade-up-d300",
  },
  {
    title: "Voice",
    desc: "Place a live test call to your AI receptionist.",
    href: "/app/voice",
    icon: PhoneCall,
    delay: "animate-fade-up-d400",
  },
  {
    title: "Monthly snapshot",
    desc: "How your online presence is trending vs. last month.",
    href: "/app/snapshot",
    icon: LineChart,
    delay: "animate-fade-up-d500",
  },
];

export default async function PortalHome() {
  const { user } = await requireUser();
  const memberships = await getMemberships(user.id);
  const active = await getActiveClient(memberships);

  if (!active) {
    return (
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
    );
  }

  const client = active.client;
  const pkg = packageByTier(client.package_tier);

  return (
    <div className="space-y-10">
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

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map(({ title, desc, href, icon: Icon, delay }) => (
          <li key={href} className={delay}>
            <Link
              href={href}
              className="group flex h-full flex-col rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-card-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] transition-colors group-hover:bg-[var(--accent)] group-hover:text-[var(--primary-fg)]">
                <Icon size={20} strokeWidth={1.75} />
              </div>
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-[var(--text)]">{title}</h3>
                <ArrowUpRight
                  size={18}
                  strokeWidth={1.75}
                  className="flex-none translate-x-0 text-[var(--text-subtle)] transition-all duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--accent)]"
                  aria-hidden
                />
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-muted)]">
                {desc}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
