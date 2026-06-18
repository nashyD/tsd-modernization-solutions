import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { env } from "@/lib/env";
import type { ClientUserRole } from "@/lib/supabase/types";

/**
 * Find (or invite) the auth user for `email` and link them to `clientId` with
 * `role`. Idempotent: an existing user / existing membership is a no-op. Shared
 * by the admin "Invite owner" form and the Square webhook's auto-conversion so a
 * paying client actually gets portal access (the conversion used to create a
 * clients row with no client_users link, locking the new client out).
 */
export async function findOrInviteOwner(opts: {
  clientId: string;
  email: string;
  role?: ClientUserRole;
}): Promise<void> {
  const { clientId, email, role = "owner" } = opts;
  const sb = supabaseAdmin();

  const { data: list } = await sb.auth.admin.listUsers();
  let user = list.users.find((u) => u.email === email);
  if (!user) {
    await sb.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${env().NEXT_PUBLIC_SITE_URL}/auth/callback`,
    });
    const { data: refreshed } = await sb.auth.admin.listUsers();
    user = refreshed.users.find((u) => u.email === email);
    if (!user) throw new Error("Invite sent but user lookup failed");
  }

  const { data: existing } = await sb
    .from("client_users")
    .select("user_id")
    .eq("user_id", user.id)
    .eq("client_id", clientId)
    .maybeSingle();
  if (!existing) {
    const { error } = await sb.from("client_users").insert({
      user_id: user.id,
      client_id: clientId,
      role,
    });
    if (error) throw new Error(error.message);
  }
}
