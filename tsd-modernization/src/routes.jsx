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
import RelationshipPage from "./pages/RelationshipPage";
import { RELATIONSHIPS } from "./relationships-data";
import Book from "./pages/Book";

/* Relationship-channel landing pages — vertical-specific pages for warm
   leads who arrived via founder DM or word-of-mouth. Wrapper functions let
   routes.jsx pass per-vertical data into the shared RelationshipPage template
   without inline lambdas (which can confuse vite-react-ssg prerender). */
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
      { path: "salons", Component: SalonsPage },
      { path: "auto-shops", Component: AutoShopsPage },
      { path: "restaurants", Component: RestaurantsPage },
      { path: "testimonials", Component: Testimonials },
      { path: "team", Component: Team },
      { path: "book", Component: Book },
      { path: "contact", Component: Contact },
      { path: "*", Component: Home },
    ],
  },
];
