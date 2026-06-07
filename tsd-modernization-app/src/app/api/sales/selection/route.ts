import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isApiAdmin } from "@/lib/auth/require";
import { SIZES, PRODUCTS } from "@/lib/sales/estimator";

export const runtime = "nodejs";

const VALID_SIZES = new Set(SIZES.map((s) => s.id));
const VALID_SERVICES = new Set(PRODUCTS.map((p) => p.id));

const Body = z.object({
  prospect_id: z.string().uuid().optional(),
  token: z.string().optional(),
  team_size: z.string().optional(),
  selected_services: z.array(z.string()).optional(),
});

/**
 * Persist a prospect's live service selection. Reachable two ways:
 * - admin pitch view (prospect_id, requires login)
 * - public showcase (token), so a prospect's own picks save before they pay.
 * Values are whitelisted against the estimator's known ids. Never throws on a
 * malformed body — returns 400 instead of a 500.
 */
export async function POST(req: NextRequest) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const body = parsed.data;
  const team_size = body.team_size && VALID_SIZES.has(body.team_size) ? body.team_size : "small";
  const selected_services = (body.selected_services ?? []).filter((s) =>
    VALID_SERVICES.has(s),
  );

  const sb = supabaseAdmin();

  if (body.prospect_id) {
    // Admin-only: writes go through the service-role client (RLS-bypassing), so
    // this check is the sole authorization gate. Without the role check any
    // signed-in user (e.g. a client-portal account) could overwrite an
    // arbitrary prospect's selection by enumerating its id.
    if (!(await isApiAdmin())) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    const { error } = await sb
      .from("prospects")
      .update({ team_size, selected_services })
      .eq("id", body.prospect_id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (body.token) {
    const { error } = await sb
      .from("prospects")
      .update({ team_size, selected_services })
      .eq("share_token", body.token)
      .eq("share_enabled", true);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "no target" }, { status: 400 });
}
