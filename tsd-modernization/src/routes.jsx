import Layout from "./Layout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import WhyUs from "./pages/WhyUs";
import Process from "./pages/Process";
import Pricing from "./pages/Pricing";
import Testimonials from "./pages/Testimonials";
import Team from "./pages/Team";
import Contact from "./pages/Contact";
import AIReceptionist from "./pages/AIReceptionist";
import TradePage from "./pages/TradePage";
import { TRADES } from "./trades-data";
import RelationshipPage from "./pages/RelationshipPage";
import { RELATIONSHIPS } from "./relationships-data";
import MissedCallCalculator from "./pages/MissedCallCalculator";
import Book from "./pages/Book";

/* Trade-specific landing pages — flat URLs (/hvac, /electricians, /plumbers)
   so ad copy and word-of-mouth stay short. Each is the destination URL for
   its own ad set + cold-outreach template per the v2 trades-wedge checklist.
   Wrapper components let routes.jsx pass the per-trade data into the shared
   TradePage template without inline lambdas (which can confuse vite-react-ssg
   prerender). */
function HvacPage() { return <TradePage trade={TRADES.hvac} />; }
function ElectriciansPage() { return <TradePage trade={TRADES.electricians} />; }
function PlumbersPage() { return <TradePage trade={TRADES.plumbers} />; }

/* Relationship-channel landing pages — vertical-specific bundle pages for
   warm leads who arrived via founder DM (per the v2 two-motion model).
   Same wrapper-function pattern as the trade pages above. */
function SalonsPage() { return <RelationshipPage rel={RELATIONSHIPS.salons} />; }
function AutoShopsPage() { return <RelationshipPage rel={RELATIONSHIPS["auto-shops"]} />; }
function RestaurantsPage() { return <RelationshipPage rel={RELATIONSHIPS.restaurants} />; }

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
        getStaticPaths: () => [
          "services/ai-integration",
          "services/websites",
          "services/process-modernization",
        ],
      },
      { path: "why-us", Component: WhyUs },
      { path: "process", Component: Process },
      { path: "pricing", Component: Pricing },
      { path: "ai-receptionist", Component: AIReceptionist },
      { path: "hvac", Component: HvacPage },
      { path: "electricians", Component: ElectriciansPage },
      { path: "plumbers", Component: PlumbersPage },
      { path: "salons", Component: SalonsPage },
      { path: "auto-shops", Component: AutoShopsPage },
      { path: "restaurants", Component: RestaurantsPage },
      { path: "missed-call-calculator", Component: MissedCallCalculator },
      { path: "testimonials", Component: Testimonials },
      { path: "team", Component: Team },
      { path: "book", Component: Book },
      { path: "contact", Component: Contact },
      { path: "*", Component: Home },
    ],
  },
];
