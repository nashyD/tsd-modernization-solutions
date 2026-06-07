import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/require";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
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
      <Card as="section" className="p-5">
        <p className="text-sm text-[var(--text-muted)]">Signed in as</p>
        <p className="mt-0.5 font-medium text-[var(--text)]">{user.email}</p>
      </Card>
      <PasskeyManager />
    </div>
  );
}
