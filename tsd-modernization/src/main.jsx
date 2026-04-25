import { ViteReactSSG } from "vite-react-ssg";
import { routes } from "./routes.jsx";
import { initAnalytics } from "./analytics.js";
import { initSentry } from "./sentry.js";

export const createRoot = ViteReactSSG(
  { routes },
  ({ isClient }) => {
    if (isClient) {
      // Sentry first so it captures any errors in the analytics init that follows.
      initSentry();
      initAnalytics();
    }
  },
);
