import { ListChecks, CheckCircle2, Clock, Circle } from "lucide-react";
import { requireUser, getMemberships } from "@/lib/auth/require";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { WorkItemStatus } from "@/lib/supabase/types";
import BackLink from "@/components/BackLink";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";

const COLUMNS: {
  key: WorkItemStatus;
  label: string;
  icon: typeof Circle;
  iconClass: string;
}[] = [
  { key: "todo", label: "Up next", icon: Circle, iconClass: "text-zinc-400" },
  {
    key: "doing",
    label: "In progress",
    icon: Clock,
    iconClass: "text-[#4B9CD3]",
  },
  {
    key: "done",
    label: "Done",
    icon: CheckCircle2,
    iconClass: "text-emerald-600",
  },
];

export default async function ProgressPage() {
  const { user } = await requireUser();
  const memberships = await getMemberships(user.id);
  const ownership = memberships.find((m) => m.role !== "admin");
  if (!ownership) {
    return (
      <div className="space-y-6">
        <BackLink href="/app" label="Dashboard" />
        <EmptyState
          icon={<ListChecks size={20} />}
          title="No client linked yet"
          description="Once you're linked to a TSD client, your build progress shows up here."
        />
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
    <div className="space-y-8 animate-fade-up">
      <BackLink href="/app" label="Dashboard" />
      <PageHeader
        eyebrow="Progress"
        title="What we&rsquo;re building"
        description="The current state of your modernization. Updated as we ship."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {COLUMNS.map(({ key, label, icon: Icon, iconClass }) => (
          <section
            key={key}
            className="flex flex-col rounded-[14px] border border-zinc-200/80 bg-white p-4"
          >
            <header className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon size={16} strokeWidth={2} className={iconClass} aria-hidden />
                <h2 className="text-sm font-semibold tracking-tight text-[#13294B]">
                  {label}
                </h2>
              </div>
              <span className="text-xs font-medium text-zinc-400">
                {grouped[key].length}
              </span>
            </header>
            <ul className="flex flex-col gap-2.5">
              {grouped[key].length === 0 && (
                <li className="rounded-lg border border-dashed border-zinc-200 px-3 py-6 text-center text-xs text-zinc-400">
                  Nothing here yet.
                </li>
              )}
              {grouped[key].map((it) => (
                <li
                  key={it.id}
                  className="rounded-lg border border-zinc-100 bg-zinc-50/60 p-3 transition-colors hover:border-zinc-200"
                >
                  <p className="text-sm font-medium text-zinc-900">{it.title}</p>
                  {it.description && (
                    <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                      {it.description}
                    </p>
                  )}
                  {it.completed_at && (
                    <p className="mt-1.5 text-[11px] uppercase tracking-wide text-zinc-400">
                      Completed{" "}
                      {new Date(it.completed_at).toLocaleDateString()}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
