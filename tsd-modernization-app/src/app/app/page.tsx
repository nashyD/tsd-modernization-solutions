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
import { requireUser, getMemberships } from "@/lib/auth/require";
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
  const ownerships = memberships.filter((m) => m.role !== "admin");

  if (ownerships.length === 0) {
    return (
      <div className="rounded-[14px] border border-zinc-200 bg-white p-10">
        <h1 className="text-2xl font-semibold tracking-tight text-[#13294B]">
          You&apos;re signed in
        </h1>
        <p className="mt-2 max-w-prose text-zinc-700">
          You don&apos;t have a TSD client account linked to{" "}
          <span className="font-medium text-zinc-900">{user.email}</span> yet.
          Email{" "}
          <a
            className="font-medium text-[#13294B] underline underline-offset-2 hover:text-[#1f3666]"
            href="mailto:hello@tsd-modernization.com"
          >
            hello@tsd-modernization.com
          </a>{" "}
          and we&apos;ll get you set up.
        </p>
      </div>
    );
  }

  const primary = ownerships[0];
  const client = primary.clients;
  const pkg = client ? packageByTier(client.package_tier) : null;

  return (
    <div className="space-y-10">
      <header className="animate-fade-up">
        <div className="flex items-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4B9CD3]">
            Welcome back
          </p>
          {pkg && <Badge tone="blue">{pkg.name}</Badge>}
        </div>
        <h1 className="mt-2 text-balance text-[34px] font-semibold leading-[1.05] tracking-tight text-[#13294B] sm:text-[40px]">
          {client?.name ?? "Your TSD Portal"}
        </h1>
        <p className="mt-3 max-w-2xl text-pretty text-base leading-relaxed text-zinc-600">
          A single place to see what we&apos;re building for you, what&apos;s
          shipping, and what your AI receptionist sounds like in production.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map(({ title, desc, href, icon: Icon, delay }) => (
          <li key={href} className={delay}>
            <Link
              href={href}
              className="group flex h-full flex-col rounded-[14px] border border-zinc-200/80 bg-white p-5 shadow-[0_1px_2px_rgb(15_23_42_/_0.04)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[#4B9CD3]/60 hover:shadow-[0_8px_24px_rgb(19_41_75_/_0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B9CD3]/40 focus-visible:ring-offset-2"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#eef7fc] text-[#13294B] transition-colors group-hover:bg-[#13294B] group-hover:text-white">
                <Icon size={20} strokeWidth={1.75} />
              </div>
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-[#13294B]">{title}</h3>
                <ArrowUpRight
                  size={18}
                  strokeWidth={1.75}
                  className="flex-none translate-x-0 text-zinc-400 transition-all duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#13294B]"
                  aria-hidden
                />
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                {desc}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
