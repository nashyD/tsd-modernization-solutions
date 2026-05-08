"use client";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function PrintButton() {
  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => window.print()}
      leftIcon={<Download size={14} strokeWidth={2} />}
    >
      Download as PDF
    </Button>
  );
}
