import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { supabaseServer } from "@/lib/supabase/server";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Build redirect URLs against NEXT_PUBLIC_SITE_URL rather than req.url.
 * When this app is fronted by the marketing site's Vercel rewrite,
 * `req.url` resolves to the upstream Vercel app domain
 * (tsd-modernization-solutions-uc71.vercel.app), not the user's branded URL.
 * Redirecting to req.url would dump the user on the bare Vercel host where
 * cookies don't apply.
 *
 * IMPORTANT: NEXT_PUBLIC_SITE_URL must be the CANONICAL host (the one the
 * domain serves without redirecting). If it points at a host that 307s to
 * another (e.g. apex -> www), the magic-link callback bounces across hosts and
 * the PKCE verifier / session cookies set on one host aren't seen on the other,
 * which makes sign-in fail on the first try. Keep this in sync with the
 * canonical domain.
 */
function siteUrl(path: string): string {
  const base = env().NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const next = url.searchParams.get("next") || "/app";
  const sb = await supabaseServer();

  // PKCE flow (?code=...) — the default for the SSR client.
  const code = url.searchParams.get("code");
  if (code) {
    const { error } = await sb.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(
        siteUrl(`/login?error=${encodeURIComponent(error.message)}`),
      );
    }
    return NextResponse.redirect(siteUrl(next));
  }

  // OTP / magic-link token flow (?token_hash=...&type=...) — some Supabase
  // email templates send this instead of a code. Handle both so whichever
  // format arrives, sign-in completes on the first click.
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  if (tokenHash && type) {
    const { error } = await sb.auth.verifyOtp({ token_hash: tokenHash, type });
    if (error) {
      return NextResponse.redirect(
        siteUrl(`/login?error=${encodeURIComponent(error.message)}`),
      );
    }
    return NextResponse.redirect(siteUrl(next));
  }

  return NextResponse.redirect(siteUrl("/login?error=missing_code"));
}
