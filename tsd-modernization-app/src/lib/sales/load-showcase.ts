import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
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
      .from("prospect-assets")
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

export async function loadShowcaseByToken(
  token: string,
): Promise<Showcase | null> {
  const sb = supabaseAdmin();
  const { data: prospect } = await sb
    .from("prospects")
    .select("*")
    .eq("share_token", token)
    .eq("share_enabled", true)
    .maybeSingle();
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
