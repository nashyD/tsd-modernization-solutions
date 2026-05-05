import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import type { Database } from "./types";

let cached: ReturnType<typeof createClient<Database>> | null = null;

/**
 * Service-role Supabase client. Bypasses RLS — never import this from a route
 * that doesn't gate on requireRole('admin') or an internal-secret header first.
 */
export function supabaseAdmin() {
  if (cached) return cached;
  const e = env();
  cached = createClient<Database>(
    e.NEXT_PUBLIC_SUPABASE_URL,
    e.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
  return cached;
}
