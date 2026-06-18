import { requireRole } from "@/lib/auth/require";
import { PortalNav } from "@/components/PortalNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireRole("admin");
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <PortalNav email={user.email ?? ""} isAdmin />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 sm:py-12">
        {children}
      </main>
    </div>
  );
}
