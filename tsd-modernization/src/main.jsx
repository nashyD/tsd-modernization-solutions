import { ViteReactSSG } from "vite-react-ssg";
import { routes } from "./routes.jsx";
import { initAnalytics } from "./analytics.js";

export const createRoot = ViteReactSSG(
  { routes },
  ({ isClient }) => {
    if (isClient) initAnalytics();
  },
);
