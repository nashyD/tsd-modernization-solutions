import type { Metadata } from "next";
import AuditForm from "./AuditForm";

export const metadata: Metadata = {
  title: "Free online presence audit · TSD Modernization Solutions",
  description:
    "Get a no-cost audit of your business's website, Google profile, and online presence. We'll find the gaps and tell you what they're costing you.",
};

export default function AuditPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-16 sm:py-24">
      <header className="mb-10">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-[#4B9CD3]">
          TSD Modernization Solutions
        </p>
        <h1 className="text-balance text-3xl font-semibold leading-[1.15] tracking-tight text-[#13294B] sm:text-4xl">
          Free online presence audit
        </h1>
        <p className="mt-4 text-pretty text-base leading-relaxed text-zinc-700 sm:text-lg">
          Tell us your business and we&apos;ll grade the five things that decide
          whether a customer hires you or your competitor: your website, Google
          profile, reviews, trust signals, and conversion paths. You&apos;ll
          have a written report in your inbox within a few minutes.
        </p>
      </header>
      <AuditForm />
      <p className="mt-8 text-sm text-zinc-500">
        We&apos;ll use the phone number to reach out only if you ask us to.
      </p>
    </main>
  );
}
