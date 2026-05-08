"use client";
import { useActionState } from "react";
import { Mail, ArrowRight, MailCheck } from "lucide-react";
import { sendMagicLink, type LoginState } from "./actions";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState | undefined, FormData>(
    sendMagicLink,
    undefined
  );

  if (state?.ok) {
    return (
      <div className="rounded-[12px] border border-[var(--success)]/30 bg-[var(--success-soft)] px-5 py-4 text-[var(--success)]">
        <div className="flex items-start gap-3">
          <MailCheck size={20} strokeWidth={1.75} className="mt-0.5 flex-none" aria-hidden />
          <div>
            <p className="font-semibold">Check your email</p>
            <p className="mt-0.5 text-sm">
              We sent a sign-in link. It&apos;s good for 15 minutes.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@business.com"
          className="mt-1.5"
        />
        {state?.error && (
          <p className="mt-1.5 text-sm text-[var(--danger)]">{state.error}</p>
        )}
      </div>
      <Button
        type="submit"
        size="lg"
        disabled={pending}
        leftIcon={!pending ? <Mail size={16} strokeWidth={2} /> : undefined}
        rightIcon={!pending ? <ArrowRight size={16} strokeWidth={2.25} /> : undefined}
        className="w-full"
      >
        {pending ? "Sending…" : "Send sign-in link"}
      </Button>
    </form>
  );
}
