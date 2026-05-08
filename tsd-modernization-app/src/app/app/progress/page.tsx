import { requireUser, getMemberships } from "@/lib/auth/require";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { WorkItemStatus } from "@/lib/supabase/types";
import BackLink from "@/components/BackLink";

export const dynamic = "force-dynamic";

const COLUMNS: { key: WorkItemStatus; label: string }[] = [
  { key: "todo", label: "Up next" },
  { key: "doing", label: "In progress" },
  { key: "done", label: "Done" },
];

export default async function ProgressPage() {
  const { user } = await requireUser();
  const memberships = await getMemberships(user.id);
  const ownership = memberships.find((m) => m.role !== "admin");
  if (!ownership) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-8">
        <h1 className="text-xl font-semibold text-[#13294B]">Progress</h1>
        <p className="mt-2 text-zinc-700">
          You don&apos;t have a TSD client account linked yet.
        </p>
      </div>
    );
  }

  const sb = supabaseAdmin();
  const { data: items } = await sb
    .from("work_items")
    .select("id,title,description,status,completed_at")
    .eq("client_id", ownership.client_id)
    .order("created_at", { ascending: false });

  type Item = NonNullable<typeof items>[number];
  const grouped: Record<WorkItemStatus, Item[]> = {
    todo: [],
    doing: [],
    done: [],
  };
  (items ?? []).forEach((it) => grouped[it.status].push(it));

  return (
    <div className="space-y-6">
      <BackLink href="/app" label="Dashboard" />
      <h1 className="text-2xl font-semibold text-[#13294B]">Progress</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {COLUMNS.map(({ key, label }) => (
          <section
            key={key}
            className="rounded-lg border border-zinc-200 bg-white p-4"
          >
            <header className="flex items-center justify-between">
              <h2 className="font-semibold text-[#13294B]">{label}</h2>
              <span className="text-xs text-zinc-500">
                {grouped[key].length}
              </span>
            </header>
            <ul className="mt-3 space-y-3">
              {(grouped[key] ?? []).map((it) => (
                <li
                  key={it.id}
                  className="rounded-md border border-zinc-200 bg-zinc-50 p-3"
                >
                  <p className="font-medium text-zinc-900">{it.title}</p>
                  {it.description && (
                    <p className="mt-1 text-sm text-zinc-600">
                      {it.description}
                    </p>
                  )}
                  {it.completed_at && (
                    <p className="mt-1 text-xs text-zinc-400">
                      Completed{" "}
                      {new Date(it.completed_at).toLocaleDateString()}
                    </p>
                  )}
                </li>
              ))}
              {(grouped[key].length) === 0 && (
                <li className="text-sm text-zinc-400">Nothing here yet.</li>
              )}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
