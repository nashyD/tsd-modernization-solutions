import Link from "next/link";
import { requireUser, getMemberships } from "@/lib/auth/require";

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
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/app" className="text-base font-semibold text-[#13294B]">
            TSD Client Portal
          </Link>
          <nav className="flex items-center gap-5 text-sm text-zinc-700">
            <Link href="/app/package" className="hover:text-[#13294B]">
              Package
            </Link>
            <Link href="/app/progress" className="hover:text-[#13294B]">
              Progress
            </Link>
            <Link href="/app/deployment" className="hover:text-[#13294B]">
              Deployment
            </Link>
            <Link href="/app/voice" className="hover:text-[#13294B]">
              Voice
            </Link>
            <Link href="/app/snapshot" className="hover:text-[#13294B]">
              Snapshot
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="rounded-md bg-[#13294B] px-3 py-1.5 text-white"
              >
                Admin
              </Link>
            )}
            <span className="text-zinc-400">{user.email}</span>
          </nav>
        </div>
      </header>
      <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        {children}
      </div>
    </div>
  );
}
