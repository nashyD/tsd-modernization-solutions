"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole, VIEW_AS_COOKIE } from "@/lib/auth/require";
import { supabaseAdmin } from "@/lib/supabase/admin";

const ViewAsSchema = z.object({ client_id: z.string().uuid() });

export async function viewAsClient(formData: FormData) {
  await requireRole("admin");
  const { client_id } = ViewAsSchema.parse({
    client_id: formData.get("client_id"),
  });

  const sb = supabaseAdmin();
  const { data: client } = await sb
    .from("clients")
    .select("id")
    .eq("id", client_id)
    .single();
  if (!client) throw new Error("Client not found");

  const jar = await cookies();
  jar.set(VIEW_AS_COOKIE, client_id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  redirect("/app");
}

export async function exitClientView() {
  await requireRole("admin");
  const jar = await cookies();
  jar.delete(VIEW_AS_COOKIE);
  redirect("/admin/clients");
}
