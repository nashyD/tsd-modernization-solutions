"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { checkAuditRateLimit } from "@/lib/ratelimit";
import { AuditFormSchema } from "@/lib/audit/types";
import { env } from "@/lib/env";

export interface AuditFormState {
  errors?: Record<string, string[] | undefined>;
  message?: string;
}

export async function startAudit(
  _prev: AuditFormState | undefined,
  formData: FormData
): Promise<AuditFormState> {
  const parsed = AuditFormSchema.safeParse({
    business_name: formData.get("business_name") ?? "",
    business_url: formData.get("business_url") ?? "",
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    city: formData.get("city") ?? "",
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const input = parsed.data;
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";

  const limit = await checkAuditRateLimit({ ip, email: input.email });
  if (!limit.ok) {
    return { message: limit.reason };
  }

  const sb = supabaseAdmin();
  const { data: lead, error: leadErr } = await sb
    .from("leads")
    .insert({
      business_name: input.business_name,
      business_url: input.business_url,
      email: input.email,
      phone: input.phone,
    })
    .select("id")
    .single();
  if (leadErr || !lead) {
    return { message: "Could not save your details. Try again in a moment." };
  }

  const { data: audit, error: auditErr } = await sb
    .from("audits")
    .insert({
      owner_type: "lead",
      owner_id: lead.id,
      status: "pending",
    })
    .select("id")
    .single();
  if (auditErr || !audit) {
    return { message: "Could not start the audit. Try again in a moment." };
  }

  // Fire-and-forget pipeline kick. We hit our own API with a long timeout from Vercel's perspective.
  // Awaiting the fetch's promise resolution is intentional in dev for stack traces; in production
  // Vercel keeps the function alive long enough for the secondary request to start independently.
  const e = env();
  void fetch(`${e.NEXT_PUBLIC_SITE_URL}/api/audit/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-internal-secret": e.INTERNAL_API_SECRET,
    },
    body: JSON.stringify({
      auditId: audit.id,
      leadId: lead.id,
      input,
    }),
    cache: "no-store",
  }).catch((err) => {
    console.error("[audit] pipeline kick failed", err);
  });

  redirect(`/audit/${audit.id}`);
}
