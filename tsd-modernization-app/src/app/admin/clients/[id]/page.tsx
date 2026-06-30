import { notFound } from "next/navigation";
import {
  Plus,
  Trash2,
  ClipboardList,
  Eye,
  Mail,
  UserPlus,
  Save,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth/require";
import {
  upsertWorkItem,
  deleteWorkItem,
  updateClient,
  inviteOwner,
  removeOwner,
} from "../actions";
import { viewAsClient } from "../../view-as-actions";
import { PACKAGE_TIERS } from "@/lib/packages";
import BackLink from "@/components/BackLink";
import { Input, Label, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";

export default async function AdminClientDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Defense in depth alongside admin/layout.tsx (no middleware; Next 16 partial
  // rendering can reach a page without re-running the layout).
  await requireRole("admin");
  const { id } = await params;
  const sb = supabaseAdmin();
  const { data: client } = await sb
    .from("clients")
    .select("id,name,website_url,package_tier,vapi_assistant_id,vercel_project_id")
    .eq("id", id)
    .single();
  if (!client) notFound();

  const { data: workItems } = await sb
    .from("work_items")
    .select("id,title,description,status,completed_at")
    .eq("client_id", id)
    .order("created_at", { ascending: false });

  const { data: ownerLinks } = await sb
    .from("client_users")
    .select("user_id,role,created_at")
    .eq("client_id", id)
    .order("created_at", { ascending: true });

  const owners = await Promise.all(
    (ownerLinks ?? []).map(async (link) => {
      const { data } = await sb.auth.admin.getUserById(link.user_id);
      return {
        user_id: link.user_id,
        role: link.role,
        email: data.user?.email ?? "(unknown)",
        last_sign_in_at: data.user?.last_sign_in_at ?? null,
      };
    })
  );

  return (
    <div className="space-y-10 animate-fade-up">
      <div>
        <BackLink href="/admin/clients" label="All clients" />
        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--text)]">
            {client.name}
          </h1>
          <form action={viewAsClient}>
            <input type="hidden" name="client_id" value={client.id} />
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              leftIcon={<Eye size={14} strokeWidth={2.25} />}
            >
              View portal as this client
            </Button>
          </form>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[var(--text-subtle)]">
          <a
            href={client.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-[var(--accent)]"
          >
            {client.website_url}
            <ExternalLink size={12} strokeWidth={2} aria-hidden />
          </a>
          <span aria-hidden>·</span>
          <Badge tone="blue">{client.package_tier}</Badge>
        </div>
      </div>

      <section className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
        <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--text)]">
          Client info
        </h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Edit the company details, package tier, and integration IDs.
        </p>
        <form action={updateClient} className="mt-5 grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="id" value={client.id} />
          <div>
            <Label htmlFor="edit-name">Business name</Label>
            <Input
              id="edit-name"
              name="name"
              defaultValue={client.name}
              required
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="edit-website_url">Website URL</Label>
            <Input
              id="edit-website_url"
              name="website_url"
              defaultValue={client.website_url}
              required
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="edit-package_tier">Package tier</Label>
            <Select
              id="edit-package_tier"
              name="package_tier"
              defaultValue={client.package_tier}
              required
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
            <Label htmlFor="edit-vercel_project_id" hint="(prj_…)">
              Vercel project ID
            </Label>
            <Input
              id="edit-vercel_project_id"
              name="vercel_project_id"
              defaultValue={client.vercel_project_id ?? ""}
              placeholder="prj_…"
              className="mt-1.5"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="edit-vapi_assistant_id" hint="(optional)">
              Vapi assistant ID
            </Label>
            <Input
              id="edit-vapi_assistant_id"
              name="vapi_assistant_id"
              defaultValue={client.vapi_assistant_id ?? ""}
              className="mt-1.5"
            />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" leftIcon={<Save size={16} strokeWidth={2.25} />}>
              Save changes
            </Button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--text)]">
          Owners
        </h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          People who can sign in and see this client&rsquo;s portal. Inviting an
          email sends a magic-link sign-in.
        </p>

        {owners.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              icon={<Mail size={20} />}
              title="No owners linked yet"
              description="Add an email below — they&rsquo;ll get a sign-in link from Supabase."
            />
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-[var(--border)] rounded-[12px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
            {owners.map((o) => (
              <li
                key={o.user_id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-[var(--text)]">
                    {o.email}
                  </p>
                  <p className="text-xs text-[var(--text-subtle)]">
                    {o.role}
                    {o.last_sign_in_at
                      ? ` · last seen ${new Date(o.last_sign_in_at).toLocaleDateString()}`
                      : " · never signed in"}
                  </p>
                </div>
                <form action={removeOwner}>
                  <input type="hidden" name="client_id" value={client.id} />
                  <input type="hidden" name="user_id" value={o.user_id} />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--danger)] hover:underline"
                  >
                    <Trash2 size={12} strokeWidth={2} aria-hidden />
                    Remove
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}

        <details className="group mt-5 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
          <summary className="flex cursor-pointer list-none items-center gap-2 px-5 py-4 text-sm font-semibold text-[var(--text)] [&::-webkit-details-marker]:hidden">
            <UserPlus size={16} strokeWidth={2.25} aria-hidden />
            Invite an owner
            <ChevronRight
              size={16}
              strokeWidth={2.25}
              aria-hidden
              className="ml-auto text-[var(--text-subtle)] transition-transform group-open:rotate-90"
            />
          </summary>
          <form
            action={inviteOwner}
            className="border-t border-[var(--border)] px-5 pb-5 pt-4"
          >
            <input type="hidden" name="client_id" value={client.id} />
            <p className="text-sm text-[var(--text-muted)]">
              They&rsquo;ll receive a magic-link email and land in this client&rsquo;s portal.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
              <div>
                <Label htmlFor="invite-email" className="sr-only">
                  Email
                </Label>
                <Input
                  id="invite-email"
                  name="email"
                  type="email"
                  required
                  placeholder="owner@business.com"
                />
              </div>
              <Select
                name="role"
                defaultValue="owner"
                aria-label="Role"
                className="w-auto"
              >
                <option value="owner">owner</option>
                <option value="manager">manager</option>
              </Select>
              <Button
                type="submit"
                leftIcon={<UserPlus size={16} strokeWidth={2.25} />}
              >
                Send invite
              </Button>
            </div>
          </form>
        </details>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--text)]">
          Work items
        </h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          What we&rsquo;re building — these power the client&rsquo;s progress board.
        </p>
        {workItems?.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              icon={<ClipboardList size={20} />}
              title="No work items yet"
              description="Add the first one below — it'll show up on the client's progress kanban."
            />
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {(workItems ?? []).map((w) => (
              <li
                key={w.id}
                className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)]"
              >
                <form action={upsertWorkItem} className="space-y-3">
                  <input type="hidden" name="id" value={w.id} />
                  <input type="hidden" name="client_id" value={id} />
                  <Input
                    name="title"
                    defaultValue={w.title}
                    aria-label="Title"
                  />
                  <Textarea
                    name="description"
                    defaultValue={w.description ?? ""}
                    rows={2}
                    aria-label="Description"
                    placeholder="Optional description"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Select
                      name="status"
                      defaultValue={w.status}
                      aria-label="Status"
                      className="w-auto"
                    >
                      <option value="todo">todo</option>
                      <option value="doing">doing</option>
                      <option value="done">done</option>
                    </Select>
                    <div className="flex items-center gap-2">
                      {/* Same form; formAction routes this button to delete instead of upsert. */}
                      <button
                        type="submit"
                        formAction={deleteWorkItem}
                        aria-label="Delete work item"
                        title="Delete work item"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-subtle)] transition-colors hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]"
                      >
                        <Trash2 size={14} strokeWidth={2} aria-hidden />
                      </button>
                      <Button type="submit" size="sm">
                        Save
                      </Button>
                    </div>
                  </div>
                </form>
              </li>
            ))}
          </ul>
        )}

        <details className="group mt-6 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
          <summary className="flex cursor-pointer list-none items-center gap-2 px-5 py-4 text-sm font-semibold text-[var(--text)] [&::-webkit-details-marker]:hidden">
            <Plus size={16} strokeWidth={2.25} aria-hidden />
            Add work item
            <ChevronRight
              size={16}
              strokeWidth={2.25}
              aria-hidden
              className="ml-auto text-[var(--text-subtle)] transition-transform group-open:rotate-90"
            />
          </summary>
          <form
            action={upsertWorkItem}
            className="space-y-4 border-t border-[var(--border)] px-5 pb-5 pt-4"
          >
            <input type="hidden" name="client_id" value={id} />
            <div>
              <Label htmlFor={`title-new`}>Title</Label>
              <Input id={`title-new`} name="title" required placeholder="Build the homepage" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor={`desc-new`} hint="(optional)">
                Description
              </Label>
              <Textarea
                id={`desc-new`}
                name="description"
                rows={2}
                className="mt-1.5"
                placeholder="What this entails…"
              />
            </div>
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <Label htmlFor={`status-new`}>Status</Label>
                <Select id={`status-new`} name="status" defaultValue="todo" className="mt-1.5 w-auto">
                  <option value="todo">todo</option>
                  <option value="doing">doing</option>
                  <option value="done">done</option>
                </Select>
              </div>
              <Button type="submit" leftIcon={<Plus size={16} strokeWidth={2.25} />}>
                Add work item
              </Button>
            </div>
          </form>
        </details>
      </section>
    </div>
  );
}
