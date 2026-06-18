import Link from "next/link";
import { Plus, Building2, Eye } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth/require";
import { PACKAGE_TIERS } from "@/lib/packages";
import { createClient } from "./actions";
import { viewAsClient } from "../view-as-actions";
import DeleteClientButton from "./DeleteClientButton";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Label, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function AdminClientsPage() {
  // Defense in depth: there is no middleware, and Next 16 partial rendering can
  // reach a page without re-running the layout — so guard here too, not only in
  // admin/layout.tsx, before any service-role (RLS-bypassing) read.
  await requireRole("admin");
  const sb = supabaseAdmin();
  const { data: clients } = await sb
    .from("clients")
    .select("id,name,website_url,package_tier,created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-12 animate-fade-up">
      <PageHeader
        eyebrow="Admin"
        title="Clients"
        description="Every TSD account, their package tier, and the link to their work-item editor."
      />

      <section>
        {clients?.length === 0 ? (
          <EmptyState
            icon={<Building2 size={20} />}
            title="No clients yet"
            description="Use the form below to add the first one."
          />
        ) : (
          <ul className="divide-y divide-[var(--border)] rounded-[14px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
            {(clients ?? []).map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-[var(--surface-2)]"
              >
                <div className="min-w-0">
                  <Link
                    href={`/admin/clients/${c.id}`}
                    className="font-semibold text-[var(--text)] transition-colors hover:text-[var(--accent)]"
                  >
                    {c.name}
                  </Link>
                  <p className="truncate text-sm text-[var(--text-muted)]">
                    {c.website_url} ·{" "}
                    <span className="font-mono text-xs">{c.package_tier}</span>
                  </p>
                </div>
                <div className="flex flex-none items-center gap-4">
                  <span className="hidden text-xs text-[var(--text-subtle)] sm:inline">
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                  <form action={viewAsClient}>
                    <input type="hidden" name="client_id" value={c.id} />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
                      title={`View portal as ${c.name}`}
                    >
                      <Eye size={13} strokeWidth={2.25} aria-hidden />
                      View as
                    </button>
                  </form>
                  <DeleteClientButton id={c.id} name={c.name} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
        <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--text)]">
          Add a client
        </h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Optional: paste an owner email to send a portal invite.
        </p>
        <form action={createClient} className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Business name</Label>
            <Input id="name" name="name" required placeholder="Acme HVAC" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="website_url">Website URL</Label>
            <Input
              id="website_url"
              name="website_url"
              required
              placeholder="acmehvac.com"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="package_tier">Package tier</Label>
            <Select
              id="package_tier"
              name="package_tier"
              required
              defaultValue="website_ai_bundle"
              className="mt-1.5"
            >
              {PACKAGE_TIERS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="owner_email" hint="(optional)">
              Owner email
            </Label>
            <Input
              id="owner_email"
              name="owner_email"
              type="email"
              placeholder="owner@acmehvac.com"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="vapi_assistant_id" hint="(optional)">
              Vapi assistant ID
            </Label>
            <Input
              id="vapi_assistant_id"
              name="vapi_assistant_id"
              placeholder="…"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="vercel_project_id" hint="(optional)">
              Vercel project ID
            </Label>
            <Input
              id="vercel_project_id"
              name="vercel_project_id"
              placeholder="prj_…"
              className="mt-1.5"
            />
          </div>
          <div className="sm:col-span-2">
            <Button
              type="submit"
              leftIcon={<Plus size={16} strokeWidth={2.25} />}
            >
              Create client
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
