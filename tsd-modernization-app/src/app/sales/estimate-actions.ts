"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth/require";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { SERVICE_KEYS } from "@/lib/sales/services";
import { draftEstimatesFromAudit } from "@/lib/sales/draft-estimates";

export async function upsertEstimate(formData: FormData) {
  await requireRole("admin");
  const schema = z.object({
    id: z.string().uuid().optional().or(z.literal("")),
    prospect_id: z.string().uuid(),
    service_key: z.enum(SERVICE_KEYS as unknown as [string, ...string[]]),
    dollar_value: z.coerce.number().min(0).default(0),
    rationale: z.string().optional().or(z.literal("")),
  });
  const p = schema.parse({
    id: (formData.get("id") ?? "").toString(),
    prospect_id: formData.get("prospect_id"),
    service_key: formData.get("service_key"),
    dollar_value: (formData.get("dollar_value") ?? "0").toString(),
    rationale: (formData.get("rationale") ?? "").toString(),
  });
  const sb = supabaseAdmin();
  if (p.id) {
    await sb
      .from("prospect_estimates")
      .update({
        service_key: p.service_key,
        dollar_value: p.dollar_value,
        rationale: p.rationale || null,
      })
      .eq("id", p.id);
  } else {
    await sb.from("prospect_estimates").insert({
      prospect_id: p.prospect_id,
      service_key: p.service_key,
      dollar_value: p.dollar_value,
      rationale: p.rationale || null,
    });
  }
  revalidatePath(`/sales/${p.prospect_id}`);
}

export async function deleteEstimate(formData: FormData) {
  await requireRole("admin");
  const id = z.string().uuid().parse(formData.get("id"));
  const prospectId = z.string().uuid().parse(formData.get("prospect_id"));
  await supabaseAdmin().from("prospect_estimates").delete().eq("id", id);
  revalidatePath(`/sales/${prospectId}`);
}

export async function draftEstimates(formData: FormData) {
  await requireRole("admin");
  const prospectId = z.string().uuid().parse(formData.get("prospect_id"));
  const sb = supabaseAdmin();
  const { data: prospect } = await sb
    .from("prospects")
    .select("audit_id")
    .eq("id", prospectId)
    .single();
  if (!prospect?.audit_id) throw new Error("No audit linked to this prospect.");
  const { data: audit } = await sb
    .from("audits")
    .select("scores,report_md")
    .eq("id", prospect.audit_id)
    .single();
  if (!audit) throw new Error("Audit not found.");
  const draft = await draftEstimatesFromAudit({
    scores: audit.scores,
    report_md: audit.report_md,
  });
  // Replace existing estimates with the fresh draft.
  await sb.from("prospect_estimates").delete().eq("prospect_id", prospectId);
  await sb.from("prospect_estimates").insert(
    draft.estimates.map((e, i) => ({
      prospect_id: prospectId,
      service_key: e.service_key,
      dollar_value: e.dollar_value,
      rationale: e.rationale,
      sort_order: i,
    })),
  );
  revalidatePath(`/sales/${prospectId}`);
}

export async function uploadAsset(formData: FormData) {
  await requireRole("admin");
  const prospectId = z.string().uuid().parse(formData.get("prospect_id"));
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) throw new Error("No file.");
  const label = (formData.get("label") ?? "").toString() || null;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const kind = ["png", "jpg", "jpeg", "webp", "gif"].includes(ext)
    ? "image"
    : ext === "pdf"
      ? "pdf"
      : "other";
  const path = `${prospectId}/${crypto.randomUUID()}.${ext}`;
  const sb = supabaseAdmin();
  const { error: upErr } = await sb.storage
    .from("prospect-assets")
    .upload(path, file, {
      contentType: file.type || undefined,
      upsert: false,
    });
  if (upErr) throw new Error(upErr.message);
  await sb
    .from("prospect_assets")
    .insert({ prospect_id: prospectId, kind, storage_path: path, label });
  revalidatePath(`/sales/${prospectId}`);
}

export async function deleteAsset(formData: FormData) {
  await requireRole("admin");
  const id = z.string().uuid().parse(formData.get("id"));
  const prospectId = z.string().uuid().parse(formData.get("prospect_id"));
  const sb = supabaseAdmin();
  const { data: asset } = await sb
    .from("prospect_assets")
    .select("storage_path")
    .eq("id", id)
    .single();
  if (asset) await sb.storage.from("prospect-assets").remove([asset.storage_path]);
  await sb.from("prospect_assets").delete().eq("id", id);
  revalidatePath(`/sales/${prospectId}`);
}

export async function upsertDiscountCode(formData: FormData) {
  await requireRole("admin");
  const schema = z.object({
    code: z
      .string()
      .min(1)
      .transform((s) => s.trim().toLowerCase()),
    pct: z.coerce.number().int().min(1).max(100),
    active: z.boolean().default(true),
  });
  const p = schema.parse({
    code: (formData.get("code") ?? "").toString(),
    pct: (formData.get("pct") ?? "0").toString(),
    active: formData.get("active") !== "false",
  });
  await supabaseAdmin()
    .from("discount_codes")
    .upsert({ code: p.code, pct: p.pct, active: p.active }, { onConflict: "code" });
  revalidatePath("/sales/codes");
}

export async function deleteDiscountCode(formData: FormData) {
  await requireRole("admin");
  const code = z.string().parse(formData.get("code"));
  await supabaseAdmin().from("discount_codes").delete().eq("code", code);
  revalidatePath("/sales/codes");
}
