import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { PROSPECT_ASSETS_BUCKET } from "@/lib/sales/storage";
import type { Database } from "@/lib/supabase/types";

export type ProspectRow = Database["public"]["Tables"]["prospects"]["Row"];
export type EstimateRow =
  Database["public"]["Tables"]["prospect_estimates"]["Row"];

export interface ShowcaseAsset {
  id: string;
  kind: string;
  label: string | null;
  url: string;
}
export interface Showcase {
  prospect: ProspectRow;
  estimates: EstimateRow[];
  assets: ShowcaseAsset[];
}

async function buildAssets(prospectId: string): Promise<ShowcaseAsset[]> {
  const sb = supabaseAdmin();
  const { data } = await sb
    .from("prospect_assets")
    .select("id,kind,label,storage_path,sort_order")
    .eq("prospect_id", prospectId)
    .order("sort_order", { ascending: true });
  const rows = data ?? [];
  const out: ShowcaseAsset[] = [];
  for (const r of rows) {
    const { data: signed } = await sb.storage
      .from(PROSPECT_ASSETS_BUCKET)
      .createSignedUrl(r.storage_path, 60 * 60);
    out.push({
      id: r.id,
      kind: r.kind,
      label: r.label,
      url: signed?.signedUrl ?? "",
    });
  }
  return out;
}

export async function loadShowcaseById(id: string): Promise<Showcase | null> {
  const sb = supabaseAdmin();
  const { data: prospect } = await sb
    .from("prospects")
    .select("*")
    .eq("id", id)
    .single();
  if (!prospect) return null;
  const { data: estimates } = await sb
    .from("prospect_estimates")
    .select("*")
    .eq("prospect_id", id)
    .order("sort_order", { ascending: true });
  return {
    prospect,
    estimates: estimates ?? [],
    assets: await buildAssets(id),
  };
}

// Explicit allow-list for the PUBLIC token surface — only fields the leave-behind
// page actually renders. Keeps internal columns (notes, email, gap_summary,
// fit_score, source_url, max_discount_pct, deposit_target, firmographics) out of
// the server payload entirely, so a careless future prop-pass can't leak them.
const PUBLIC_PROSPECT_COLS =
  "id,business_name,demo_site_url,vapi_assistant_id,outline_md,share_token,team_size,selected_services,deposit_pct,primary_product,contact_name";

export async function loadShowcaseByToken(
  token: string,
): Promise<Showcase | null> {
  const sb = supabaseAdmin();
  const { data: prospect } = await sb
    .from("prospects")
    .select(PUBLIC_PROSPECT_COLS)
    .eq("share_token", token)
    .eq("share_enabled", true)
    .maybeSingle<ProspectRow>();
  if (!prospect) return null;
  const { data: estimates } = await sb
    .from("prospect_estimates")
    .select("*")
    .eq("prospect_id", prospect.id)
    .order("sort_order", { ascending: true });
  return {
    prospect,
    estimates: estimates ?? [],
    assets: await buildAssets(prospect.id),
  };
}
