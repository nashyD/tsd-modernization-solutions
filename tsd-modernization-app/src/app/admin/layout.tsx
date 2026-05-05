import Link from "next/link";
import { requireRole } from "@/lib/auth/require";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireRole("admin");
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-zinc-200 bg-[#13294B] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="text-base font-semibold">
            TSD Admin
          </Link>
          <nav className="flex items-center gap-5 text-sm">
            <Link href="/admin/clients" className="hover:underline">
              Clients
            </Link>
            <Link href="/app" className="text-white/70 hover:text-white">
              Portal view
            </Link>
            <span className="text-white/60">{user.email}</span>
          </nav>
        </div>
      </header>
      <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        {children}
      </div>
    </div>
  );
}
