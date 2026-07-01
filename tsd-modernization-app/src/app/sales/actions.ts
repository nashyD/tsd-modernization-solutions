"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth/require";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { PACKAGE_TIERS } from "@/lib/packages";
import { env } from "@/lib/env";
import { suggestOwner } from "@/lib/sales/routing";
import type {
  Database,
  ProspectStatus,
  StageDisposition,
} from "@/lib/supabase/types";

// Funnel statuses (legacy 'pitched' retired in migration 0016). 'won' is set by the Square webhook, never a rep.
const PROSPECT_STATUSES = [
  "new",
  "contacted",
  "demo_shown",
  "fit_call",
  "proposal",
  "won",
  "lost",
] as const;

const urlField = z
  .string()
  .min(1)
  .transform((v) => (v.startsWith("http") ? v : `https://${v}`))
  .pipe(z.string().url());

const ProspectSchema = z.object({
  business_name: z.string().min(2),
  business_url: urlField,
  contact_name: z.string().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  demo_site_url: z.string().optional().or(z.literal("")),
  vapi_assistant_id: z.string().optional().or(z.literal("")),
  outline_md: z.string().optional().or(z.literal("")),
  package_tier: z
    .enum(PACKAGE_TIERS as unknown as [string, ...string[]])
    .optional()
    .or(z.literal("")),
  deposit_pct: z.coerce.number().int().min(0).max(100).default(10),
  notes: z.string().optional().or(z.literal("")),
});

function clean(v: FormDataEntryValue | null): string {
  return (v ?? "").toString();
}

function parseProspect(formData: FormData) {
  return ProspectSchema.parse({
    business_name: clean(formData.get("business_name")),
    business_url: clean(formData.get("business_url")),
    contact_name: clean(formData.get("contact_name")),
    email: clean(formData.get("email")),
    phone: clean(formData.get("phone")),
    demo_site_url: clean(formData.get("demo_site_url")),
    vapi_assistant_id: clean(formData.get("vapi_assistant_id")),
    outline_md: clean(formData.get("outline_md")),
    package_tier: clean(formData.get("package_tier")),
    deposit_pct: clean(formData.get("deposit_pct")) || 10,
    notes: clean(formData.get("notes")),
  });
}

export async function createProspect(formData: FormData) {
  await requireRole("admin");
  const p = parseProspect(formData);
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("prospects")
    .insert({
      business_name: p.business_name,
      business_url: p.business_url,
      contact_name: p.contact_name || null,
      email: p.email || null,
      phone: p.phone || null,
      demo_site_url: p.demo_site_url || null,
      vapi_assistant_id: p.vapi_assistant_id || null,
      outline_md: p.outline_md || null,
      package_tier: p.package_tier || null,
      deposit_pct: p.deposit_pct,
      notes: p.notes || null,
    })
    .select("id")
    .single();
  if (error || !data) throw new Error(error?.message ?? "insert failed");
  revalidatePath("/sales");
  redirect(`/sales/${data.id}`);
}

export async function updateProspect(formData: FormData) {
  await requireRole("admin");
  const id = z.string().uuid().parse(formData.get("id"));
  const p = parseProspect(formData);
  const sb = supabaseAdmin();
  const { error } = await sb
    .from("prospects")
    .update({
      business_name: p.business_name,
      business_url: p.business_url,
      contact_name: p.contact_name || null,
      email: p.email || null,
      phone: p.phone || null,
      demo_site_url: p.demo_site_url || null,
      vapi_assistant_id: p.vapi_assistant_id || null,
      outline_md: p.outline_md || null,
      package_tier: p.package_tier || null,
      deposit_pct: p.deposit_pct,
      notes: p.notes || null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/sales/${id}`);
  revalidatePath("/sales");
  redirect(`/sales/${id}`);
}

export async function setProspectStatus(formData: FormData) {
  await requireRole("admin");
  const id = z.string().uuid().parse(formData.get("id"));
  const status = z.enum(PROSPECT_STATUSES).parse(formData.get("status"));
  const sb = supabaseAdmin();
  const { error } = await sb.from("prospects").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/sales");
  revalidatePath(`/sales/${id}`);
}

export async function setProspectOwner(formData: FormData) {
  await requireRole("admin");
  const id = z.string().uuid().parse(formData.get("id"));
  const owner = z
    .enum(["grant", "bishop", "nash", "unassigned"])
    .parse(formData.get("owner"));
  const sb = supabaseAdmin();
  const { error } = await sb.from("prospects").update({ owner }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/sales");
  revalidatePath("/sales/today");
  revalidatePath(`/sales/${id}`);
}

export async function recordVisit(formData: FormData) {
  await requireRole("admin");
  const id = z.string().uuid().parse(formData.get("id"));
  const statusRaw = formData.get("status");
  const status = statusRaw
    ? z.enum(PROSPECT_STATUSES).parse(statusRaw)
    : undefined;
  const notesRaw = formData.get("notes");
  const update: {
    status?: ProspectStatus;
    notes?: string | null;
  } = {};
  if (status) update.status = status;
  if (notesRaw !== null) update.notes = notesRaw.toString().trim() || null;
  if (Object.keys(update).length === 0) return;
  const sb = supabaseAdmin();
  const { error } = await sb.from("prospects").update(update).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/sales");
  revalidatePath(`/sales/${id}`);
}

// ---------------------------------------------------------------------------
// One-tap field disposition — the load-bearing input for the whole funnel.
// A rep taps ONE button after a knock/call; this records the stage transition
// (the source of truth for every conversion ratio), bumps the cadence fields
// the loop owns, captures owner/email on an owner-out, and mirrors the event
// into the human-readable notes log. The loop never writes here; only a signed-
// in admin does, and the actor is taken from the session, never the form.

const DISPOSITIONS = [
  "knocked",
  "answered",
  "demo_shown",
  "owner_out",
  "fit_call",
  "proposal_sent",
  "dead",
] as const;

// Disposition -> the stage it advances to. null = a logged touch that does not
// move the stage (a no-answer knock, or an owner-out we capture and revisit).
const DISPOSITION_TO_STATUS: Record<StageDisposition, ProspectStatus | null> = {
  knocked: null,
  answered: "contacted",
  demo_shown: "demo_shown",
  owner_out: null,
  fit_call: "fit_call",
  proposal_sent: "proposal",
  dead: "lost",
};

const DISPOSITION_LABEL: Record<StageDisposition, string> = {
  knocked: "Knocked, no answer",
  answered: "Reached a person",
  demo_shown: "Demo shown",
  owner_out: "Owner out",
  fit_call: "Fit call booked",
  proposal_sent: "Proposal sent",
  dead: "Marked dead",
};

const DispositionSchema = z.object({
  prospect_id: z.string().uuid(),
  disposition: z.enum(DISPOSITIONS),
  channel: z.string().trim().max(40).optional().or(z.literal("")),
  detail: z.string().trim().max(2000).optional().or(z.literal("")),
  owner_name: z.string().trim().max(200).optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  owner: z
    .enum(["grant", "bishop", "nash", "unassigned"])
    .optional()
    .or(z.literal("")),
  next_action_days: z.coerce.number().int().min(0).max(60).optional(),
});

export async function logDisposition(formData: FormData) {
  const { user } = await requireRole("admin");
  const d = DispositionSchema.parse({
    prospect_id: clean(formData.get("prospect_id")),
    disposition: clean(formData.get("disposition")),
    channel: clean(formData.get("channel")),
    detail: clean(formData.get("detail")),
    owner_name: clean(formData.get("owner_name")),
    email: clean(formData.get("email")),
    owner: clean(formData.get("owner")),
    next_action_days: clean(formData.get("next_action_days")) || undefined,
  });

  const sb = supabaseAdmin();
  const { data: cur, error: curErr } = await sb
    .from("prospects")
    .select("status,touch_count")
    .eq("id", d.prospect_id)
    .single();
  if (curErr || !cur) throw new Error(curErr?.message ?? "Prospect not found.");

  const fromStatus = cur.status;
  const target = DISPOSITION_TO_STATUS[d.disposition];
  const nowIso = new Date().toISOString();

  const update: Database["public"]["Tables"]["prospects"]["Update"] = {
    touch_count: (cur.touch_count ?? 0) + 1,
    last_touch_at: nowIso,
  };
  if (target && target !== fromStatus) {
    update.status = target;
    update.stage_entered_at = nowIso;
  }
  if (d.disposition === "dead") {
    update.next_action_at = null;
  } else {
    const days = d.next_action_days ?? 2;
    update.next_action_at = new Date(
      Date.now() + days * 86_400_000,
    ).toISOString();
  }
  if (d.owner_name) update.contact_name = d.owner_name;
  if (d.email) update.email = d.email;
  if (d.owner) update.owner = d.owner;

  const { error: upErr } = await sb
    .from("prospects")
    .update(update)
    .eq("id", d.prospect_id);
  if (upErr) throw new Error(upErr.message);

  const { error: evErr } = await sb.from("prospect_stage_events").insert({
    prospect_id: d.prospect_id,
    from_status: fromStatus,
    to_status: target ?? fromStatus,
    disposition: d.disposition,
    channel: d.channel || null,
    detail: d.detail || null,
    actor_user_id: user.id,
    actor_email: user.email ?? null,
  });
  if (evErr) throw new Error(evErr.message);

  // Mirror into the canonical visit log so the human-readable record stays whole.
  const noteBits = [DISPOSITION_LABEL[d.disposition]];
  if (d.owner_name) noteBits.push(`owner: ${d.owner_name}`);
  if (d.email) noteBits.push(`email: ${d.email}`);
  if (d.detail) noteBits.push(d.detail);
  await sb.from("prospect_notes").insert({
    prospect_id: d.prospect_id,
    body: noteBits.join(" · "),
    author_user_id: user.id,
    author_email: user.email ?? null,
  });

  revalidatePath("/sales");
  revalidatePath("/sales/today");
  revalidatePath(`/sales/${d.prospect_id}`);
}

// ---------------------------------------------------------------------------
// Demo / pitch notes — an append-only, author-stamped log per prospect. Unlike
// the single `prospects.notes` field (which any save overwrites), every call here
// adds a new timestamped entry, so the rep can record what happened on each visit
// without clobbering the last one. Author is taken from the signed-in user, never
// the form, so it can't be spoofed.
const NoteSchema = z.object({
  prospect_id: z.string().uuid(),
  body: z.string().trim().min(1).max(5000),
});

export async function addProspectNote(formData: FormData) {
  const { user } = await requireRole("admin");
  const { prospect_id, body } = NoteSchema.parse({
    prospect_id: clean(formData.get("prospect_id")),
    body: clean(formData.get("body")),
  });
  const sb = supabaseAdmin();
  const { error } = await sb.from("prospect_notes").insert({
    prospect_id,
    body,
    author_user_id: user.id,
    author_email: user.email ?? null,
  });
  if (error) throw new Error(error.message);
  // Surface the new note on both the work page and the present-mode pitch screen.
  revalidatePath(`/sales/${prospect_id}`);
  revalidatePath(`/present/${prospect_id}`);
}

export async function deleteProspectNote(formData: FormData) {
  await requireRole("admin");
  const id = z.string().uuid().parse(formData.get("id"));
  const prospectId = z.string().uuid().parse(formData.get("prospect_id"));
  const sb = supabaseAdmin();
  const { error } = await sb.from("prospect_notes").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/sales/${prospectId}`);
}

export async function toggleShare(formData: FormData) {
  await requireRole("admin");
  const id = z.string().uuid().parse(formData.get("id"));
  const enabled = formData.get("enabled") === "true";
  const sb = supabaseAdmin();
  const { error } = await sb
    .from("prospects")
    .update({ share_enabled: enabled })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/sales/${id}`);
}

export async function deleteProspect(formData: FormData) {
  await requireRole("admin");
  const id = z.string().uuid().parse(formData.get("id"));
  const sb = supabaseAdmin();
  const { error } = await sb.from("prospects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/sales");
  redirect("/sales");
}

/**
 * Run the presence audit for a prospect straight from the sales dashboard.
 * Creates a prospect-owned audit row and fires the async pipeline; on
 * completion the pipeline auto-drafts this prospect's value estimates (see
 * runAuditPipeline's prospectId branch). Returns immediately — the pitch page
 * polls audit status and the estimates appear when ready (~1 min).
 */
export async function runAudit(formData: FormData) {
  await requireRole("admin");
  const prospectId = z.string().uuid().parse(formData.get("prospect_id"));
  const sb = supabaseAdmin();

  const { data: prospect } = await sb
    .from("prospects")
    .select("id,business_name,business_url,email,phone")
    .eq("id", prospectId)
    .single();
  if (!prospect) throw new Error("Prospect not found.");

  const { data: audit, error: auditErr } = await sb
    .from("audits")
    .insert({ owner_type: "prospect", owner_id: prospectId, status: "pending" })
    .select("id")
    .single();
  if (auditErr || !audit) throw new Error(auditErr?.message ?? "Could not start audit.");

  // Link immediately so the pitch page can poll this audit's status.
  await sb.from("prospects").update({ audit_id: audit.id }).eq("id", prospectId);

  // Await the (now fast-acking) kick so the dispatch is reliable; the run route
  // does the heavy work via after().
  const e = env();
  try {
    await fetch(`${e.NEXT_PUBLIC_SITE_URL}/api/audit/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": e.INTERNAL_API_SECRET,
      },
      body: JSON.stringify({
        auditId: audit.id,
        leadId: prospectId, // pipeline uses this for logging only
        prospectId,
        input: {
          business_name: prospect.business_name,
          business_url: prospect.business_url,
          email: prospect.email || "internal@tsd-modernization.com",
          phone: prospect.phone || "0000000000",
          city: "",
        },
      }),
      cache: "no-store",
    });
  } catch (err) {
    console.error("[sales] audit kick failed", err);
  }

  revalidatePath(`/sales/${prospectId}`);
}

export async function promoteLead(formData: FormData) {
  await requireRole("admin");
  const leadId = z.string().uuid().parse(formData.get("lead_id"));
  const sb = supabaseAdmin();
  const { data: lead, error: lErr } = await sb
    .from("leads")
    .select("id,business_name,business_url,email,phone")
    .eq("id", leadId)
    .single();
  if (lErr || !lead) throw new Error(lErr?.message ?? "lead not found");

  // Pull the lead's latest ready audit (for "Draft from audit" later).
  const { data: audit } = await sb
    .from("audits")
    .select("id")
    .eq("owner_type", "lead")
    .eq("owner_id", leadId)
    .eq("status", "ready")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data, error } = await sb
    .from("prospects")
    .insert({
      business_name: lead.business_name,
      business_url: lead.business_url,
      email: lead.email,
      phone: lead.phone,
      source_lead_id: lead.id,
      audit_id: audit?.id ?? null,
    })
    .select("id")
    .single();
  if (error || !data) throw new Error(error?.message ?? "promote failed");
  revalidatePath("/sales");
  redirect(`/sales/${data.id}`);
}

export async function approveCandidate(formData: FormData) {
  await requireRole("admin");
  const id = z.string().uuid().parse(formData.get("id"));
  // Owner comes from the card's routing chip; absent (or tampered), fall back
  // to the same suggestOwner rule server-side.
  const ownerChoice = z
    .enum(["grant", "bishop", "nash", "unassigned"])
    .nullable()
    .catch(null)
    .parse(formData.get("owner"));
  const sb = supabaseAdmin();
  // Only act on a still-pending candidate; a double-fire / network retry then
  // finds nothing and no-ops instead of inserting a second prospect.
  const { data: c, error: cErr } = await sb
    .from("prospect_candidates")
    .select("*")
    .eq("id", id)
    .eq("status", "pending")
    .maybeSingle();
  if (cErr) throw new Error(cErr.message);
  if (!c) {
    revalidatePath("/sales/candidates");
    return;
  }
  const businessUrl =
    c.website ||
    `https://www.google.com/search?q=${encodeURIComponent(`${c.business_name}, ${c.city ?? ""} NC`)}`;
  // primary_product is already a canonical service key, so it doubles as the
  // pre-selected service on the pitch.
  const svc = c.primary_product || null;
  const owner =
    ownerChoice ??
    suggestOwner({
      city: c.city,
      lng: c.lng,
      primary_product: c.primary_product,
      phone: c.phone,
      email: c.email ?? null,
    });
  const { data: prospect, error: pErr } = await sb
    .from("prospects")
    .insert({
      business_name: c.business_name,
      business_url: businessUrl,
      phone: c.phone,
      email: c.email ?? null,
      city: c.city,
      lat: c.lat,
      lng: c.lng,
      place_id: c.place_id,
      rating: c.rating,
      review_count: c.review_count,
      primary_product: c.primary_product,
      gap_summary: c.gap_summary,
      source_url: c.website,
      discovery_source: c.source === "leadscout" ? "leadscout" : "places",
      selected_services: svc ? [svc] : [],
      owner,
    })
    .select("id")
    .single();
  if (pErr || !prospect) throw new Error(pErr?.message ?? "promote failed");
  await sb
    .from("prospect_candidates")
    .update({ status: "approved", promoted_prospect_id: prospect.id })
    .eq("id", id)
    .eq("status", "pending");
  revalidatePath("/sales/candidates");
  revalidatePath("/sales");
}

export async function rejectCandidate(formData: FormData) {
  await requireRole("admin");
  const id = z.string().uuid().parse(formData.get("id"));
  const sb = supabaseAdmin();
  const { error } = await sb
    .from("prospect_candidates")
    .update({ status: "rejected" })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/sales/candidates");
}

/** Best-effort geocode via OpenStreetMap Nominatim (free, no key). Returns null
 *  on failure/timeout or implausible (non-NC) coordinates. */
async function geocodeNC(
  query: string,
): Promise<{ lat: number; lng: number } | null> {
  try {
    const url =
      "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=us&q=" +
      encodeURIComponent(query);
    const resp = await fetch(url, {
      headers: {
        "User-Agent": "TSD-prospect-add/1.0 (nashdavis@tsd-ventures.com)",
      },
      signal: AbortSignal.timeout(5000),
    });
    if (!resp.ok) return null;
    const d = await resp.json();
    const first = Array.isArray(d) ? d[0] : null;
    if (!first) return null;
    const lat = parseFloat(first.lat);
    const lng = parseFloat(first.lon);
    if (lat >= 33.5 && lat <= 36.8 && lng >= -84.6 && lng <= -75.0) {
      return { lat, lng };
    }
    return null;
  } catch {
    return null;
  }
}

/** Validate device-supplied lat/lng (hidden field-form inputs). Returns null
 *  unless both parse and land inside a sane North Carolina bounding box. */
function parseFieldCoords(
  latRaw: FormDataEntryValue | null,
  lngRaw: FormDataEntryValue | null,
): { lat: number; lng: number } | null {
  const lat = parseFloat((latRaw ?? "").toString());
  const lng = parseFloat((lngRaw ?? "").toString());
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat >= 33.5 && lat <= 36.8 && lng >= -84.6 && lng <= -75.0) {
    return { lat, lng };
  }
  return null;
}

const QuickAddSchema = z.object({
  business_name: z.string().min(2),
  city: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  business_url: z.string().optional().or(z.literal("")),
  primary_product: z
    .enum(["website", "front_desk", "booking_bridge", "concierge"])
    .optional()
    .or(z.literal("")),
});

/** Fast field capture: name + optional city/phone/url/product. Prefers the
 *  device's live GPS (the rep is standing at the business) and falls back to a
 *  Nominatim geocode, so the new prospect shows up in "Near me". Tagging a
 *  product lights up its pitch badge + tailored problem card. Revalidates the
 *  board only (NOT /sales/next, so the field tool doesn't re-acquire location
 *  mid-session). Returns whether it managed to pin a location. */
export async function quickAddProspect(
  formData: FormData,
): Promise<{ located: boolean }> {
  await requireRole("admin");
  const p = QuickAddSchema.parse({
    business_name: clean(formData.get("business_name")),
    city: clean(formData.get("city")),
    phone: clean(formData.get("phone")),
    business_url: clean(formData.get("business_url")),
    primary_product: clean(formData.get("primary_product")),
  });
  const name = p.business_name.trim();
  const city = (p.city || "").trim() || null;
  const rawUrl = (p.business_url || "").trim();
  const businessUrl = rawUrl
    ? rawUrl.startsWith("http")
      ? rawUrl
      : `https://${rawUrl}`
    : `https://www.google.com/search?q=${encodeURIComponent(`${name}, ${city ?? ""} NC`)}`;

  // Device GPS first (most accurate — the rep is on-site), Nominatim as backup.
  let coords = parseFieldCoords(formData.get("lat"), formData.get("lng"));
  if (!coords) {
    coords = await geocodeNC(`${name}, ${city ?? "Gaston County"}, NC`);
  }

  const product = (p.primary_product || "") as
    | "website"
    | "front_desk"
    | "booking_bridge"
    | "concierge"
    | "";
  const svc = product || null;

  const sb = supabaseAdmin();
  const { error } = await sb.from("prospects").insert({
    business_name: name,
    business_url: businessUrl,
    city,
    phone: (p.phone || "").trim() || null,
    lat: coords?.lat ?? null,
    lng: coords?.lng ?? null,
    primary_product: product || null,
    selected_services: svc ? [svc] : [],
    discovery_source: "manual",
  });
  if (error) throw new Error(error.message);
  revalidatePath("/sales");
  return { located: coords != null };
}

// ---------------------------------------------------------------------------
// Demo shelf — park a built demo site as a prospect before it converts.

const ParkDemoSchema = z.object({
  business_name: z.string().min(2),
  demo_site_url: urlField,
  business_url: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

export async function parkDemo(formData: FormData) {
  await requireRole("admin");
  const p = ParkDemoSchema.parse({
    business_name: clean(formData.get("business_name")),
    demo_site_url: clean(formData.get("demo_site_url")),
    business_url: clean(formData.get("business_url")),
    city: clean(formData.get("city")),
    notes: clean(formData.get("notes")),
  });
  const name = p.business_name.trim();
  const city = (p.city || "").trim() || null;
  const rawUrl = (p.business_url || "").trim();
  // Same convention as quickAddProspect: business_url is NOT NULL, and demo
  // prospects often have no real site — that absence is the pitch.
  const businessUrl = rawUrl
    ? rawUrl.startsWith("http")
      ? rawUrl
      : `https://${rawUrl}`
    : `https://www.google.com/search?q=${encodeURIComponent(`${name}, ${city ?? ""} NC`)}`;

  const sb = supabaseAdmin();
  const { error } = await sb.from("prospects").insert({
    business_name: name,
    business_url: businessUrl,
    demo_site_url: p.demo_site_url,
    city,
    notes: (p.notes || "").trim() || null,
    primary_product: "website",
    selected_services: ["website"],
    discovery_source: "demo_shelf",
  });
  if (error) throw new Error(error.message);
  revalidatePath("/sales/demos");
  revalidatePath("/sales");
  return { ok: true };
}

export async function setDemoUrl(formData: FormData) {
  await requireRole("admin");
  const id = z.string().uuid().parse(formData.get("id"));
  const demo_site_url = urlField.parse(clean(formData.get("demo_site_url")));
  const sb = supabaseAdmin();
  const { error } = await sb
    .from("prospects")
    .update({ demo_site_url })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/sales/demos");
  revalidatePath(`/sales/${id}`);
  revalidatePath("/sales");
}
