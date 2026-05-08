import type { Metadata } from "next";
import LoginForm from "./LoginForm";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Sign in · TSD Client Portal",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-20 animate-fade-up">
      <div className="mb-8 flex items-center gap-2.5">
        <Logo size={26} />
        <span className="text-sm font-semibold tracking-tight text-[var(--text)]">
          TSD Client Portal
        </span>
      </div>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--text)]">
        Sign in
      </h1>
      <p className="mt-2 text-[var(--text-muted)]">
        We&apos;ll email you a link to sign in. No password needed.
      </p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </main>
  );
}
