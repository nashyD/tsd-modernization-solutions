"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth/require";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { PACKAGE_TIERS } from "@/lib/packages";
import { env } from "@/lib/env";

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
  const status = z
    .enum(["new", "pitched", "won", "lost"])
    .parse(formData.get("status"));
  const sb = supabaseAdmin();
  const { error } = await sb.from("prospects").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/sales");
  revalidatePath(`/sales/${id}`);
}

export async function recordVisit(formData: FormData) {
  await requireRole("admin");
  const id = z.string().uuid().parse(formData.get("id"));
  const statusRaw = formData.get("status");
  const status = statusRaw
    ? z.enum(["new", "pitched", "won", "lost"]).parse(statusRaw)
    : undefined;
  const notesRaw = formData.get("notes");
  const update: {
    status?: "new" | "pitched" | "won" | "lost";
    notes?: string | null;
  } = {};
  if (status) update.status = status;
  if (notesRaw !== null) update.notes = notesRaw.toString().trim() || null;
  if (Object.keys(update).length === 0) return;
  const sb = supabaseAdmin();
  const { error } = await sb.from("prospects").update(update).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/sales");
  revalidatePath("/sales/next");
  revalidatePath(`/sales/${id}`);
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

  const e = env();
  void fetch(`${e.NEXT_PUBLIC_SITE_URL}/api/audit/run`, {
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
  }).catch((err) => console.error("[sales] audit kick failed", err));

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
