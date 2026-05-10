"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { VIEW_AS_COOKIE } from "@/lib/auth/require";

export async function signOut() {
  const sb = await supabaseServer();
  await sb.auth.signOut();
  const jar = await cookies();
  jar.delete(VIEW_AS_COOKIE);
  redirect("/login");
}
