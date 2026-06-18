import { PhoneCall } from "lucide-react";
import {
  requireUser,
  getMemberships,
  getActiveClient,
} from "@/lib/auth/require";
import { supabaseAdmin } from "@/lib/supabase/admin";
import VoiceWidget from "./VoiceWidget";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";

export default async function VoicePage() {
  const { user } = await requireUser();
  const memberships = await getMemberships(user.id);
  const active = await getActiveClient(memberships);
  if (!active) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={<PhoneCall size={20} />}
          title="No client linked yet"
          description="Once your AI receptionist is configured, you can place a live test call here."
        />
      </div>
    );
  }

  const sb = supabaseAdmin();
  const { data: client } = await sb
    .from("clients")
    .select("name,vapi_assistant_id")
    .eq("id", active.client_id)
    .single();

  return (
    <div className="space-y-8 animate-fade-up">

      <PageHeader
        eyebrow="Voice"
        title="Test your AI receptionist"
        description="Click the button to start a live call with your assistant. This is the same agent that picks up your phone."
      />

      {client?.vapi_assistant_id ? (
        <VoiceWidget assistantId={client.vapi_assistant_id} />
      ) : (
        <EmptyState
          icon={<PhoneCall size={20} />}
          title="Assistant not configured yet"
          description="The TSD team will wire up your AI receptionist once it's built. You'll be able to dial it from this page."
        />
      )}
    </div>
  );
}
