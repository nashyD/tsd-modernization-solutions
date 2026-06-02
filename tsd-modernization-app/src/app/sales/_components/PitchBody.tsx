"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { estimate, depositFromSelection } from "@/lib/sales/estimator";
import ServicePicker from "./ServicePicker";
import DepositPanel from "./DepositPanel";

/**
 * Client wrapper that owns the live service selection (team size + services)
 * for the pitch / showcase page. Renders the service picker at the top and the
 * optional deposit panel at the bottom, with `children` (value estimates, book
 * a call, etc.) slotted between. Persists the selection (debounced) so the
 * server can recompute the deposit authoritatively at checkout.
 */
export default function PitchBody({
  prospectId,
  token,
  initialSize,
  initialServices,
  depositPct,
  children,
}: {
  prospectId?: string;
  token?: string;
  initialSize: string;
  initialServices: string[];
  depositPct: number;
  children?: ReactNode;
}) {
  const [sizeId, setSizeId] = useState(initialSize);
  const [serviceIds, setServiceIds] = useState<string[]>(initialServices);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstRender = useRef(true);

  const est = estimate(sizeId, serviceIds);
  const depositAmount = depositFromSelection(sizeId, serviceIds, depositPct);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void fetch("/api/sales/selection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prospect_id: prospectId,
          token,
          team_size: sizeId,
          selected_services: serviceIds,
        }),
      }).catch(() => {});
    }, 600);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [sizeId, serviceIds, prospectId, token]);

  function toggleService(id: string) {
    setServiceIds((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
    );
  }

  return (
    <>
      <ServicePicker
        sizeId={sizeId}
        serviceIds={serviceIds}
        estimate={est}
        onSizeChange={setSizeId}
        onToggleService={toggleService}
      />
      {children}
      <DepositPanel
        prospectId={prospectId}
        token={token}
        amount={depositAmount}
        hasSelection={serviceIds.length > 0}
      />
    </>
  );
}
