import { requireRole } from "@/lib/auth/require";

export default async function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("admin");
  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
      {children}
    </div>
  );
}
