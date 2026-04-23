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
      { path: "testimonials", Component: Testimonials },
      { path: "team", Component: Team },
      { path: "contact", Component: Contact },
      { path: "*", Component: Home },
    ],
  },
];
