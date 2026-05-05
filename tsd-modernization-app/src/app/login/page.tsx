import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in · TSD Client Portal",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-24">
      <h1 className="text-2xl font-semibold tracking-tight text-[#13294B]">
        Sign in
      </h1>
      <p className="mt-2 text-zinc-700">
        We&apos;ll email you a link to sign in. No password needed.
      </p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </main>
  );
}
