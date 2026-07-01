import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { safeEqual } from "@/lib/safe-compare";

export const runtime = "nodejs";

// The nightly sales loop's ONLY write surface. Everything here is a rendering
// hint for /sales/today (rank, reason, inert brief, knock window) — the
// schema is strict so this credential physically cannot flip a status,
// reassign an owner, send anything, or touch money. Writes go through the
// atomic replace_queue_slots RPC (delete+insert for the day in one tx).
const QueueItem = z
  .object({
    prospect_id: z.string().uuid(),
    owner: z.enum(["grant", "bishop", "nash"]),
    rank: z.number().int().min(1).max(50),
    kind: z.enum(["first_touch", "follow_up"]).default("first_touch"),
    reason: z.string().max(300).optional(),
    brief_md: z.string().max(8000).optional(),
    knock_window: z.string().max(40).optional(),
  })
  .strict();

const QueuePayload = z
  .object({
    queue_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    items: z.array(QueueItem).min(1).max(50),
  })
  .strict();

function localDateISO(offsetDays: number): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(Date.now() + offsetDays * 86400e3));
}

export async function POST(req: NextRequest) {
  const e = env();
  if (!e.LOOP_API_SECRET) {
    return NextResponse.json({ error: "loop api not configured" }, { status: 503 });
  }
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!safeEqual(token, e.LOOP_API_SECRET)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let payload: z.infer<typeof QueuePayload>;
  try {
    payload = QueuePayload.parse(await req.json());
  } catch (err) {
    return NextResponse.json(
      { error: "invalid payload", detail: String(err) },
      { status: 400 }
    );
  }

  // A queue is a morning artifact: only today's or tomorrow's (ET) is valid.
  if (![localDateISO(0), localDateISO(1)].includes(payload.queue_date)) {
    return NextResponse.json(
      { error: "queue_date must be today or tomorrow (America/New_York)" },
      { status: 400 }
    );
  }

  // Ranks unique per owner.
  const seen = new Set<string>();
  for (const item of payload.items) {
    const key = `${item.owner}:${item.rank}`;
    if (seen.has(key)) {
      return NextResponse.json(
        { error: `duplicate rank ${item.rank} for ${item.owner}` },
        { status: 400 }
      );
    }
    seen.add(key);
  }

  // Every prospect must exist and still be in play.
  const sb = supabaseAdmin();
  const ids = [...new Set(payload.items.map((i) => i.prospect_id))];
  if (ids.length !== payload.items.length) {
    return NextResponse.json(
      { error: "duplicate prospect_id in items" },
      { status: 400 }
    );
  }
  const { data: found, error: findErr } = await sb
    .from("prospects")
    .select("id,status")
    .in("id", ids);
  if (findErr) {
    return NextResponse.json({ error: findErr.message }, { status: 500 });
  }
  const byId = new Map((found ?? []).map((p) => [p.id, p.status]));
  for (const id of ids) {
    const status = byId.get(id);
    if (!status) {
      return NextResponse.json({ error: `unknown prospect ${id}` }, { status: 400 });
    }
    if (status === "won" || status === "lost") {
      return NextResponse.json(
        { error: `prospect ${id} is ${status}; not queueable` },
        { status: 400 }
      );
    }
  }

  const { data: inserted, error: rpcErr } = await sb.rpc("replace_queue_slots", {
    p_date: payload.queue_date,
    p_items: payload.items,
  });
  if (rpcErr) {
    return NextResponse.json({ error: rpcErr.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, inserted, queue_date: payload.queue_date });
}
