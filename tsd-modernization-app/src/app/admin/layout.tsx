import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { requireRole } from "@/lib/auth/require";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SignOutButton } from "@/components/SignOutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireRole("admin");
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            <Logo height={20} />
            <span className="text-sm font-semibold tracking-tight text-[var(--text)]">
              TSD Admin
            </span>
          </Link>
          <nav className="flex items-center gap-5 text-sm">
            <Link
              href="/admin/clients"
              className="text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
            >
              Clients
            </Link>
            <Link
              href="/app"
              className="inline-flex items-center gap-1 text-[var(--text-subtle)] transition-colors hover:text-[var(--text)]"
            >
              Portal view
              <ArrowUpRight size={13} strokeWidth={2} aria-hidden />
            </Link>
            <span className="hidden truncate text-xs text-[var(--text-subtle)] sm:inline">
              {user.email}
            </span>
            <ThemeToggle />
            <SignOutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 sm:py-12">
        {children}
      </main>
    </div>
  );
}
