import { notFound } from "next/navigation";
import { Trash2 } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { loadShowcaseById } from "@/lib/sales/load-showcase";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input, Label, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import BackLink from "@/components/BackLink";
import { PACKAGE_TIERS } from "@/lib/packages";
import { SERVICE_KEYS, SERVICE_LABEL, type ServiceKey } from "@/lib/sales/services";
import { updateProspect, deleteProspect } from "../../actions";
import {
  upsertEstimate,
  deleteEstimate,
  draftEstimates,
  uploadAsset,
  deleteAsset,
} from "../../estimate-actions";

export const dynamic = "force-dynamic";

export default async function EditProspect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sb = supabaseAdmin();
  const { data: p } = await sb.from("prospects").select("*").eq("id", id).single();
  if (!p) notFound();
  const showcase = await loadShowcaseById(id);
  const estimates = showcase?.estimates ?? [];
  const assets = showcase?.assets ?? [];

  return (
    <div className="space-y-8">
      <BackLink href={`/sales/${id}`} label="Back to pitch" />
      <PageHeader eyebrow="Sales" title={`Edit — ${p.business_name}`} />

      <form action={updateProspect} className="grid gap-4 sm:grid-cols-2">
        <input type="hidden" name="id" value={p.id} />
        <div>
          <Label htmlFor="business_name">Business name</Label>
          <Input id="business_name" name="business_name" defaultValue={p.business_name} required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="business_url">Business URL</Label>
          <Input id="business_url" name="business_url" defaultValue={p.business_url} required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="contact_name" hint="(optional)">Contact name</Label>
          <Input id="contact_name" name="contact_name" defaultValue={p.contact_name ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="email" hint="(optional)">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={p.email ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="phone" hint="(optional)">Phone</Label>
          <Input id="phone" name="phone" defaultValue={p.phone ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="demo_site_url" hint="(optional)">Demo site URL</Label>
          <Input id="demo_site_url" name="demo_site_url" defaultValue={p.demo_site_url ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="vapi_assistant_id" hint="(optional)">Vapi assistant ID</Label>
          <Input id="vapi_assistant_id" name="vapi_assistant_id" defaultValue={p.vapi_assistant_id ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="package_tier" hint="(optional)">Package tier</Label>
          <Select id="package_tier" name="package_tier" defaultValue={p.package_tier ?? ""} className="mt-1.5">
            <option value="">—</option>
            {PACKAGE_TIERS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="deposit_target">Deposit target ($)</Label>
          <Input id="deposit_target" name="deposit_target" type="number" min="0" step="1" defaultValue={String(p.deposit_target)} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="max_discount_pct" hint="(Nash-only floor)">Max discount %</Label>
          <Input id="max_discount_pct" name="max_discount_pct" type="number" min="0" max="100" step="1" defaultValue={String(p.max_discount_pct)} className="mt-1.5" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="outline_md" hint="(optional)">Project outline</Label>
          <Textarea id="outline_md" name="outline_md" rows={5} defaultValue={p.outline_md ?? ""} className="mt-1.5" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="notes" hint="(internal)">Notes</Label>
          <Textarea id="notes" name="notes" rows={2} defaultValue={p.notes ?? ""} className="mt-1.5" />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit">Save changes</Button>
        </div>
      </form>

      <section className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-[var(--text)]">
            Value estimates
          </h2>
          {p.audit_id && (
            <form action={draftEstimates}>
              <input type="hidden" name="prospect_id" value={p.id} />
              <Button type="submit" variant="secondary" size="sm">
                Draft from audit
              </Button>
            </form>
          )}
        </div>
        <ul className="mt-4 space-y-3">
          {estimates.map((e) => (
            <li key={e.id}>
              <form action={upsertEstimate} className="flex flex-wrap items-end gap-2">
                <input type="hidden" name="id" value={e.id} />
                <input type="hidden" name="prospect_id" value={p.id} />
                <input type="hidden" name="service_key" value={e.service_key} />
                <span className="min-w-[140px] text-sm font-medium text-[var(--text)]">
                  {SERVICE_LABEL[e.service_key as ServiceKey]}
                </span>
                <Input name="dollar_value" type="number" min="0" defaultValue={String(e.dollar_value)} className="w-28" aria-label="Dollar value" />
                <Input name="rationale" defaultValue={e.rationale ?? ""} placeholder="Rationale" className="flex-1 min-w-[180px]" aria-label="Rationale" />
                <Button type="submit" size="sm">Save</Button>
              </form>
              <form action={deleteEstimate} className="mt-1">
                <input type="hidden" name="id" value={e.id} />
                <input type="hidden" name="prospect_id" value={p.id} />
                <button className="text-xs text-[var(--danger)] hover:underline">Remove</button>
              </form>
            </li>
          ))}
        </ul>
        <form action={upsertEstimate} className="mt-4 flex flex-wrap items-end gap-2 border-t border-[var(--border)] pt-4">
          <input type="hidden" name="prospect_id" value={p.id} />
          <Select name="service_key" defaultValue={SERVICE_KEYS[0]} className="w-auto" aria-label="Service">
            {SERVICE_KEYS.map((k) => (
              <option key={k} value={k}>
                {SERVICE_LABEL[k]}
              </option>
            ))}
          </Select>
          <Input name="dollar_value" type="number" min="0" defaultValue="0" className="w-28" aria-label="Dollar value" />
          <Input name="rationale" placeholder="Rationale" className="flex-1 min-w-[180px]" aria-label="Rationale" />
          <Button type="submit" size="sm">Add</Button>
        </form>
      </section>

      <section className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
        <h2 className="font-display text-lg font-semibold text-[var(--text)]">
          Demo work files
        </h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {assets.map((a) => (
            <li key={a.id} className="flex items-center justify-between gap-2 rounded-lg border border-[var(--border)] px-3 py-2">
              <span className="truncate text-sm text-[var(--text)]">{a.label ?? a.kind}</span>
              <form action={deleteAsset}>
                <input type="hidden" name="id" value={a.id} />
                <input type="hidden" name="prospect_id" value={p.id} />
                <button className="text-[var(--danger)]" aria-label="Delete asset">
                  <Trash2 size={14} />
                </button>
              </form>
            </li>
          ))}
        </ul>
        <form action={uploadAsset} className="mt-4 flex flex-wrap items-end gap-2 border-t border-[var(--border)] pt-4">
          <input type="hidden" name="prospect_id" value={p.id} />
          <input type="file" name="file" required className="text-sm text-[var(--text-muted)]" />
          <Input name="label" placeholder="Label (optional)" className="flex-1 min-w-[160px]" aria-label="Label" />
          <Button type="submit" size="sm">Upload</Button>
        </form>
      </section>

      <form action={deleteProspect} className="border-t border-[var(--border)] pt-6">
        <input type="hidden" name="id" value={p.id} />
        <Button type="submit" variant="danger" size="sm">Delete prospect</Button>
      </form>
    </div>
  );
}
