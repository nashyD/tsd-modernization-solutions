import { redirect } from "next/navigation";

// Editing now lives on the prospect work page itself (/sales/[id]); this route
// is kept only so old links/bookmarks don't 404.
export default async function EditRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/sales/${id}`);
}
