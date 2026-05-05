export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-16 sm:py-24">
      <div className="h-4 w-32 animate-pulse rounded bg-zinc-200" />
      <div className="mt-3 h-10 w-3/4 animate-pulse rounded bg-zinc-200" />
      <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-zinc-200" />
      <div className="mt-10 h-2 w-full animate-pulse rounded-full bg-zinc-200" />
    </main>
  );
}
