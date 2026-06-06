import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/require";
import { PageHeader } from "@/components/ui/PageHeader";
import PasskeyManager from "./PasskeyManager";

export const metadata: Metadata = {
  title: "Account · TSD Client Portal",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const { user } = await requireUser();
  return (
    <div className="space-y-8 animate-fade-up">
      <PageHeader
        eyebrow="Account"
        title="Account & security"
        description="Manage how you sign in to your portal."
      />
      <section className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
        <p className="text-sm text-[var(--text-muted)]">Signed in as</p>
        <p className="mt-0.5 font-medium text-[var(--text)]">{user.email}</p>
      </section>
      <PasskeyManager />
    </div>
  );
}
