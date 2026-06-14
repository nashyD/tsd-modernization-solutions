import Layout from "./Layout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import WhyUs from "./pages/WhyUs";
import Process from "./pages/Process";
import Pricing from "./pages/Pricing";
import Savings from "./pages/Savings";
import Sheet from "./pages/Sheet";
import Testimonials from "./pages/Testimonials";
import Team from "./pages/Team";
import Contact from "./pages/Contact";
import RelationshipPage from "./pages/RelationshipPage";
import { RELATIONSHIPS } from "./relationships-data";
import { SERVICES } from "./services-data";
import Book from "./pages/Book";
import Demo from "./pages/Demo";

/* Relationship-channel landing pages — vertical-specific pages for warm
   leads who arrived via founder DM or word-of-mouth. Wrapper functions let
   routes.jsx pass per-vertical data into the shared RelationshipPage template
   without inline lambdas (which can confuse vite-react-ssg prerender). */
function SalonsPage() { return <RelationshipPage rel={RELATIONSHIPS.salons} />; }
function AutoShopsPage() { return <RelationshipPage rel={RELATIONSHIPS["auto-shops"]} />; }
function RestaurantsPage() { return <RelationshipPage rel={RELATIONSHIPS.restaurants} />; }

/* Six named services + a printable savings sheet per service, both
   prerendered from the catalog so a new service in services-data.js
   automatically gets its routes. The old bucket slugs (ai-integration,
   process-modernization) and /ai-receptionist 301 in vercel.json. */
const SERVICE_PATHS = SERVICES.map((s) => `services/${s.slug}`);
const SHEET_PATHS = SERVICES.map((s) => `sheets/${s.slug}`);

export const routes = [
  {
    path: "/",
    element: <Layout />,
    entry: "src/Layout.jsx",
    children: [
      { index: true, Component: Home },
      { path: "services", Component: Services },
      {
        path: "services/:slug",
        Component: ServiceDetail,
        getStaticPaths: () => SERVICE_PATHS,
      },
      {
        path: "sheets/:slug",
        Component: Sheet,
        getStaticPaths: () => SHEET_PATHS,
      },
      { path: "why-us", Component: WhyUs },
      { path: "process", Component: Process },
      { path: "pricing", Component: Pricing },
      { path: "savings", Component: Savings },
      { path: "salons", Component: SalonsPage },
      { path: "auto-shops", Component: AutoShopsPage },
      { path: "restaurants", Component: RestaurantsPage },
      { path: "testimonials", Component: Testimonials },
      { path: "team", Component: Team },
      { path: "book", Component: Book },
      { path: "demo", Component: Demo },
      { path: "contact", Component: Contact },
      { path: "*", Component: Home },
    ],
  },
];
