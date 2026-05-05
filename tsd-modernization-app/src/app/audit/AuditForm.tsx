"use client";
import { useActionState } from "react";
import { startAudit, type AuditFormState } from "./actions";

const fieldClass =
  "w-full rounded-md border border-zinc-300 bg-white px-3.5 py-2.5 text-base text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400 focus:border-[#4B9CD3] focus:ring-2 focus:ring-[#4B9CD3]/30";
const labelClass = "block text-sm font-medium text-zinc-800";
const errorClass = "mt-1.5 text-sm text-red-600";

export default function AuditForm() {
  const [state, action, pending] = useActionState<
    AuditFormState | undefined,
    FormData
  >(startAudit, undefined);

  return (
    <form action={action} className="space-y-5" noValidate>
      <div>
        <label htmlFor="business_name" className={labelClass}>
          Business name
        </label>
        <input
          id="business_name"
          name="business_name"
          required
          autoComplete="organization"
          placeholder="Acme HVAC"
          className={`${fieldClass} mt-1.5`}
        />
        {state?.errors?.business_name && (
          <p className={errorClass}>{state.errors.business_name[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="business_url" className={labelClass}>
          Website URL
        </label>
        <input
          id="business_url"
          name="business_url"
          required
          autoComplete="url"
          placeholder="acmehvac.com"
          className={`${fieldClass} mt-1.5`}
          inputMode="url"
        />
        {state?.errors?.business_url && (
          <p className={errorClass}>{state.errors.business_url[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="city" className={labelClass}>
          City <span className="text-zinc-400 font-normal">(helps us find your Google listing)</span>
        </label>
        <input
          id="city"
          name="city"
          autoComplete="address-level2"
          placeholder="Charlotte, NC"
          className={`${fieldClass} mt-1.5`}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={labelClass}>
            Your email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@business.com"
            className={`${fieldClass} mt-1.5`}
          />
          {state?.errors?.email && (
            <p className={errorClass}>{state.errors.email[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Your phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="(704) 555-0184"
            className={`${fieldClass} mt-1.5`}
          />
          {state?.errors?.phone && (
            <p className={errorClass}>{state.errors.phone[0]}</p>
          )}
        </div>
      </div>

      {state?.message && (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-md bg-[#13294B] px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[#0f1f3a] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Starting your audit…" : "Run my audit"}
      </button>
    </form>
  );
}
