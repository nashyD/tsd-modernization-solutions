import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { upsertWorkItem, deleteWorkItem } from "../actions";
import BackLink from "@/components/BackLink";

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
    <div className="space-y-10">
      <div>
        <BackLink href="/admin/clients" label="All clients" />
        <h1 className="mt-1 text-2xl font-semibold text-[#13294B]">
          {client.name}
        </h1>
        <p className="text-sm text-zinc-500">
          {client.website_url} · package: {client.package_tier} · vercel:{" "}
          {client.vercel_project_id ?? "—"} · vapi:{" "}
          {client.vapi_assistant_id ?? "—"}
        </p>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-[#13294B]">Work items</h2>
        <ul className="mt-3 divide-y divide-zinc-200 rounded-lg border border-zinc-200 bg-white">
          {(workItems ?? []).map((w) => (
            <li
              key={w.id}
              className="flex items-start justify-between gap-4 px-4 py-3"
            >
              <form action={upsertWorkItem} className="flex-1 space-y-2">
                <input type="hidden" name="id" value={w.id} />
                <input type="hidden" name="client_id" value={id} />
                <input
                  name="title"
                  defaultValue={w.title}
                  className="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm"
                />
                <textarea
                  name="description"
                  defaultValue={w.description ?? ""}
                  rows={2}
                  className="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm"
                />
                <div className="flex items-center gap-2">
                  <select
                    name="status"
                    defaultValue={w.status}
                    className="rounded-md border border-zinc-300 px-2 py-1 text-sm"
                  >
                    <option value="todo">todo</option>
                    <option value="doing">doing</option>
                    <option value="done">done</option>
                  </select>
                  <button
                    type="submit"
                    className="rounded-md bg-[#13294B] px-3 py-1 text-sm font-medium text-white"
                  >
                    Save
                  </button>
                </div>
              </form>
              <form action={deleteWorkItem}>
                <input type="hidden" name="id" value={w.id} />
                <input type="hidden" name="client_id" value={id} />
                <button
                  type="submit"
                  className="text-sm text-red-700 hover:underline"
                >
                  Delete
                </button>
              </form>
            </li>
          ))}
          {workItems?.length === 0 && (
            <li className="px-4 py-6 text-sm text-zinc-500">
              No work items yet.
            </li>
          )}
        </ul>

        <form
          action={upsertWorkItem}
          className="mt-6 space-y-3 rounded-lg border border-zinc-200 bg-white p-4"
        >
          <input type="hidden" name="client_id" value={id} />
          <h3 className="font-semibold text-[#13294B]">Add work item</h3>
          <input
            name="title"
            required
            placeholder="Title"
            className="w-full rounded-md border border-zinc-300 px-3 py-2"
          />
          <textarea
            name="description"
            placeholder="Description"
            rows={2}
            className="w-full rounded-md border border-zinc-300 px-3 py-2"
          />
          <div className="flex items-center gap-3">
            <select
              name="status"
              defaultValue="todo"
              className="rounded-md border border-zinc-300 px-3 py-2"
            >
              <option value="todo">todo</option>
              <option value="doing">doing</option>
              <option value="done">done</option>
            </select>
            <button
              type="submit"
              className="rounded-md bg-[#13294B] px-4 py-2 font-semibold text-white"
            >
              Add
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
