"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth/require";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { PACKAGE_TIERS } from "@/lib/packages";
import { env } from "@/lib/env";

const ClientSchema = z.object({
  name: z.string().min(2),
  website_url: z
    .string()
    .min(1)
    .transform((v) => (v.startsWith("http") ? v : `https://${v}`))
    .pipe(z.string().url()),
  package_tier: z.enum(PACKAGE_TIERS as unknown as [string, ...string[]]),
  owner_email: z.string().email().optional().or(z.literal("")),
  vapi_assistant_id: z.string().optional().or(z.literal("")),
  vercel_project_id: z.string().optional().or(z.literal("")),
});

export async function createClient(formData: FormData) {
  await requireRole("admin");

  const parsed = ClientSchema.parse({
    name: formData.get("name"),
    website_url: formData.get("website_url"),
    package_tier: formData.get("package_tier"),
    owner_email: formData.get("owner_email") || "",
    vapi_assistant_id: formData.get("vapi_assistant_id") || "",
    vercel_project_id: formData.get("vercel_project_id") || "",
  });

  const sb = supabaseAdmin();
  const { data: client, error } = await sb
    .from("clients")
    .insert({
      name: parsed.name,
      website_url: parsed.website_url,
      package_tier: parsed.package_tier,
      vapi_assistant_id: parsed.vapi_assistant_id || null,
      vercel_project_id: parsed.vercel_project_id || null,
    })
    .select("id")
    .single();
  if (error || !client) throw new Error(error?.message ?? "insert failed");

  if (parsed.owner_email) {
    await sb.auth.admin.inviteUserByEmail(parsed.owner_email, {
      redirectTo: `${env().NEXT_PUBLIC_SITE_URL}/auth/callback?next=/app`,
    });
    const { data: existing } = await sb
      .from("client_users")
      .select("user_id")
      .eq("client_id", client.id);
    if (!existing || existing.length === 0) {
      // The invite created the auth user; fetch their id and link.
      const { data: list } = await sb.auth.admin.listUsers();
      const found = list.users.find((u) => u.email === parsed.owner_email);
      if (found) {
        await sb.from("client_users").insert({
          user_id: found.id,
          client_id: client.id,
          role: "owner",
        });
      }
    }
  }

  revalidatePath("/admin/clients");
}

const WorkItemSchema = z.object({
  client_id: z.string().uuid(),
  title: z.string().min(2),
  description: z.string().optional().or(z.literal("")),
  status: z.enum(["todo", "doing", "done"] as const),
});

export async function upsertWorkItem(formData: FormData) {
  await requireRole("admin");
  const parsed = WorkItemSchema.parse({
    client_id: formData.get("client_id"),
    title: formData.get("title"),
    description: formData.get("description") || "",
    status: formData.get("status") || "todo",
  });
  const id = formData.get("id") as string | null;

  const sb = supabaseAdmin();
  if (id) {
    await sb
      .from("work_items")
      .update({
        title: parsed.title,
        description: parsed.description || null,
        status: parsed.status,
        completed_at: parsed.status === "done" ? new Date().toISOString() : null,
      })
      .eq("id", id);
  } else {
    await sb.from("work_items").insert({
      client_id: parsed.client_id,
      title: parsed.title,
      description: parsed.description || null,
      status: parsed.status,
      completed_at: parsed.status === "done" ? new Date().toISOString() : null,
    });
  }
  revalidatePath(`/admin/clients/${parsed.client_id}`);
  revalidatePath("/app/progress");
}

export async function deleteWorkItem(formData: FormData) {
  await requireRole("admin");
  const id = String(formData.get("id"));
  const clientId = String(formData.get("client_id"));
  const sb = supabaseAdmin();
  await sb.from("work_items").delete().eq("id", id);
  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/app/progress");
}
