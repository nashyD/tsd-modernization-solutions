"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { estimate, depositFromSelection } from "@/lib/sales/estimator";
import type { Showcase } from "@/lib/sales/load-showcase";
import ServicePicker from "./ServicePicker";
import { EstimatesCard, GuaranteeCard } from "./ShowcaseSections";
import DepositPanel from "./DepositPanel";

/**
 * Bridge between the service-picker product ids (estimator `PRODUCTS`) and the
 * value-estimate `service_key`s (`prospect_estimates`). Only the four core
 * services carry value rows; the marketing add-ons (reviews/outreach/seo) have
 * no estimate row, so selecting them simply adds no "what it's worth" line.
 */
const PICKER_TO_ESTIMATE_KEY: Record<string, string> = {
  website: "website",
  frontDesk: "front_desk",
  concierge: "concierge",
  booking: "booking_bridge",
};

/**
 * Client wrapper that owns the live service selection (team size + services)
 * for the pitch / showcase page. Renders the service picker, then the value
 * card filtered to the SAME selection (so "what each service is worth" tracks
 * the picker), then `children` (book a call, outline, assets), then the
 * optional deposit. Persists the selection (debounced) so the server can
 * recompute the deposit authoritatively at checkout.
 */
export default function PitchBody({
  prospectId,
  token,
  initialSize,
  initialServices,
  depositPct,
  estimates,
  children,
}: {
  prospectId?: string;
  token?: string;
  initialSize: string;
  initialServices: string[];
  depositPct: number;
  estimates: Showcase["estimates"];
  children?: ReactNode;
}) {
  const [sizeId, setSizeId] = useState(initialSize);
  const [serviceIds, setServiceIds] = useState<string[]>(initialServices);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstRender = useRef(true);

  const est = estimate(sizeId, serviceIds);
  const depositAmount = depositFromSelection(sizeId, serviceIds, depositPct);
  // Value lines follow the picker: only show worth for services in the deal.
  const selectedKeys = serviceIds
    .map((id) => PICKER_TO_ESTIMATE_KEY[id])
    .filter((k): k is string => Boolean(k));

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
      {/* Value before price: anchor what it's worth, then show the build cost. */}
      <EstimatesCard estimates={estimates} selectedServiceKeys={selectedKeys} />
      <ServicePicker
        sizeId={sizeId}
        serviceIds={serviceIds}
        estimate={est}
        onSizeChange={setSizeId}
        onToggleService={toggleService}
      />
      {children}
      <GuaranteeCard />
      <DepositPanel
        prospectId={prospectId}
        token={token}
        amount={depositAmount}
        hasSelection={serviceIds.length > 0}
      />
    </>
  );
}
