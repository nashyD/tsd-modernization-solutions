"use client";
import { useTransition } from "react";
import { deleteClient } from "./actions";

export default function DeleteClientButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (
          !confirm(
            `Delete "${name}"?\n\nThis removes the client, all their work items, and any portal user memberships. Past audits remain in storage but will no longer appear in the portal.`
          )
        )
          return;
        const fd = new FormData();
        fd.set("id", id);
        startTransition(async () => {
          await deleteClient(fd);
        });
      }}
      className="text-sm font-medium text-red-700 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
