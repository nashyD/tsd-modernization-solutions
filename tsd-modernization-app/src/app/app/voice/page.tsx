import { requireUser, getMemberships } from "@/lib/auth/require";
import { supabaseAdmin } from "@/lib/supabase/admin";
import VoiceWidget from "./VoiceWidget";
import BackLink from "@/components/BackLink";

export const dynamic = "force-dynamic";

export default async function VoicePage() {
  const { user } = await requireUser();
  const memberships = await getMemberships(user.id);
  const ownership = memberships.find((m) => m.role !== "admin");
  if (!ownership) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-8">
        <h1 className="text-xl font-semibold text-[#13294B]">Voice</h1>
        <p className="mt-2 text-zinc-700">
          You don&apos;t have a TSD client account linked yet.
        </p>
      </div>
    );
  }
  const sb = supabaseAdmin();
  const { data: client } = await sb
    .from("clients")
    .select("name,vapi_assistant_id")
    .eq("id", ownership.client_id)
    .single();

  return (
    <div className="space-y-6">
      <BackLink href="/app" label="Dashboard" />
      <h1 className="text-2xl font-semibold text-[#13294B]">
        Test your AI receptionist
      </h1>
      <p className="text-zinc-700">
        Click the button below to start a live call with your assistant. This
        is the same agent that answers your phone — try a real customer
        scenario and see how it responds.
      </p>
      {client?.vapi_assistant_id ? (
        <VoiceWidget assistantId={client.vapi_assistant_id} />
      ) : (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 text-zinc-700">
          Your assistant isn&apos;t configured yet. We&apos;ll wire it up once
          your AI receptionist is live.
        </div>
      )}
    </div>
  );
}
