import { requireRole } from "@/lib/auth/require";

/**
 * Present mode (`/present/[id]`) lives OUTSIDE `/sales` on purpose: the sales
 * layout's internal nav (Admin / Candidates / Sign out / the rep's email) must
 * NOT render above the branded plan when the iPad is handed to a prospect. This
 * layout is deliberately chrome-free — the page draws its own TSD brand bar and
 * exit affordance. Auth is enforced here (no middleware in this app).
 */
export default async function PresentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("admin");
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6">{children}</main>
  );
}
