import { Eye } from "lucide-react";
import {
  requireUser,
  getMemberships,
  getActiveClient,
  isUserAppAdmin,
} from "@/lib/auth/require";
import { PortalNav } from "@/components/PortalNav";
import { exitClientView } from "@/app/admin/view-as-actions";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireUser();
  const memberships = await getMemberships(user.id);
  const isAdmin = await isUserAppAdmin(user.id);
  const active = await getActiveClient(memberships, user.id);
  const impersonating = active?.impersonating ?? false;

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <PortalNav email={user.email ?? ""} isAdmin={isAdmin} />
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
