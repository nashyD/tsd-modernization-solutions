import { Globe } from "lucide-react";
import {
  requireUser,
  getMemberships,
  getActiveClient,
  isUserAppAdmin,
} from "@/lib/auth/require";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { DeploymentSection } from "../_sections/DeploymentSection";
import { SnapshotSection } from "../_sections/SnapshotSection";

export const dynamic = "force-dynamic";

export default async function SitePage() {
  const { user } = await requireUser();
  const memberships = await getMemberships(user.id);
  const active = await getActiveClient(memberships, user.id);

  if (!active) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={<Globe size={20} />}
          title="No client linked yet"
          description="Once you're linked to a TSD client, your live site and monthly metrics show up here."
        />
      </div>
    );
  }

  const isAdmin = await isUserAppAdmin(user.id);

  return (
    <div className="space-y-12 animate-fade-up">
      <PageHeader
        eyebrow="Site"
        title="Your live site"
        description="The latest production build and how your online presence is trending month over month."
      />
      <DeploymentSection clientId={active.client_id} isAdmin={isAdmin} />
      <SnapshotSection clientId={active.client_id} />
    </div>
  );
}
