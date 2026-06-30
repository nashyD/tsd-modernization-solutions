import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { ClientUserRole } from "@/lib/supabase/types";

export const VIEW_AS_COOKIE = "tsd_view_as_client";

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

/**
 * Global app-admin check. The ONLY source of truth for app-admin is the
 * `app_admins` allowlist (migration 0013). This is deliberately NOT the
 * per-client `client_users.role`, which only ever means a user's role WITHIN
 * one client and must never grant cross-tenant access.
 */
export async function isUserAppAdmin(userId: string): Promise<boolean> {
  const admin = supabaseAdmin();
  const { data } = await admin
    .from("app_admins")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();
  return !!data;
}

export async function requireRole(role: ClientUserRole) {
  const { user, sb } = await requireUser();
  const memberships = await getMemberships(user.id);
  // "admin" is the global app-admin gate; resolve it from the app_admins
  // allowlist, never from a per-client membership role. Other roles stay
  // client-scoped membership checks.
  const hasRole =
    role === "admin"
      ? await isUserAppAdmin(user.id)
      : memberships.some((m) => m.role === role);
  if (!hasRole) {
    redirect("/app");
  }
  return { user, sb, memberships };
}

/**
 * Admin check for Route Handlers (API routes). Unlike {@link requireRole},
 * this NEVER calls `redirect()` — it returns a boolean so the caller can
 * respond with a 401/403 JSON body. Use this to gate any API path that writes
 * via the service-role client (which bypasses RLS, so the route's own check is
 * the only authorization gate).
 */
export async function isApiAdmin(): Promise<boolean> {
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return false;
  return isUserAppAdmin(user.id);
}

export interface ActiveClient {
  client_id: string;
  client: { id: string; name: string; package_tier: string };
  impersonating: boolean;
}

/**
 * Returns the client whose portal we should render for the current user.
 *
 * - Admins with the `tsd_view_as_client` cookie set: that client (impersonating).
 * - Everyone else: their first non-admin membership.
 *
 * Returns `null` if neither applies (e.g., admin with no cookie and no ownership,
 * or signed-in user with no memberships at all).
 */
export async function getActiveClient(
  memberships: MembershipWithClient[],
  userId: string
): Promise<ActiveClient | null> {
  // Only a real app-admin (allowlist) may impersonate via the view-as cookie.
  const isAdmin = await isUserAppAdmin(userId);
  if (isAdmin) {
    const jar = await cookies();
    const viewAsId = jar.get(VIEW_AS_COOKIE)?.value;
    if (viewAsId) {
      const admin = supabaseAdmin();
      const { data: client } = await admin
        .from("clients")
        .select("id,name,package_tier")
        .eq("id", viewAsId)
        .single();
      if (client) {
        return { client_id: client.id, client, impersonating: true };
      }
    }
  }
  const ownership = memberships.find((m) => m.role !== "admin");
  if (ownership?.clients) {
    return {
      client_id: ownership.client_id,
      client: ownership.clients,
      impersonating: false,
    };
  }
  return null;
}
