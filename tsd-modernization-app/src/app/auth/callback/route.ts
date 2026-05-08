import { NextResponse, type NextRequest } from "next/server";
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
 */
function siteUrl(path: string): string {
  const base = env().NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/app";
  if (!code) {
    return NextResponse.redirect(siteUrl("/login?error=missing_code"));
  }
  const sb = await supabaseServer();
  const { error } = await sb.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      siteUrl(`/login?error=${encodeURIComponent(error.message)}`)
    );
  }
  return NextResponse.redirect(siteUrl(next));
}
