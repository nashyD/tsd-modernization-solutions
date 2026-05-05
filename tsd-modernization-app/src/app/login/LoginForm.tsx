"use client";
import { useActionState } from "react";
import { sendMagicLink, type LoginState } from "./actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState | undefined, FormData>(
    sendMagicLink,
    undefined
  );

  if (state?.ok) {
    return (
      <div className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-3 text-emerald-900">
        Check your email for a sign-in link. It&apos;s good for 15 minutes.
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <label htmlFor="email" className="block text-sm font-medium text-zinc-800">
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@business.com"
        className="w-full rounded-md border border-zinc-300 bg-white px-3.5 py-2.5 text-base text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400 focus:border-[#4B9CD3] focus:ring-2 focus:ring-[#4B9CD3]/30"
      />
      {state?.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-md bg-[#13294B] px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[#0f1f3a] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send sign-in link"}
      </button>
    </form>
  );
}
