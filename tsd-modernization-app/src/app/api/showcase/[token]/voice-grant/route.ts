import { NextResponse, type NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
const DAILY_CAP = 5;

export async function POST(
  _req: NextRequest,
  ctx: { params: Promise<{ token: string }> },
) {
  const { token } = await ctx.params;
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
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await sb
    .from("showcase_voice_calls")
    .select("id", { count: "exact", head: true })
    .eq("prospect_id", prospect.id)
    .gte("created_at", since);
  if ((count ?? 0) >= DAILY_CAP) {
    return NextResponse.json(
      { error: "Demo limit reached for today." },
      { status: 429 },
    );
  }
  await sb.from("showcase_voice_calls").insert({ prospect_id: prospect.id });
  return NextResponse.json({ assistant_id: prospect.vapi_assistant_id });
}
