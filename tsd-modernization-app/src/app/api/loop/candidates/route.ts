import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { safeEqual } from "@/lib/safe-compare";

export const runtime = "nodejs";

// Leadscout → candidates import (called by the nightly loop's
// import-leadboard.mjs). Inserts PENDING candidates only — triage stays a
// human act on /sales/candidates. Dedupes against both existing candidates
// (dedupe_key) and existing prospects (normalized name / phone digits) so the
// vault's already-seeded leads never reappear.
const LeadItem = z
  .object({
    business_name: z.string().min(2).max(200),
    city: z.string().max(80).nullable().optional(),
    address: z.string().max(240).nullable().optional(),
    phone: z.string().max(40).nullable().optional(),
    email: z.string().email().max(160).nullable().optional(),
    website: z.string().url().max(300).nullable().optional(),
    primary_product: z
      .enum(["website", "front_desk", "booking_bridge", "concierge"])
      .nullable()
      .optional(),
    gap_summary: z.string().max(400).nullable().optional(),
    source_ref: z.string().max(200).nullable().optional(),
  })
  .strict();

const Payload = z
  .object({ items: z.array(LeadItem).min(1).max(40) })
  .strict();

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/\b(llc|inc|co|corp|company|the)\b/g, "")
    .replace(/[^a-z0-9]/g, "");
const digits = (s: string | null | undefined) => (s ?? "").replace(/\D/g, "");

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

  let payload: z.infer<typeof Payload>;
  try {
    payload = Payload.parse(await req.json());
  } catch (err) {
    return NextResponse.json(
      { error: "invalid payload", detail: String(err) },
      { status: 400 }
    );
  }

  const sb = supabaseAdmin();

  // Existing-prospect fence: normalized name or phone digits already in the
  // pipeline means the lead is being worked — skip, never duplicate.
  const { data: existing, error: exErr } = await sb
    .from("prospects")
    .select("business_name,phone");
  if (exErr) return NextResponse.json({ error: exErr.message }, { status: 500 });
  const knownNames = new Set((existing ?? []).map((p) => norm(p.business_name)));
  const knownPhones = new Set(
    (existing ?? []).map((p) => digits(p.phone)).filter((d) => d.length >= 7)
  );

  const rows = [];
  const skipped: string[] = [];
  for (const item of payload.items) {
    const n = norm(item.business_name);
    const d = digits(item.phone);
    if (knownNames.has(n) || (d.length >= 7 && knownPhones.has(d))) {
      skipped.push(item.business_name);
      continue;
    }
    rows.push({
      place_id: null,
      business_name: item.business_name,
      city: item.city ?? null,
      address: item.address ?? null,
      phone: item.phone ?? null,
      email: item.email ?? null,
      website: item.website ?? null,
      primary_product: item.primary_product ?? null,
      gap_summary: item.gap_summary ?? null,
      status: "pending" as const,
      source: "leadscout" as const,
      source_ref: item.source_ref ?? null,
    });
  }

  let inserted = 0;
  if (rows.length > 0) {
    // dedupe_key unique index catches repeats across runs; ignore duplicates so
    // a re-posted batch is idempotent.
    const { data, error } = await sb
      .from("prospect_candidates")
      .upsert(rows, { onConflict: "dedupe_key", ignoreDuplicates: true })
      .select("id");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    inserted = data?.length ?? 0;
  }

  return NextResponse.json({
    ok: true,
    inserted,
    skipped_existing: skipped.length,
    deduped: rows.length - inserted,
  });
}
