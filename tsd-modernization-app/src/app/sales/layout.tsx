import { requireRole } from "@/lib/auth/require";
import { PortalNav } from "@/components/PortalNav";

export default async function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireRole("admin");
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <PortalNav email={user.email ?? ""} isAdmin />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
