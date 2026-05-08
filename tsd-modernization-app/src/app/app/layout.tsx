import Link from "next/link";
import { Shield } from "lucide-react";
import { requireUser, getMemberships } from "@/lib/auth/require";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireUser();
  const memberships = await getMemberships(user.id);
  const isAdmin = memberships.some((m) => m.role === "admin");

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
          <Link
            href="/app"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            <Logo size={22} />
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
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
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
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 sm:py-12">
        {children}
      </main>
    </div>
  );
}
