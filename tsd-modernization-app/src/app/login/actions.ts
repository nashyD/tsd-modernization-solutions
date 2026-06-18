"use server";
import { headers } from "next/headers";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase/server";
import { checkLoginRateLimit } from "@/lib/ratelimit";
import { env } from "@/lib/env";

const Schema = z.object({ email: z.string().email() });

export interface LoginState {
  ok?: boolean;
  error?: string;
}

export async function sendMagicLink(
  _prev: LoginState | undefined,
  formData: FormData
): Promise<LoginState> {
  const parsed = Schema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: "Enter a valid email." };
  }
  // Throttle before touching Supabase so a script can't email-bomb an address
  // or burn the project's daily OTP quota.
  const h = await headers();
  const ip =
    h.get("x-real-ip")?.trim() ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  if (!(await checkLoginRateLimit({ ip, email: parsed.data.email }))) {
    return { error: "Too many sign-in attempts. Wait a bit and try again." };
  }
  const sb = await supabaseServer();
  const { error } = await sb.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      // No query string — Supabase strict-matches against Redirect URLs allowlist.
      // /auth/callback defaults its post-exchange redirect to /app already.
      emailRedirectTo: `${env().NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });
  if (error) return { error: error.message };
  return { ok: true };
}
