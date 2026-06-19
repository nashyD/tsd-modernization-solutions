"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  LayoutGrid,
  LayoutDashboard,
  MapPin,
  MonitorSmartphone,
  Inbox,
  TicketPercent,
  Building2,
  Package,
  ListChecks,
  Rocket,
  Phone,
  Camera,
  ArrowUpRight,
  KeyRound,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SignOutButton } from "@/components/SignOutButton";

/**
 * Single shared header for the whole internal portal (Sales, Admin, Client
 * Portal). Replaces three drifting bespoke navs with one app-shell:
 *   row 1 — brand + workspace switcher (Sales / Admin / Portal, role-gated) + utility cluster
 *   row 2 — the current workspace's section tabs as a horizontally-scrollable
 *           strip (never crams or wraps on an iPad; gives the client portal real
 *           mobile nav, which the old `hidden md:flex` version lacked).
 * The active workspace + section are derived from the pathname, so adding a
 * route only means editing WORKSPACES below — the link set lives in one place.
 */

type WorkspaceKey = "sales" | "admin" | "portal";
type Section = { label: string; href: string; icon: LucideIcon; exact?: boolean };
type Workspace = {
  key: WorkspaceKey;
  label: string;
  href: string;
  adminOnly: boolean;
  sections: Section[];
};

const WORKSPACES: Workspace[] = [
  {
    key: "sales",
    label: "Sales",
    href: "/sales",
    adminOnly: true,
    sections: [
      { label: "Board", href: "/sales", icon: LayoutGrid, exact: true },
      { label: "Playbook", href: "/sales/playbook", icon: BookOpen },
      { label: "Near me", href: "/sales/next", icon: MapPin },
      { label: "Demos", href: "/sales/demos", icon: MonitorSmartphone },
      { label: "Candidates", href: "/sales/candidates", icon: Inbox },
      { label: "Codes", href: "/sales/codes", icon: TicketPercent },
    ],
  },
  {
    key: "admin",
    label: "Admin",
    href: "/admin",
    adminOnly: true,
    sections: [
      { label: "Overview", href: "/admin", icon: LayoutDashboard, exact: true },
      { label: "Clients", href: "/admin/clients", icon: Building2 },
    ],
  },
  {
    key: "portal",
    label: "Client Portal",
    href: "/app",
    adminOnly: false,
    sections: [
      { label: "Overview", href: "/app", icon: LayoutDashboard, exact: true },
      { label: "Package", href: "/app/package", icon: Package },
      { label: "Progress", href: "/app/progress", icon: ListChecks },
      { label: "Deployment", href: "/app/deployment", icon: Rocket },
      { label: "Voice", href: "/app/voice", icon: Phone },
      { label: "Snapshot", href: "/app/snapshot", icon: Camera },
    ],
  },
];

function isActive(pathname: string, href: string, exact?: boolean): boolean {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

export function PortalNav({
  email,
  isAdmin,
}: {
  email: string;
  isAdmin: boolean;
}) {
  const pathname = usePathname();
  const available = WORKSPACES.filter((w) => isAdmin || !w.adminOnly);
  const current =
    available.find((w) => isActive(pathname, w.href)) ?? available[0];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-md">
      {/* Row 1 — brand + workspace switcher + utility */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href={current.href}
            aria-label="TSD"
            className="flex shrink-0 items-center transition-opacity hover:opacity-80"
          >
            <Logo height={20} />
          </Link>
          {available.length > 1 ? (
            <div
              role="tablist"
              aria-label="Workspaces"
              className="flex items-center gap-0.5 rounded-[10px] border border-[var(--border)] bg-[var(--surface-2)] p-0.5"
            >
              {available.map((w) => {
                const active = current.key === w.key;
                return (
                  <Link
                    key={w.key}
                    href={w.href}
                    role="tab"
                    aria-selected={active}
                    className={`rounded-[7px] px-2.5 py-1.5 text-xs font-semibold tracking-tight transition-colors sm:px-3 ${
                      active
                        ? "bg-[var(--accent)] text-white shadow-sm"
                        : "text-[var(--text-muted)] hover:text-[var(--text)]"
                    }`}
                  >
                    {w.label}
                  </Link>
                );
              })}
            </div>
          ) : (
            <span className="text-sm font-semibold tracking-tight text-[var(--text)]">
              {current.label}
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <span className="mr-1 hidden max-w-[160px] truncate text-xs text-[var(--text-subtle)] lg:inline">
            {email}
          </span>
          {/* Plain <a> — `/` is a Vercel rewrite to the marketing Vite app, not a
              Next route, so <Link> would client-route into the wrong handler. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            aria-label="Main site"
            title="Main site"
            className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs font-medium text-[var(--text-subtle)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
          >
            <span className="hidden sm:inline">Main site</span>
            <ArrowUpRight size={13} strokeWidth={2} aria-hidden />
          </a>
          <Link
            href="/app/account"
            aria-label="Account & security"
            title="Account & security"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-subtle)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
          >
            <KeyRound size={16} strokeWidth={1.75} />
          </Link>
          <ThemeToggle />
          <SignOutButton />
        </div>
      </div>

      {/* Row 2 — section tabs for the current workspace (scrollable, never crams) */}
      {current.sections.length > 1 && (
        <div className="border-t border-[var(--border)]/60">
          <nav
            aria-label={`${current.label} sections`}
            className="no-scrollbar mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 sm:px-5"
          >
            {current.sections.map((s) => {
              const active = isActive(pathname, s.href, s.exact);
              const Icon = s.icon;
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "border-[var(--accent)] text-[var(--text)]"
                      : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
                  }`}
                >
                  <Icon
                    size={15}
                    strokeWidth={2}
                    aria-hidden
                    className={active ? "text-[var(--accent)]" : ""}
                  />
                  {s.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
