"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth/require";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { PACKAGE_TIERS } from "@/lib/packages";

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
  deposit_target: z.coerce.number().min(0).default(0),
  max_discount_pct: z.coerce.number().int().min(0).max(100).default(0),
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
    deposit_target: clean(formData.get("deposit_target")) || 0,
    max_discount_pct: clean(formData.get("max_discount_pct")) || 0,
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
      deposit_target: p.deposit_target,
      max_discount_pct: p.max_discount_pct,
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
      deposit_target: p.deposit_target,
      max_discount_pct: p.max_discount_pct,
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
