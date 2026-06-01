import { supabaseAdmin } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import BackLink from "@/components/BackLink";
import { upsertDiscountCode, deleteDiscountCode } from "../estimate-actions";

export const dynamic = "force-dynamic";

export default async function CodesPage() {
  const { data: codes } = await supabaseAdmin()
    .from("discount_codes")
    .select("*")
    .order("code");
  return (
    <div className="space-y-6">
      <BackLink href="/sales" label="All prospects" />
      <PageHeader
        eyebrow="Sales"
        title="Discount codes"
        description="Grant's silent lever. Codes are checked against each prospect's hidden floor server-side."
      />
      <ul className="divide-y divide-[var(--border)] rounded-[14px] border border-[var(--border)] bg-[var(--surface)]">
        {(codes ?? []).map((c) => (
          <li key={c.code} className="flex items-center justify-between gap-3 px-5 py-3">
            <span className="font-mono text-[var(--text)]">{c.code}</span>
            <span className="text-sm text-[var(--text-muted)]">
              {c.pct}% {c.active ? "" : "(inactive)"}
            </span>
            <form action={deleteDiscountCode}>
              <input type="hidden" name="code" value={c.code} />
              <button className="text-xs text-[var(--danger)] hover:underline">
                Delete
              </button>
            </form>
          </li>
        ))}
      </ul>
      <form
        action={upsertDiscountCode}
        className="flex flex-wrap items-end gap-3 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-5"
      >
        <div>
          <Label htmlFor="code">Code</Label>
          <Input id="code" name="code" required placeholder="g20" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="pct">Percent off</Label>
          <Input id="pct" name="pct" type="number" min="1" max="100" required className="mt-1.5 w-28" />
        </div>
        <Button type="submit">Save code</Button>
      </form>
    </div>
  );
}
