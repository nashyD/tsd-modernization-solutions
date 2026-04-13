import { BrowserRouter, Routes, Route } from "react-router-dom";
import { C } from "./shared";
import Layout from "./Layout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import WhyUs from "./pages/WhyUs";
import Process from "./pages/Process";
import Pricing from "./pages/Pricing";
import Testimonials from "./pages/Testimonials";
import Team from "./pages/Team";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <>
      <style>{`
        @keyframes ripple { to { transform: scale(4); opacity: 0; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float1 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes float2 { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-10px) rotate(1deg); } }
        @keyframes scrollBounce { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(6px); } }
        @keyframes scrollDot { 0% { top: 8px; opacity: 1; } 100% { top: 22px; opacity: 0; } }
        @keyframes orbFloat { 0%,100% { transform: translate(0,0); } 33% { transform: translate(-25px,15px); } 66% { transform: translate(15px,-10px); } }
        @keyframes spin { to { transform: rotate(360deg); } }

        :root, [data-theme="dark"] {
          --font-display: 'Playfair Display', Georgia, serif;
          --font-body: 'Inter', system-ui, -apple-system, sans-serif;
          --c-bg: #0c1524;
          --c-bg-alt: #101c2e;
          --c-surface: rgba(255,255,255,0.04);
          --c-surface-border: rgba(255,255,255,0.08);
          --c-surface-hover: rgba(255,255,255,0.07);
          --c-text: #e8e0d4;
          --c-text-muted: rgba(232,224,212,0.6);
          --c-text-dim: rgba(232,224,212,0.35);
          --c-accent: ${C.carolina};
          --c-accent-light: ${C.carolinaLight};
          --c-divider: rgba(75,156,211,0.15);
          --c-glow: rgba(75,156,211,0.15);
          --c-nav-bg: rgba(12,21,36,0.88);
          --c-card-front: #0c1524;
          --c-card-text: #e8e0d4;
          --c-card-text-muted: rgba(232,224,212,0.7);
          --c-card-accent: ${C.carolinaLight};
          --c-card-divider: rgba(123,184,224,0.3);
        }

        [data-theme="light"] {
          --c-bg: #f0ebe1;
          --c-bg-alt: #e8e0d4;
          --c-surface: rgba(19,41,75,0.04);
          --c-surface-border: rgba(19,41,75,0.1);
          --c-surface-hover: rgba(19,41,75,0.07);
          --c-text: #13294B;
          --c-text-muted: rgba(19,41,75,0.6);
          --c-text-dim: rgba(19,41,75,0.35);
          --c-accent: ${C.carolina};
          --c-accent-light: ${C.carolinaDark};
          --c-divider: rgba(19,41,75,0.12);
          --c-glow: rgba(75,156,211,0.12);
          --c-nav-bg: rgba(240,235,225,0.92);
          --c-card-front: #f0ebe1;
          --c-card-text: #13294B;
          --c-card-text-muted: rgba(19,41,75,0.7);
          --c-card-accent: ${C.steel};
          --c-card-divider: rgba(44,95,138,0.25);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          font-family: var(--font-body);
          background: var(--c-bg);
          color: var(--c-text);
          overflow-x: hidden;
          transition: background 0.4s ease, color 0.4s ease;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        ::placeholder { color: var(--c-text-dim); }
        a { color: inherit; text-decoration: none; }
        img { max-width: 100%; display: block; }

        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="services" element={<Services />} />
            <Route path="why-us" element={<WhyUs />} />
            <Route path="process" element={<Process />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="testimonials" element={<Testimonials />} />
            <Route path="team" element={<Team />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
