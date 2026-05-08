import { notFound } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { upsertWorkItem, deleteWorkItem } from "../actions";
import BackLink from "@/components/BackLink";
import { Input, Label, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ClipboardList } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminClientDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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

  return (
    <div className="space-y-10 animate-fade-up">
      <div>
        <BackLink href="/admin/clients" label="All clients" />
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#13294B]">
          {client.name}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
          <a
            href={client.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[#13294B]"
          >
            {client.website_url}
          </a>
          <span aria-hidden>·</span>
          <Badge tone="blue">{client.package_tier}</Badge>
          {client.vercel_project_id && (
            <span className="font-mono text-xs">vercel: {client.vercel_project_id}</span>
          )}
          {client.vapi_assistant_id && (
            <span className="font-mono text-xs">
              vapi: {client.vapi_assistant_id.slice(0, 8)}…
            </span>
          )}
        </div>
      </div>

      <section>
        <h2 className="font-display text-xl font-semibold tracking-tight text-[#13294B]">
          Work items
        </h2>
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
                className="rounded-[12px] border border-zinc-200/80 bg-white p-4 shadow-[0_1px_2px_rgb(15_23_42_/_0.04)]"
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
                      <Button type="submit" size="sm">
                        Save
                      </Button>
                    </div>
                  </div>
                </form>
                <form action={deleteWorkItem} className="mt-2 border-t border-zinc-100 pt-2">
                  <input type="hidden" name="id" value={w.id} />
                  <input type="hidden" name="client_id" value={id} />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700 hover:underline"
                  >
                    <Trash2 size={12} strokeWidth={2} aria-hidden />
                    Delete work item
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}

        <form
          action={upsertWorkItem}
          className="mt-6 space-y-4 rounded-[14px] border border-zinc-200/80 bg-white p-5 shadow-[0_1px_2px_rgb(15_23_42_/_0.04)]"
        >
          <input type="hidden" name="client_id" value={id} />
          <h3 className="font-semibold text-[#13294B]">Add work item</h3>
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
      </section>
    </div>
  );
}
