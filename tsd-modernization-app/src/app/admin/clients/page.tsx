import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { PACKAGE_TIERS } from "@/lib/packages";
import { createClient } from "./actions";
import DeleteClientButton from "./DeleteClientButton";

export const dynamic = "force-dynamic";

export default async function AdminClientsPage() {
  const sb = supabaseAdmin();
  const { data: clients } = await sb
    .from("clients")
    .select("id,name,website_url,package_tier,created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-2xl font-semibold text-[#13294B]">Clients</h1>
        <ul className="mt-4 divide-y divide-zinc-200 rounded-lg border border-zinc-200 bg-white">
          {(clients ?? []).map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <Link
                  href={`/admin/clients/${c.id}`}
                  className="font-semibold text-[#13294B] hover:underline"
                >
                  {c.name}
                </Link>
                <p className="truncate text-sm text-zinc-500">
                  {c.website_url} · {c.package_tier}
                </p>
              </div>
              <div className="flex flex-none items-center gap-4">
                <span className="text-xs text-zinc-400">
                  {new Date(c.created_at).toLocaleDateString()}
                </span>
                <DeleteClientButton id={c.id} name={c.name} />
              </div>
            </li>
          ))}
          {clients?.length === 0 && (
            <li className="px-4 py-6 text-sm text-zinc-500">
              No clients yet.
            </li>
          )}
        </ul>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-[#13294B]">Add a client</h2>
        <form action={createClient} className="mt-4 grid gap-4 sm:grid-cols-2">
          <input
            name="name"
            required
            placeholder="Business name"
            className="rounded-md border border-zinc-300 px-3 py-2"
          />
          <input
            name="website_url"
            required
            placeholder="https://example.com"
            className="rounded-md border border-zinc-300 px-3 py-2"
          />
          <select
            name="package_tier"
            required
            defaultValue="website_ai_bundle"
            className="rounded-md border border-zinc-300 px-3 py-2"
          >
            {PACKAGE_TIERS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            name="owner_email"
            type="email"
            placeholder="Owner email (we'll invite them)"
            className="rounded-md border border-zinc-300 px-3 py-2"
          />
          <input
            name="vapi_assistant_id"
            placeholder="Vapi assistant id (optional)"
            className="rounded-md border border-zinc-300 px-3 py-2"
          />
          <input
            name="vercel_project_id"
            placeholder="Vercel project id (optional)"
            className="rounded-md border border-zinc-300 px-3 py-2"
          />
          <button
            type="submit"
            className="sm:col-span-2 rounded-md bg-[#13294B] px-4 py-2 font-semibold text-white"
          >
            Create client
          </button>
        </form>
      </section>
    </div>
  );
}
