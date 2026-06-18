import { ListChecks, CheckCircle2, Clock, Circle } from "lucide-react";
import {
  requireUser,
  getMemberships,
  getActiveClient,
} from "@/lib/auth/require";
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
  { key: "todo", label: "Up next", icon: Circle, iconClass: "text-[var(--text-subtle)]" },
  { key: "doing", label: "In progress", icon: Clock, iconClass: "text-[var(--accent)]" },
  { key: "done", label: "Done", icon: CheckCircle2, iconClass: "text-[var(--success)]" },
];

export default async function ProgressPage() {
  const { user } = await requireUser();
  const memberships = await getMemberships(user.id);
  const active = await getActiveClient(memberships);
  if (!active) {
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
    .eq("client_id", active.client_id)
    .order("created_at", { ascending: false });

  type Item = NonNullable<typeof items>[number];
  const grouped: Record<WorkItemStatus, Item[]> = { todo: [], doing: [], done: [] };
  // Guard the bucket lookup so an unexpected status value can't throw and 500 the page.
  (items ?? []).forEach((it) => grouped[it.status as WorkItemStatus]?.push(it));

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
            className="flex flex-col rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <header className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon size={16} strokeWidth={2} className={iconClass} aria-hidden />
                <h2 className="text-sm font-semibold tracking-tight text-[var(--text)]">
                  {label}
                </h2>
              </div>
              <span className="text-xs font-medium text-[var(--text-subtle)]">
                {grouped[key].length}
              </span>
            </header>
            <ul className="flex flex-col gap-2.5">
              {grouped[key].length === 0 && (
                <li className="rounded-lg border border-dashed border-[var(--border)] px-3 py-6 text-center text-xs text-[var(--text-subtle)]">
                  Nothing here yet.
                </li>
              )}
              {grouped[key].map((it) => (
                <li
                  key={it.id}
                  className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3 transition-colors hover:border-[var(--border-strong)]"
                >
                  <p className="text-sm font-medium text-[var(--text)]">{it.title}</p>
                  {it.description && (
                    <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">
                      {it.description}
                    </p>
                  )}
                  {it.completed_at && (
                    <p className="mt-1.5 text-[11px] uppercase tracking-wide text-[var(--text-subtle)]">
                      Completed {new Date(it.completed_at).toLocaleDateString()}
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
