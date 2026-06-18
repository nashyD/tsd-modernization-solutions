import { CloudUpload, ExternalLink } from "lucide-react";
import {
  requireUser,
  getMemberships,
  getActiveClient,
} from "@/lib/auth/require";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { env } from "@/lib/env";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

interface VercelDeployment {
  uid: string;
  name: string;
  url: string;
  state: string;
  created: number;
  meta?: { githubCommitMessage?: string };
}

type FetchResult =
  | { ok: true; deployment: VercelDeployment | null }
  | { ok: false; reason: string };

async function fetchLatestDeployment(projectId: string): Promise<FetchResult> {
  const e = env();
  if (!e.VERCEL_API_TOKEN) {
    return { ok: false, reason: "VERCEL_API_TOKEN env var is not set" };
  }
  const url = `https://api.vercel.com/v6/deployments?projectId=${encodeURIComponent(projectId)}&limit=1`;
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Authorization: `Bearer ${e.VERCEL_API_TOKEN}` },
      cache: "no-store",
    });
  } catch (err) {
    return {
      ok: false,
      reason: `Network error reaching Vercel: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
  if (!res.ok) {
    let body = "";
    try {
      body = (await res.text()).slice(0, 400);
    } catch {
      // ignore
    }
    return {
      ok: false,
      reason: `Vercel API returned ${res.status} ${res.statusText} for projectId=${projectId}. ${body}`,
    };
  }
  const json = (await res.json()) as { deployments?: VercelDeployment[] };
  return { ok: true, deployment: json.deployments?.[0] ?? null };
}

function stateTone(state: string): "emerald" | "amber" | "red" | "neutral" {
  if (state === "READY") return "emerald";
  if (state === "BUILDING" || state === "QUEUED") return "amber";
  if (state === "ERROR" || state === "CANCELED") return "red";
  return "neutral";
}

export default async function DeploymentPage() {
  const { user } = await requireUser();
  const memberships = await getMemberships(user.id);
  const active = await getActiveClient(memberships);
  if (!active) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={<CloudUpload size={20} />}
          title="No client linked yet"
          description="Once your project is linked, the latest deployment shows up here."
        />
      </div>
    );
  }

  const sb = supabaseAdmin();
  const { data: client } = await sb
    .from("clients")
    .select("name,vercel_project_id,website_url")
    .eq("id", active.client_id)
    .single();

  const isAdmin = memberships.some((m) => m.role === "admin");
  const fetchResult = client?.vercel_project_id
    ? await fetchLatestDeployment(client.vercel_project_id)
    : null;
  const deployment = fetchResult?.ok ? fetchResult.deployment : null;
  const fetchError =
    fetchResult && !fetchResult.ok ? fetchResult.reason : null;

  return (
    <div className="space-y-8 animate-fade-up">

      <PageHeader
        eyebrow="Deployment"
        title="Production build"
        description="The latest version of your site, live on Vercel."
      />

      {!client?.vercel_project_id && (
        <EmptyState
          icon={<CloudUpload size={20} />}
          title="Not linked to Vercel yet"
          description="The TSD team will wire this up once your site is live. You'll see the deploy status, last commit message, and a direct link here."
        />
      )}

      {client?.vercel_project_id && !deployment && (
        <div className="rounded-[14px] border border-[var(--warning)]/30 bg-[var(--warning-soft)] p-5 text-[var(--warning)]">
          We couldn&apos;t reach Vercel for this project. Try again in a moment.
          {isAdmin && fetchError && (
            <div className="mt-3 rounded-md bg-[var(--surface-2)] p-3 font-mono text-xs leading-relaxed text-[var(--text-muted)]">
              <span className="font-semibold uppercase tracking-wide text-[var(--text-subtle)]">
                Admin diagnostic ·
              </span>{" "}
              {fetchError}
              <div className="mt-1.5 text-[var(--text-subtle)]">
                Stored projectId:{" "}
                <span className="text-[var(--text)]">
                  {client.vercel_project_id}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {deployment && (
        <section className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-[var(--text)]">
                Latest deployment
              </h2>
              <p className="mt-1 text-sm text-[var(--text-subtle)]">
                {new Date(deployment.created).toLocaleString()}
              </p>
            </div>
            <Badge tone={stateTone(deployment.state)}>{deployment.state}</Badge>
          </div>

          <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-[var(--text-subtle)]">
                Live URL
              </dt>
              <dd className="mt-1">
                <a
                  href={`https://${deployment.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-[var(--accent)] underline underline-offset-2 hover:text-[var(--accent-hover)]"
                >
                  {deployment.url}
                  <ExternalLink size={13} strokeWidth={2} aria-hidden />
                </a>
              </dd>
            </div>
            {deployment.meta?.githubCommitMessage && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-[var(--text-subtle)]">
                  Last change
                </dt>
                <dd className="mt-1 text-[var(--text)]">
                  {deployment.meta.githubCommitMessage}
                </dd>
              </div>
            )}
          </dl>
        </section>
      )}
    </div>
  );
}
