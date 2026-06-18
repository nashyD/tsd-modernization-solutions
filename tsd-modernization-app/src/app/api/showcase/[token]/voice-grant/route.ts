import { NextResponse, type NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { checkShowcaseVoiceRateLimit, clientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";
const DAILY_CAP = 5;

type Sb = ReturnType<typeof supabaseAdmin>;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const ip = clientIp(req);
  if (!(await checkShowcaseVoiceRateLimit(ip))) {
    return NextResponse.json(
      { error: "Too many demo calls from your network today." },
      { status: 429 },
    );
  }
  const { token } = await params;
  const sb = supabaseAdmin();
  const { data: prospect } = await sb
    .from("prospects")
    .select("id,vapi_assistant_id")
    .eq("share_token", token)
    .eq("share_enabled", true)
    .maybeSingle();
  if (!prospect?.vapi_assistant_id) {
    return NextResponse.json({ error: "Demo not available." }, { status: 404 });
  }

  if (!(await claimVoiceCall(sb, prospect.id))) {
    return NextResponse.json(
      { error: "Demo limit reached for today." },
      { status: 429 },
    );
  }
  return NextResponse.json({ assistant_id: prospect.vapi_assistant_id });
}

/**
 * Atomic per-prospect daily cap (advisory-lock guarded; see migration 0009).
 * Falls back to a non-atomic count-then-insert if the function isn't deployed
 * yet, so the demo never hard-breaks between a deploy and the migration landing.
 */
async function claimVoiceCall(sb: Sb, prospectId: string): Promise<boolean> {
  const { data, error } = await sb.rpc("claim_showcase_voice_call", {
    p_prospect_id: prospectId,
    p_cap: DAILY_CAP,
  });
  if (!error) return data === true;
  console.warn(
    "[voice-grant] claim RPC unavailable, using fallback:",
    error.message,
  );
  return legacyClaim(sb, prospectId);
}

async function legacyClaim(sb: Sb, prospectId: string): Promise<boolean> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await sb
    .from("showcase_voice_calls")
    .select("id", { count: "exact", head: true })
    .eq("prospect_id", prospectId)
    .gte("created_at", since);
  if ((count ?? 0) >= DAILY_CAP) return false;
  await sb.from("showcase_voice_calls").insert({ prospect_id: prospectId });
  return true;
}
