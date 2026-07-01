import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { safeEqual } from "@/lib/safe-compare";

export const runtime = "nodejs";

// Read-only funnel snapshot for the nightly sales loop. The loop's helper
// (vault loop/bin/fetch-funnel.mjs) calls this before the cycle starts; the
// LLM session only ever sees the JSON file this produces. Contact details are
// reduced to presence booleans — reps read real contacts in the app, the loop
// only needs to know which channels exist.
const EVENT_WINDOW_DAYS = 120;

export async function GET(req: NextRequest) {
  const e = env();
  if (!e.LOOP_API_SECRET) {
    return NextResponse.json({ error: "loop api not configured" }, { status: 503 });
  }
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!safeEqual(token, e.LOOP_API_SECRET)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const sb = supabaseAdmin();
  const since = new Date(
    Date.now() - EVENT_WINDOW_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();

  const [prospects, events, candidates] = await Promise.all([
    sb
      .from("prospects")
      .select(
        "id,business_name,status,owner,city,fit_score,gap_summary,primary_product,demo_site_url,touch_count,last_touch_at,next_action_at,stage_entered_at,created_at,rating,review_count,sms_consent,email,phone"
      )
      .order("created_at", { ascending: true })
      .limit(5000),
    sb
      .from("prospect_stage_events")
      .select(
        "prospect_id,from_status,to_status,disposition,channel,actor_email,occurred_at"
      )
      .gte("occurred_at", since)
      .order("occurred_at", { ascending: true })
      .limit(20000),
    sb
      .from("prospect_candidates")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  if (prospects.error || events.error) {
    return NextResponse.json(
      { error: prospects.error?.message ?? events.error?.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    generated_at: new Date().toISOString(),
    event_window_days: EVENT_WINDOW_DAYS,
    prospects: (prospects.data ?? []).map((p) => {
      const { email, phone, ...rest } = p;
      return { ...rest, has_email: !!email, has_phone: !!phone };
    }),
    events: events.data ?? [],
    pending_candidates: candidates.count ?? 0,
  });
}
