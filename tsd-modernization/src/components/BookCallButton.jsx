import { RippleButton } from "../shared";

/* "Book a fit call" CTA — opens the Calendly popup widget for the
   30-minute fit-call event. Calendly's widget script + CSS load once
   globally in index.html, so window.Calendly is available by the time
   any of these buttons can be clicked.

   Sibling of the existing primary "Apply for a founding slot" / "Reserve
   a setup spot" CTAs across conversion pages — those keep the async
   ?ref= track via /contact and the Web3Forms inbox; this one is the
   synchronous "ready to talk now" path.

   Pass refSource to attribute the booking back to the page it came from
   (mirrors the ?ref= pattern on /contact). It rides as utm_source on
   the Calendly URL and shows up in the booking notification email, the
   Calendly admin attribution column, and the webhook payload.

   Today the URL is Nash's individual Calendly event
   (`nashdavis-tsd-ventures/30min`); when Bishop + Grant join a Calendly
   Teams workspace the URL constant swaps to a team round-robin event
   (`calendly.com/d/<team-id>/30min` shape) — no other code change. */

const CALENDLY_URL = "https://calendly.com/nashdavis-tsd-ventures/30min";

function buildUrl(refSource) {
  const params = new URLSearchParams({
    primary_color: "4B9CD3",
    hide_gdpr_banner: "1",
  });
  if (refSource) params.set("utm_source", refSource);
  return `${CALENDLY_URL}?${params.toString()}`;
}

export default function BookCallButton({
  variant = "secondary",
  refSource,
  children = "Book a fit call",
  ...rest
}) {
  const handleClick = (e) => {
    rest.onClick?.(e);
    const url = buildUrl(refSource);
    if (typeof window !== "undefined" && window.Calendly) {
      window.Calendly.initPopupWidget({ url });
    } else {
      // Fallback: if the widget script hasn't loaded (slow network,
      // ad blocker, etc.), navigate to the Calendly page directly so
      // the booking flow still works rather than dead-ending the click.
      if (typeof window !== "undefined") window.location.href = url;
    }
  };

  return (
    <RippleButton variant={variant} {...rest} onClick={handleClick}>
      {children}
    </RippleButton>
  );
}
