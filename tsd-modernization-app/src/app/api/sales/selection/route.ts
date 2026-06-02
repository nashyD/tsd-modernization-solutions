import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { SIZES, PRODUCTS } from "@/lib/sales/estimator";

export const runtime = "nodejs";

const VALID_SIZES = new Set(SIZES.map((s) => s.id));
const VALID_SERVICES = new Set(PRODUCTS.map((p) => p.id));

const Body = z.object({
  prospect_id: z.string().uuid().optional(),
  token: z.string().optional(),
  team_size: z.string(),
  selected_services: z.array(z.string()),
});

/**
 * Persist a prospect's live service selection. Reachable two ways:
 * - admin pitch view (prospect_id, requires login)
 * - public showcase (token), so a prospect's own picks save before they pay.
 * Values are whitelisted against the estimator's known ids.
 */
export async function POST(req: NextRequest) {
  const body = Body.parse(await req.json());
  const team_size = VALID_SIZES.has(body.team_size) ? body.team_size : "small";
  const selected_services = body.selected_services.filter((s) =>
    VALID_SERVICES.has(s),
  );

  const sb = supabaseAdmin();

  if (body.prospect_id) {
    const {
      data: { user },
    } = await (await supabaseServer()).auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
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
