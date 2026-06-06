import type { Metadata } from "next";
import LoginForm from "./LoginForm";
import PasskeySignInButton from "./PasskeySignInButton";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Sign in · TSD Client Portal",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-20 animate-fade-up">
      <div className="mb-8 flex items-center gap-2.5">
        <Logo height={26} />
        <span className="text-sm font-semibold tracking-tight text-[var(--text)]">
          TSD Client Portal
        </span>
      </div>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--text)]">
        Sign in
      </h1>
      <p className="mt-2 text-[var(--text-muted)]">
        Use a saved passkey for instant sign-in, or we&apos;ll email you a link.
        No password needed.
      </p>
      {error && error !== "missing_code" && (
        <p className="mt-4 rounded-[10px] border border-[var(--danger)]/30 bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]">
          Sign-in link didn&apos;t go through: {error}. Request a fresh link
          below.
        </p>
      )}
      <div className="mt-8 space-y-5">
        <PasskeySignInButton />
        <LoginForm />
      </div>
    </main>
  );
}
