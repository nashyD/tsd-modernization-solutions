import Link from "next/link";
import { Shield, LayoutGrid, MapPin } from "lucide-react";
import { requireRole } from "@/lib/auth/require";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SignOutButton } from "@/components/SignOutButton";

export default async function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("admin");
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <Link
            href="/sales"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            <Logo height={20} />
            <span className="text-sm font-semibold tracking-tight text-[var(--text)]">
              Sales
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/sales/next"
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] shadow-sm transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <MapPin size={14} strokeWidth={2.25} aria-hidden />
              Near me
            </Link>
            <Link
              href="/app"
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] shadow-sm transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <LayoutGrid size={14} strokeWidth={2.25} aria-hidden />
              Portal
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] shadow-sm transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <Shield size={14} strokeWidth={2.25} aria-hidden />
              Admin
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
