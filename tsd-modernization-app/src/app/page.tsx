import { redirect } from "next/navigation";

export default function Home() {
  // The marketing site at tsd-modernization.com is served from the existing Vite app.
  // This Next.js app is mounted on /audit/* and /app/* via Vercel rewrites.
  // Hitting the bare modernization-app.vercel.app URL bounces to the audit form.
  redirect("/audit");
}
