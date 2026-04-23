/* ── Analytics loader ──────────────────────────────────────────────
   Loads GA4, Plausible, and/or Microsoft Clarity based on env vars.
   Each service is independent — set only the ones you use.

   Env vars (prefix VITE_ so Vite exposes them to the client):
     VITE_GA4_ID           e.g. "G-XXXXXXXXXX"
     VITE_PLAUSIBLE_ID     e.g. "pa-R3jO3KFcDkvH79c2b6_2J"
     VITE_CLARITY_ID       e.g. "p4h1x2y3z4"

   In dev without env vars nothing loads, so network/DOM stay clean.
*/

const GA4_ID = import.meta.env.VITE_GA4_ID;
const PLAUSIBLE_ID = import.meta.env.VITE_PLAUSIBLE_ID;
const CLARITY_ID = import.meta.env.VITE_CLARITY_ID;

function appendScript({ src, attrs = {}, inline }) {
  const s = document.createElement("script");
  if (src) s.src = src;
  if (inline) s.text = inline;
  Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v === true ? "" : v));
  document.head.appendChild(s);
  return s;
}

/* GA4 — we disable the auto pageview and fire one manually on each
   route change from Layout.jsx, so SPA navigations get counted. */
function initGA4() {
  if (!GA4_ID) return;
  appendScript({
    src: `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`,
    attrs: { async: true },
  });
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", GA4_ID, { send_page_view: false });
}

/* Plausible — uses the site-specific script token (pa-xxxxx). Auto-
   tracks History API changes, so React Router navigations are captured
   without any manual pageview calls. The shim queues `plausible()`
   calls made before the async script finishes loading so none are
   lost. */
function initPlausible() {
  if (!PLAUSIBLE_ID) return;
  appendScript({
    src: `https://plausible.io/js/${PLAUSIBLE_ID}.js`,
    attrs: { async: true },
  });
  window.plausible = window.plausible || function () {
    (window.plausible.q = window.plausible.q || []).push(arguments);
  };
  window.plausible.init = window.plausible.init || function (i) {
    window.plausible.o = i || {};
  };
  window.plausible.init();
}

/* Microsoft Clarity — vendor snippet, auto-tracks SPA routes. */
function initClarity() {
  if (!CLARITY_ID) return;
  appendScript({
    inline: `
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", ${JSON.stringify(CLARITY_ID)});
    `,
  });
}

export function initAnalytics() {
  initGA4();
  initPlausible();
  initClarity();
}

/* Fire a pageview for GA4 on SPA route change. Plausible + Clarity
   hook the History API themselves and don't need this.

   `title` is passed explicitly because react-helmet-async's DOM update
   for document.title doesn't race-condition-safely with the useEffect
   that calls this. Passing the value straight through avoids the race. */
export function trackPageView(path, title) {
  if (typeof window === "undefined") return;
  if (GA4_ID && window.gtag) {
    window.gtag("event", "page_view", {
      page_path: path,
      page_location: window.location.origin + path,
      page_title: title || document.title,
    });
  }
}
