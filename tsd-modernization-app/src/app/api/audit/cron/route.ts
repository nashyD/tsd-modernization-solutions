import { NextResponse, type NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Vercel Cron entrypoint. Runs daily; finds clients whose newest audit is older
 * than 30 days and dispatches each to the Railway worker for a fresh snapshot.
 *
 * vercel.json should contain:
 *   { "crons": [{ "path": "/api/audit/cron", "schedule": "0 13 * * *" }] }
 */
export async function GET(req: NextRequest) {
  const e = env();
  // Vercel cron requests carry a Bearer token matching CRON_SECRET; accept either
  // that or our internal secret so the route can be smoke-tested.
  const auth = req.headers.get("authorization") ?? "";
  const internal = req.headers.get("x-internal-secret") ?? "";
  // Authorize on Vercel's cron Bearer token OR our internal secret. Guard the
  // unset-CRON_SECRET case: `Bearer ${CRON_SECRET ?? ""}` would collapse to the
  // literal "Bearer ", and anyone sending that header would pass.
  const cronSecret = process.env.CRON_SECRET;
  const authorized =
    (!!cronSecret && auth === `Bearer ${cronSecret}`) ||
    internal === e.INTERNAL_API_SECRET;
  if (!authorized) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!e.WORKER_URL || !e.WORKER_SECRET) {
    return NextResponse.json(
      { error: "worker not configured" },
      { status: 503 }
    );
  }

  const sb = supabaseAdmin();
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  // Pull all clients, then their newest audit, in two queries.
  const { data: clients } = await sb
    .from("clients")
    .select("id,name,website_url");
  if (!clients) return NextResponse.json({ dispatched: 0 });

  const dispatched: string[] = [];
  for (const c of clients) {
    const { data: latest } = await sb
      .from("audits")
      .select("created_at")
      .eq("owner_type", "client")
      .eq("owner_id", c.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (latest && latest.created_at > cutoff) continue;

    const { data: audit } = await sb
      .from("audits")
      .insert({
        owner_type: "client",
        owner_id: c.id,
        status: "pending",
      })
      .select("id")
      .single();
    if (!audit) continue;

    await fetch(`${e.WORKER_URL}/run-audit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-worker-secret": e.WORKER_SECRET,
      },
      body: JSON.stringify({
        auditId: audit.id,
        clientId: c.id,
        businessName: c.name,
        url: c.website_url,
      }),
    }).catch((err) => console.error("[cron] worker dispatch failed", err));

    dispatched.push(c.id);
  }
  return NextResponse.json({ dispatched: dispatched.length, ids: dispatched });
}
