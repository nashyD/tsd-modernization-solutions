import { NextResponse, type NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }
  // Public capability-URL poller (the lead/admin audit page polls this by UUID).
  // Never return error_message — it can carry raw exception text / LLM tool dumps.
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("audits")
    .select("id,status,updated_at")
    .eq("id", id)
    .single();
  if (error || !data) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json(data);
}
