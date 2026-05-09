"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * "Download PDF" button on the audit report. Pulls the audit id from the
 * route params, programmatically clicks an <a> against /api/audit/[id]/pdf
 * — the route returns Content-Disposition: attachment so the browser
 * downloads without navigating away from the report.
 *
 * The 2-page server-rendered PDF is the artifact prospects share or print.
 * Cmd+P from this page would just print the on-screen layout, which is
 * fine as a fallback but isn't what the button triggers.
 */
export default function PrintButton() {
  const params = useParams<{ id: string }>();
  const [busy, setBusy] = useState(false);

  return (
    <Button
      variant="secondary"
      size="sm"
      disabled={busy || !params?.id}
      onClick={() => {
        if (!params?.id) return;
        setBusy(true);
        const a = document.createElement("a");
        a.href = `/api/audit/${params.id}/pdf`;
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        a.remove();
        // The download starts headed-out — flip the button back after a
        // beat so a second click is possible if the user dismisses the
        // save dialog or wants another copy.
        setTimeout(() => setBusy(false), 1200);
      }}
      leftIcon={
        busy ? (
          <Loader2 size={14} strokeWidth={2} className="animate-spin" />
        ) : (
          <Download size={14} strokeWidth={2} />
        )
      }
    >
      {busy ? "Preparing PDF…" : "Download PDF"}
    </Button>
  );
}
