import { PageHeader } from "@/components/ui/PageHeader";
import { Input, Label, Textarea, Select } from "@/components/ui/Input";
import { SubmitButton } from "@/components/ui/SubmitButton";
import BackLink from "@/components/BackLink";
import { PACKAGE_TIERS } from "@/lib/packages";
import { createProspect } from "../actions";

export default function NewProspectPage() {
  return (
    <div className="space-y-6">
      <BackLink href="/sales" label="All prospects" />
      <PageHeader eyebrow="Sales" title="New prospect" />
      <form action={createProspect} className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="business_name">Business name</Label>
          <Input id="business_name" name="business_name" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="business_url">Business URL</Label>
          <Input id="business_url" name="business_url" required placeholder="acme.com" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="contact_name" hint="(optional)">Contact name</Label>
          <Input id="contact_name" name="contact_name" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="email" hint="(optional)">Email</Label>
          <Input id="email" name="email" type="email" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="phone" hint="(optional)">Phone</Label>
          <Input id="phone" name="phone" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="demo_site_url" hint="(optional)">Demo site URL</Label>
          <Input id="demo_site_url" name="demo_site_url" placeholder="https://demo.…" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="vapi_assistant_id" hint="(optional)">Vapi assistant ID</Label>
          <Input id="vapi_assistant_id" name="vapi_assistant_id" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="package_tier" hint="(optional)">Package tier</Label>
          <Select id="package_tier" name="package_tier" defaultValue="" className="mt-1.5">
            <option value="">—</option>
            {PACKAGE_TIERS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="deposit_pct" hint="(% of the low estimate for the optional deposit; default 10)">
            Deposit %
          </Label>
          <Input id="deposit_pct" name="deposit_pct" type="number" min="0" max="100" step="1" defaultValue="10" className="mt-1.5" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="outline_md" hint="(optional)">Project outline</Label>
          <Textarea id="outline_md" name="outline_md" rows={5} className="mt-1.5" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="notes" hint="(internal)">Notes</Label>
          <Textarea id="notes" name="notes" rows={2} className="mt-1.5" />
        </div>
        <div className="sm:col-span-2">
          <SubmitButton pendingText="Creating…">Create prospect</SubmitButton>
        </div>
      </form>
    </div>
  );
}
