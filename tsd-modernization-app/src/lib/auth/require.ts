import "server-only";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { ClientUserRole } from "@/lib/supabase/types";

export async function requireUser() {
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/login");
  return { user, sb };
}

export interface MembershipWithClient {
  role: ClientUserRole;
  client_id: string;
  clients: {
    id: string;
    name: string;
    package_tier: string;
  } | null;
}

export async function getMemberships(
  userId: string
): Promise<MembershipWithClient[]> {
  const admin = supabaseAdmin();
  const { data: rows } = await admin
    .from("client_users")
    .select("role,client_id")
    .eq("user_id", userId);
  if (!rows || rows.length === 0) return [];

  const clientIds = rows.map((r) => r.client_id);
  const { data: clients } = await admin
    .from("clients")
    .select("id,name,package_tier")
    .in("id", clientIds);
  const clientMap = new Map(
    (clients ?? []).map((c) => [c.id, c] as const)
  );
  return rows.map((r) => ({
    role: r.role,
    client_id: r.client_id,
    clients: clientMap.get(r.client_id) ?? null,
  }));
}

export async function requireRole(role: ClientUserRole) {
  const { user, sb } = await requireUser();
  const memberships = await getMemberships(user.id);
  const hasRole = memberships.some((m) => m.role === role);
  if (!hasRole) {
    redirect("/app");
  }
  return { user, sb, memberships };
}
