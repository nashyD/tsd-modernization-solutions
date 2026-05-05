import { requireUser, getMemberships } from "@/lib/auth/require";
import { packageByTier } from "@/lib/packages";

export const dynamic = "force-dynamic";

export default async function PackagePage() {
  const { user } = await requireUser();
  const memberships = await getMemberships(user.id);
  const ownership = memberships.find((m) => m.role !== "admin");
  const client = ownership?.clients as
    | { id: string; name: string; package_tier: string }
    | null;
  const pkg = client ? packageByTier(client.package_tier) : null;

  if (!pkg) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-8">
        <h1 className="text-xl font-semibold text-[#13294B]">Your package</h1>
        <p className="mt-2 text-zinc-700">
          We haven&apos;t assigned you a package yet. The TSD team will reach
          out shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.18em] text-[#4B9CD3]">
          Your package
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#13294B]">
          {pkg.name}
        </h1>
        <p className="mt-2 text-pretty text-zinc-700">{pkg.tagline}</p>
        <p className="mt-3 text-2xl font-bold text-[#13294B]">{pkg.price}</p>
      </header>

      <div className="rounded-lg border border-zinc-200 bg-white p-6">
        <h2 className="font-semibold text-[#13294B]">What&apos;s included</h2>
        <ul className="mt-3 space-y-2 text-zinc-800">
          {pkg.included.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#4B9CD3]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        {pkg.cap && (
          <p className="mt-4 text-sm text-zinc-500">{pkg.cap}</p>
        )}
      </div>
    </div>
  );
}
