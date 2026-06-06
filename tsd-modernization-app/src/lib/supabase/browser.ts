"use client";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

let cached: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function supabaseBrowser() {
  if (cached) return cached;
  cached = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Opt in to Supabase's native passkey API (Beta). Without this flag,
      // auth.signInWithPasskey(), registerPasskey(), and passkey.* all throw.
      auth: { experimental: { passkey: true } },
    }
  );
  return cached;
}
