/** The four TSD services scored on a prospect's value estimates. */
export const SERVICE_KEYS = [
  "website",
  "front_desk",
  "concierge",
  "booking_bridge",
] as const;
export type ServiceKey = (typeof SERVICE_KEYS)[number];

export const SERVICE_LABEL: Record<ServiceKey, string> = {
  website: "Custom website",
  front_desk: "TSD Front Desk",
  concierge: "TSD Concierge",
  booking_bridge: "Booking Bridge",
};

export const SERVICE_BLURB: Record<ServiceKey, string> = {
  website: "A modern site that turns visitors into booked work.",
  front_desk: "AI receptionist that answers every call, day or night.",
  concierge: "On-site AI that answers product questions and captures leads.",
  booking_bridge: "Lets customers book and schedule without phone tag.",
};

export function usd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);
}
