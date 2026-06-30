import { notFound } from "next/navigation";
import {
  Trash2,
  Presentation,
  ClipboardList,
  NotebookPen,
  Calculator,
  Paperclip,
} from "lucide-react";
import { loadShowcaseById } from "@/lib/sales/load-showcase";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Input, Label, Textarea, Select } from "@/components/ui/Input";
import { Button, LinkButton } from "@/components/ui/Button";
import { SubmitButton } from "@/components/ui/SubmitButton";
import BackLink from "@/components/BackLink";
import { PACKAGE_TIERS } from "@/lib/packages";
import { SERVICE_KEYS, SERVICE_LABEL, type ServiceKey } from "@/lib/sales/services";
import { env } from "@/lib/env";
import { updateProspect, deleteProspect, deleteProspectNote } from "../actions";
import {
  upsertEstimate,
  deleteEstimate,
  draftEstimates,
  uploadAsset,
  deleteAsset,
} from "../estimate-actions";
import PitchActions from "./PitchActions";
import DispositionBar from "../_components/DispositionBar";
import { NoteComposer } from "../_components/PitchNotes";
import { WorkspaceTabs } from "./WorkspaceTabs";
import AuditRunner from "./AuditRunner";
import type { AuditStatus } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

const CARD =
  "rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]";

const GROUP =
  "text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]";

const NOTE_TIME = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/New_York",
});

export default async function ProspectWorkspace({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const showcase = await loadShowcaseById(id);
  if (!showcase) notFound();
  const { prospect: p, estimates, assets } = showcase;
  const shareUrl = `${env().NEXT_PUBLIC_SITE_URL}/showcase/${p.share_token}`;

  // Audit status drives the "Run audit" control (auto-drafts value estimates).
  let auditStatus: AuditStatus | null = null;
  if (p.audit_id) {
    const { data: audit } = await supabaseAdmin()
      .from("audits")
      .select("status")
      .eq("id", p.audit_id)
      .maybeSingle();
    auditStatus = (audit?.status as AuditStatus) ?? null;
  }

  // Append-only demo/pitch log, newest first.
  const { data: notes } = await supabaseAdmin()
    .from("prospect_notes")
    .select("id,body,author_email,created_at")
    .eq("prospect_id", id)
    .order("created_at", { ascending: false });

  const detailsPanel = (
    <div className="space-y-6">
      <section className={CARD}>
        <form action={updateProspect} className="grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="id" value={p.id} />
          <p className={`${GROUP} sm:col-span-2`}>Contact</p>
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

          <p className={`${GROUP} mt-3 sm:col-span-2`}>Pitch configuration</p>
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
            <Label htmlFor="deposit_pct" hint="(% of the low estimate)">
              Deposit %
            </Label>
            <Input id="deposit_pct" name="deposit_pct" type="number" min="0" max="100" step="1" defaultValue={String(p.deposit_pct ?? 10)} className="mt-1.5" />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="outline_md" hint="(shown on pitch)">Project outline</Label>
            <Textarea id="outline_md" name="outline_md" rows={5} defaultValue={p.outline_md ?? ""} className="mt-1.5" />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="notes" hint="(internal · one-line pin, overwritten on save — use the Notes tab for visit history)">
              Quick summary
            </Label>
            <Textarea id="notes" name="notes" rows={2} defaultValue={p.notes ?? ""} className="mt-1.5" />
          </div>
          <div className="sm:col-span-2">
            <SubmitButton pendingText="Saving…">Save changes</SubmitButton>
          </div>
        </form>
      </section>

      <section className={`${CARD} border-[var(--danger)]/30`}>
        <h2 className="font-display text-lg font-semibold text-[var(--text)]">
          Danger zone
        </h2>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          Permanently delete this prospect and everything attached to it.
        </p>
        <form action={deleteProspect} className="mt-4">
          <input type="hidden" name="id" value={p.id} />
          <Button type="submit" variant="danger" size="sm">Delete prospect</Button>
        </form>
      </section>
    </div>
  );

  const notesPanel = (
    <section className={CARD}>
      <p className="text-xs text-[var(--text-muted)]">
        Logged after each visit — who, when, and what happened. Internal only.
      </p>
      <div className="mt-4">
        <NoteComposer prospectId={p.id} />
      </div>
      <ul className="mt-6 space-y-3">
        {(notes ?? []).map((n) => (
          <li
            key={n.id}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-[var(--text-muted)]">
                {n.author_email ?? "TSD"} ·{" "}
                {NOTE_TIME.format(new Date(n.created_at))}
              </span>
              <form action={deleteProspectNote}>
                <input type="hidden" name="id" value={n.id} />
                <input type="hidden" name="prospect_id" value={p.id} />
                <button
                  className="text-[var(--text-subtle)] transition-colors hover:text-[var(--danger)]"
                  aria-label="Delete note"
                >
                  <Trash2 size={14} />
                </button>
              </form>
            </div>
            <p className="mt-1.5 whitespace-pre-wrap text-sm text-[var(--text)]">
              {n.body}
            </p>
          </li>
        ))}
        {(notes ?? []).length === 0 && (
          <li className="rounded-lg border border-dashed border-[var(--border)] px-3 py-6 text-center text-sm text-[var(--text-subtle)]">
            No notes yet — add one after your demo.
          </li>
        )}
      </ul>
    </section>
  );

  const valuePanel = (
    <section className={CARD}>
      <p className="text-xs text-[var(--text-muted)]">
        Shown on the pitch under &ldquo;What each service is worth to you.&rdquo;
      </p>
      <div className="mt-4">
        <AuditRunner
          prospectId={p.id}
          auditId={p.audit_id}
          initialStatus={auditStatus}
        />
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
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] pt-4">
        <form action={upsertEstimate} className="flex flex-wrap items-end gap-2">
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
        {p.audit_id && (
          <form action={draftEstimates}>
            <input type="hidden" name="prospect_id" value={p.id} />
            <Button type="submit" variant="secondary" size="sm">
              Draft from audit
            </Button>
          </form>
        )}
      </div>
    </section>
  );

  const filesPanel = (
    <section className={CARD}>
      <p className="text-xs text-[var(--text-muted)]">
        Images and PDFs attached to this prospect&rsquo;s pitch.
      </p>
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
        {assets.length === 0 && (
          <li className="rounded-lg border border-dashed border-[var(--border)] px-3 py-6 text-center text-sm text-[var(--text-subtle)] sm:col-span-2">
            No files yet — upload a screenshot, mockup, or PDF below.
          </li>
        )}
      </ul>
      <form action={uploadAsset} className="mt-4 flex flex-wrap items-end gap-2 border-t border-[var(--border)] pt-4">
        <input type="hidden" name="prospect_id" value={p.id} />
        <input type="file" name="file" required className="text-sm text-[var(--text-muted)]" />
        <Input name="label" placeholder="Label (optional)" className="flex-1 min-w-[160px]" aria-label="Label" />
        <SubmitButton size="sm" pendingText="Uploading…">Upload</SubmitButton>
      </form>
    </section>
  );

  return (
    <div className="space-y-6 animate-fade-up">
      <BackLink href="/sales" label="All prospects" />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--text)]">
            {p.business_name}
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{p.business_url}</p>
        </div>
        <LinkButton
          href={`/present/${id}`}
          size="lg"
          leftIcon={<Presentation size={18} />}
        >
          Pitch
        </LinkButton>
      </div>

      <PitchActions
        id={p.id}
        status={p.status}
        shareEnabled={p.share_enabled}
        shareUrl={shareUrl}
      />

      {/* One-tap field disposition — logs the stage event + cadence the loop owns. */}
      <DispositionBar prospectId={p.id} />

      <WorkspaceTabs
        tabs={[
          { key: "details", label: "Details", icon: ClipboardList },
          { key: "notes", label: "Notes", icon: NotebookPen },
          { key: "value", label: "Value", icon: Calculator },
          { key: "files", label: "Files", icon: Paperclip },
        ]}
        panels={{
          details: detailsPanel,
          notes: notesPanel,
          value: valuePanel,
          files: filesPanel,
        }}
      />
    </div>
  );
}
