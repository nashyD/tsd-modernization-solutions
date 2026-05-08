import { LogOut } from "lucide-react";
import { signOut } from "@/app/auth/actions";

/**
 * Small icon-only sign-out button. Server-rendered form that posts to the
 * signOut Server Action — clears the Supabase session cookie, redirects to
 * /login. No client-side JS needed; works with progressive enhancement.
 */
export function SignOutButton({
  className = "",
  tone = "default",
}: {
  className?: string;
  tone?: "default" | "inverted";
}) {
  const base =
    "inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40";
  const styles =
    tone === "inverted"
      ? "text-white/60 hover:bg-white/10 hover:text-white"
      : "text-[var(--text-subtle)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]";

  return (
    <form action={signOut}>
      <button
        type="submit"
        aria-label="Sign out"
        title="Sign out"
        className={`${base} ${styles} ${className}`}
      >
        <LogOut size={16} strokeWidth={1.75} />
      </button>
    </form>
  );
}
