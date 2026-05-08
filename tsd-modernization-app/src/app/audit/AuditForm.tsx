"use client";
import { useActionState } from "react";
import { ArrowRight } from "lucide-react";
import { startAudit, type AuditFormState } from "./actions";
import { Input, Label, FieldError } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function AuditForm() {
  const [state, action, pending] = useActionState<
    AuditFormState | undefined,
    FormData
  >(startAudit, undefined);

  return (
    <form action={action} className="space-y-5" noValidate>
      <div>
        <Label htmlFor="business_name">Business name</Label>
        <Input
          id="business_name"
          name="business_name"
          required
          autoComplete="organization"
          placeholder="Acme HVAC"
          className="mt-1.5"
        />
        <FieldError>{state?.errors?.business_name?.[0]}</FieldError>
      </div>

      <div>
        <Label htmlFor="business_url">Website URL</Label>
        <Input
          id="business_url"
          name="business_url"
          required
          autoComplete="url"
          placeholder="acmehvac.com"
          inputMode="url"
          className="mt-1.5"
        />
        <FieldError>{state?.errors?.business_url?.[0]}</FieldError>
      </div>

      <div>
        <Label htmlFor="city" hint="(helps us find your Google listing)">
          City
        </Label>
        <Input
          id="city"
          name="city"
          autoComplete="address-level2"
          placeholder="Charlotte, NC"
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="email">Your email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@business.com"
          className="mt-1.5"
        />
        <FieldError>{state?.errors?.email?.[0]}</FieldError>
      </div>

      <div>
        <Label htmlFor="phone">Your phone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          placeholder="(704) 555-0184"
          className="mt-1.5"
        />
        <FieldError>{state?.errors?.phone?.[0]}</FieldError>
      </div>

      {state?.message && (
        <p className="rounded-[10px] border border-[var(--warning)]/30 bg-[var(--warning-soft)] px-3 py-2 text-sm text-[var(--warning)]">
          {state.message}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        rightIcon={!pending ? <ArrowRight size={16} strokeWidth={2.25} /> : undefined}
        className="w-full"
      >
        {pending ? "Starting your audit…" : "Run my audit"}
      </Button>
    </form>
  );
}
