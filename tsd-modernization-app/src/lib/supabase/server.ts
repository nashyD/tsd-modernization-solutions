import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/lib/env";
import type { Database } from "./types";

/**
 * Cookies-based Supabase client for Server Components, Server Actions, and Route Handlers.
 * Runs as the authenticated user — RLS applies. Use for any user-scoped read/write.
 */
export async function supabaseServer() {
  const cookieStore = await cookies();
  const e = env();
  return createServerClient<Database>(
    e.NEXT_PUBLIC_SUPABASE_URL,
    e.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // setAll called from a Server Component — Supabase ignores; refresh-token rotation
            // is handled by the proxy / route handlers that can mutate cookies.
          }
        },
      },
    }
  );
}
