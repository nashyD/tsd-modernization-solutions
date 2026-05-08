import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { requireRole } from "@/lib/auth/require";
import { Logo } from "@/components/ui/Logo";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireRole("admin");
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-40 border-b border-zinc-700/80 bg-[#0e1f3a] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            <Logo size={22} />
            <span className="text-sm font-semibold tracking-tight">
              TSD Admin
            </span>
          </Link>
          <nav className="flex items-center gap-5 text-sm">
            <Link
              href="/admin/clients"
              className="text-white/80 transition-colors hover:text-white"
            >
              Clients
            </Link>
            <Link
              href="/app"
              className="inline-flex items-center gap-1 text-white/60 transition-colors hover:text-white"
            >
              Portal view
              <ArrowUpRight size={13} strokeWidth={2} aria-hidden />
            </Link>
            <span className="hidden truncate text-xs text-white/50 sm:inline">
              {user.email}
            </span>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 sm:py-12">
        {children}
      </main>
    </div>
  );
}
