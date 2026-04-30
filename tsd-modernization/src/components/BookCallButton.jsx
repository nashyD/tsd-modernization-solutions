import { RippleButton } from "../shared";

/* "Book a fit call" CTA — opens the Cal.com booking modal for the
   30-minute round-robin team event (Nash / Bishop / Grant). The Cal API
   is initialized once globally in Layout.jsx; this button just carries
   the data attributes the Cal script picks up at click time.

   Sibling of the existing "Apply for a founding slot" / "Reserve a setup
   spot" primary CTAs across conversion pages — those keep the async
   ?ref= track via /contact and the Web3Forms inbox; this one is the
   synchronous "ready to talk now" path.

   Pass refSource to attribute the booking back to the page it came from
   (mirrors the ?ref= pattern on /contact). It rides as a query param on
   the Cal link and shows up in Cal's confirmation email + webhook so
   founders know which surface drove the booking. */

const CAL_NAMESPACE = "fit-call";
const CAL_LINK_BASE = "tsd-ventures/fit-call";
const CAL_CONFIG = JSON.stringify({ layout: "month_view" });

export default function BookCallButton({
  variant = "secondary",
  refSource,
  children = "Book a fit call",
  ...rest
}) {
  const link = refSource
    ? `${CAL_LINK_BASE}?ref=${encodeURIComponent(refSource)}`
    : CAL_LINK_BASE;
  return (
    <RippleButton
      variant={variant}
      data-cal-namespace={CAL_NAMESPACE}
      data-cal-link={link}
      data-cal-config={CAL_CONFIG}
      {...rest}
    >
      {children}
    </RippleButton>
  );
}
