import { requireUser, getMemberships } from "@/lib/auth/require";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { env } from "@/lib/env";
import BackLink from "@/components/BackLink";

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

export default async function DeploymentPage() {
  const { user } = await requireUser();
  const memberships = await getMemberships(user.id);
  const ownership = memberships.find((m) => m.role !== "admin");
  if (!ownership) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-8">
        <h1 className="text-xl font-semibold text-[#13294B]">Deployment</h1>
        <p className="mt-2 text-zinc-700">
          You don&apos;t have a TSD client account linked yet.
        </p>
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
    <div className="space-y-6">
      <BackLink href="/app" label="Dashboard" />
      <h1 className="text-2xl font-semibold text-[#13294B]">Deployment</h1>
      {!client?.vercel_project_id && (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 text-zinc-700">
          Your project isn&apos;t linked to a Vercel deployment yet. The TSD
          team will configure it once your site is live.
        </div>
      )}
      {client?.vercel_project_id && !deployment && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-900">
          We couldn&apos;t reach Vercel for this project. Try again in a moment.
        </div>
      )}
      {deployment && (
        <div className="rounded-lg border border-zinc-200 bg-white p-6">
          <h2 className="font-semibold text-[#13294B]">Latest deployment</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">URL</dt>
              <dd>
                <a
                  href={`https://${deployment.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#13294B] underline"
                >
                  {deployment.url}
                </a>
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">State</dt>
              <dd className="font-medium">{deployment.state}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Created</dt>
              <dd>{new Date(deployment.created).toLocaleString()}</dd>
            </div>
            {deployment.meta?.githubCommitMessage && (
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">Last change</dt>
                <dd className="max-w-md truncate">
                  {deployment.meta.githubCommitMessage}
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </div>
  );
}
