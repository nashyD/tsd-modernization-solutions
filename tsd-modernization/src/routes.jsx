import { lazy } from "react";
import Layout from "./Layout";
import Home from "./pages/Home";
import RootError from "./components/RootError";
import { RELATIONSHIPS } from "./relationships-data";
import { SERVICES } from "./services-data";
import { POSTS } from "./news-data.js";

/* Route components are code-split: each lazy() becomes its own chunk, so a
   visitor downloads only the page they land on instead of the whole site.
   Layout (the shell), Home (the index + "*" fallback + LCP page), and RootError
   (the error boundary) stay eager. vite-react-ssg still prerenders every lazy
   route at build time; the <Outlet> is wrapped in <Suspense> in Layout.jsx so
   client-side navigation to a not-yet-loaded chunk has a fallback. */
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const WhyUs = lazy(() => import("./pages/WhyUs"));
const Process = lazy(() => import("./pages/Process"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Savings = lazy(() => import("./pages/Savings"));
const Sheet = lazy(() => import("./pages/Sheet"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const Team = lazy(() => import("./pages/Team"));
const Contact = lazy(() => import("./pages/Contact"));
const RelationshipPage = lazy(() => import("./pages/RelationshipPage"));
const Book = lazy(() => import("./pages/Book"));
const Demo = lazy(() => import("./pages/Demo"));
const News = lazy(() => import("./pages/News"));
const NewsDetail = lazy(() => import("./pages/NewsDetail"));

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
const NEWS_PATHS = POSTS.map((p) => `news/${p.slug}`);

export const routes = [
  {
    path: "/",
    element: <Layout />,
    entry: "src/Layout.jsx",
    errorElement: <RootError />,
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
      { path: "news", Component: News },
      {
        path: "news/:slug",
        Component: NewsDetail,
        getStaticPaths: () => NEWS_PATHS,
      },
      { path: "team", Component: Team },
      { path: "book", Component: Book },
      { path: "demo", Component: Demo },
      { path: "contact", Component: Contact },
      { path: "*", Component: Home },
    ],
  },
];
