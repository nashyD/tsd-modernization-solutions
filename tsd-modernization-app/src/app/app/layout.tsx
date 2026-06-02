import Link from "next/link";
import { Shield, ArrowUpRight, Eye, TrendingUp } from "lucide-react";
import {
  requireUser,
  getMemberships,
  getActiveClient,
} from "@/lib/auth/require";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SignOutButton } from "@/components/SignOutButton";
import { exitClientView } from "@/app/admin/view-as-actions";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireUser();
  const memberships = await getMemberships(user.id);
  const isAdmin = memberships.some((m) => m.role === "admin");
  const active = await getActiveClient(memberships);
  const impersonating = active?.impersonating ?? false;

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
          <Link
            href="/app"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            <Logo height={20} />
            <span className="text-sm font-semibold tracking-tight text-[var(--text)]">
              Client Portal
            </span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-[var(--text-muted)] md:flex">
            <Link href="/app/package" className="hover:text-[var(--accent)]">
              Package
            </Link>
            <Link href="/app/progress" className="hover:text-[var(--accent)]">
              Progress
            </Link>
            <Link href="/app/deployment" className="hover:text-[var(--accent)]">
              Deployment
            </Link>
            <Link href="/app/voice" className="hover:text-[var(--accent)]">
              Voice
            </Link>
            <Link href="/app/snapshot" className="hover:text-[var(--accent)]">
              Snapshot
            </Link>
            {/* Plain <a> — `/` is a Vercel rewrite to the marketing Vite app,
                not a Next route. Next's <Link> would client-side route into the
                audit-app's / handler instead of bouncing to the marketing site. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              className="inline-flex items-center gap-1 text-[var(--text-subtle)] hover:text-[var(--text)]"
            >
              Main site
              <ArrowUpRight size={13} strokeWidth={2} aria-hidden />
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isAdmin && (
              <Link
                href="/sales"
                className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] shadow-sm transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <TrendingUp size={14} strokeWidth={2.25} aria-hidden />
                Sales
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 rounded-md bg-[var(--primary-bg)] px-3 py-1.5 text-xs font-semibold text-[var(--primary-fg)] shadow-sm transition-colors hover:bg-[var(--primary-bg-hover)]"
              >
                <Shield size={14} strokeWidth={2.25} aria-hidden />
                Admin
              </Link>
            )}
            <span className="hidden truncate text-xs text-[var(--text-subtle)] sm:inline">
              {user.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>
      {impersonating && active && (
        <div className="border-b border-[var(--warning)]/30 bg-[var(--warning-soft)]">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-2.5 text-sm text-[var(--warning)]">
            <div className="flex items-center gap-2">
              <Eye size={14} strokeWidth={2.25} aria-hidden />
              <span>
                Viewing as{" "}
                <span className="font-semibold">{active.client.name}</span> —
                this is exactly what the client sees.
              </span>
            </div>
            <form action={exitClientView}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-md border border-[var(--warning)]/40 bg-transparent px-2.5 py-1 text-xs font-semibold text-[var(--warning)] transition-colors hover:bg-[var(--warning)]/10"
              >
                Exit view
              </button>
            </form>
          </div>
        </div>
      )}
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 sm:py-12">
        {children}
      </main>
    </div>
  );
}
