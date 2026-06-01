import "server-only";
import { env } from "@/lib/env";

const BASE: Record<"sandbox" | "production", string> = {
  sandbox: "https://connect.squareupsandbox.com",
  production: "https://connect.squareup.com",
};
const SQUARE_VERSION = "2025-01-23"; // pin; bump deliberately when upgrading.

export function squareConfigured(): boolean {
  const e = env();
  return Boolean(e.SQUARE_ACCESS_TOKEN && e.SQUARE_LOCATION_ID);
}

export interface CreatePaymentLinkArgs {
  name: string; // shown on Square checkout, e.g. "Deposit — Bisque Imports"
  amountCents: number;
  idempotencyKey: string; // our prospect_deposits.id
  redirectUrl: string; // where Square returns the buyer after paying
  referenceId: string; // our prospect_deposits.id, echoed back on the order
}

export interface PaymentLink {
  id: string;
  url: string;
  orderId: string | null;
}

export async function createPaymentLink(
  args: CreatePaymentLinkArgs,
): Promise<PaymentLink> {
  const e = env();
  if (!squareConfigured()) throw new Error("Square not configured");
  const res = await fetch(
    `${BASE[e.SQUARE_ENV]}/v2/online-checkout/payment-links`,
    {
      method: "POST",
      headers: {
        "Square-Version": SQUARE_VERSION,
        Authorization: `Bearer ${e.SQUARE_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idempotency_key: args.idempotencyKey,
        quick_pay: {
          name: args.name,
          price_money: { amount: args.amountCents, currency: "USD" },
          location_id: e.SQUARE_LOCATION_ID,
        },
        checkout_options: { redirect_url: args.redirectUrl },
        payment_note: args.referenceId,
      }),
    },
  );
  const json = (await res.json()) as {
    payment_link?: { id: string; url: string; order_id?: string };
    errors?: { detail?: string }[];
  };
  if (!res.ok || !json.payment_link) {
    throw new Error(json.errors?.[0]?.detail ?? `Square error ${res.status}`);
  }
  return {
    id: json.payment_link.id,
    url: json.payment_link.url,
    orderId: json.payment_link.order_id ?? null,
  };
}

/** Fetch an order to confirm it's actually paid before we convert (defense in depth). */
export async function getOrderState(orderId: string): Promise<string | null> {
  const e = env();
  if (!squareConfigured()) return null;
  const res = await fetch(`${BASE[e.SQUARE_ENV]}/v2/orders/${orderId}`, {
    headers: {
      "Square-Version": SQUARE_VERSION,
      Authorization: `Bearer ${e.SQUARE_ACCESS_TOKEN}`,
    },
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { order?: { state?: string } };
  return json.order?.state ?? null;
}
