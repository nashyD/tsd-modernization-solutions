import { CloudUpload, ExternalLink } from "lucide-react";
import { requireUser, getMemberships } from "@/lib/auth/require";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { env } from "@/lib/env";
import BackLink from "@/components/BackLink";
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

async function fetchLatestDeployment(
  projectId: string
): Promise<VercelDeployment | null> {
  const e = env();
  if (!e.VERCEL_API_TOKEN) return null;
  const res = await fetch(
    `https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=1`,
    {
      headers: { Authorization: `Bearer ${e.VERCEL_API_TOKEN}` },
      cache: "no-store",
    }
  );
  if (!res.ok) return null;
  const json = (await res.json()) as { deployments?: VercelDeployment[] };
  return json.deployments?.[0] ?? null;
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
  const ownership = memberships.find((m) => m.role !== "admin");
  if (!ownership) {
    return (
      <div className="space-y-6">
        <BackLink href="/app" label="Dashboard" />
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
    .eq("id", ownership.client_id)
    .single();

  const deployment = client?.vercel_project_id
    ? await fetchLatestDeployment(client.vercel_project_id)
    : null;

  return (
    <div className="space-y-8 animate-fade-up">
      <BackLink href="/app" label="Dashboard" />

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
        <div className="rounded-[14px] border border-amber-200 bg-amber-50/70 p-5 text-amber-900">
          We couldn&apos;t reach Vercel for this project. Try again in a moment.
        </div>
      )}

      {deployment && (
        <section className="rounded-[14px] border border-zinc-200/80 bg-white p-6 shadow-[0_1px_2px_rgb(15_23_42_/_0.04)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-[#13294B]">
                Latest deployment
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                {new Date(deployment.created).toLocaleString()}
              </p>
            </div>
            <Badge tone={stateTone(deployment.state)}>{deployment.state}</Badge>
          </div>

          <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-zinc-500">
                Live URL
              </dt>
              <dd className="mt-1">
                <a
                  href={`https://${deployment.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-[#13294B] underline underline-offset-2 hover:text-[#1f3666]"
                >
                  {deployment.url}
                  <ExternalLink size={13} strokeWidth={2} aria-hidden />
                </a>
              </dd>
            </div>
            {deployment.meta?.githubCommitMessage && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-zinc-500">
                  Last change
                </dt>
                <dd className="mt-1 text-zinc-800">
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
