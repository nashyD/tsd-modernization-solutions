import { ViteReactSSG } from "vite-react-ssg";
import { routes } from "./routes.jsx";
import { initAnalytics } from "./analytics.js";
import { initSentry } from "./sentry.js";

export const createRoot = ViteReactSSG(
  { routes },
  ({ isClient }) => {
    if (isClient) {
      // We reached a successful client init, so chunks loaded fine — clear the
      // RootError stale-chunk reload guard so a future deploy can auto-recover again.
      try {
        sessionStorage.removeItem("tsd_chunk_reload");
      } catch {
        /* noop */
      }
      // Sentry first so it captures any errors in the analytics init that follows.
      initSentry();
      initAnalytics();
    }
  },
);
