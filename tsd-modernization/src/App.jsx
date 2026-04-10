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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; background: ${C.bg}; color: ${C.text}; transition: background 0.3s ease, color 0.3s ease; }
        ::placeholder { color: var(--c-placeholder); }
        @keyframes orbFloat1 { 0%,100% { transform: translate(0,0); } 33% { transform: translate(-30px,20px); } 66% { transform: translate(20px,-15px); } }
        @keyframes orbFloat2 { 0%,100% { transform: translate(0,0); } 33% { transform: translate(25px,-20px); } 66% { transform: translate(-15px,25px); } }
        @keyframes orbFloat3 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-20px,-20px); } }
        @keyframes cardFloat1 { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-12px) rotate(1deg); } }
        @keyframes cardFloat2 { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-10px) rotate(-1deg); } }
        @keyframes cardFloat3 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes scrollBounce { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(6px); } }
        @keyframes scrollDot { 0% { top: 8px; opacity: 1; } 100% { top: 22px; opacity: 0; } }
        @keyframes ripple { to { transform: scale(4); opacity: 0; } }
        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes tsdFloatPulse {
          0%, 100% { transform: translate(-50%, 0) scale(1); opacity: 0.92; }
          50% { transform: translate(-50%, 0) scale(1.08); opacity: 1; }
        }
        @keyframes menuPulse {
          0%, 100% { box-shadow: 0 8px 24px rgba(var(--c-accent-rgb),0.45), 0 0 0 0 rgba(var(--c-accent-rgb),0.55), 0 0 0 1px rgba(255,255,255,0.08); }
          50% { box-shadow: 0 8px 24px rgba(var(--c-accent-rgb),0.6), 0 0 0 10px rgba(var(--c-accent-rgb),0), 0 0 0 1px rgba(255,255,255,0.08); }
        }
        @keyframes modalFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalScaleIn {
          from { opacity: 0; transform: scale(0.94) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          section { padding-left: 20px !important; padding-right: 20px !important; }
          nav { padding: 16px 20px !important; }
          .hero-floating-cards { display: none !important; }
          .floating-logo { width: 180px !important; top: 16px !important; }
          .menu-button-wrap { top: 18px !important; right: 18px !important; }
          .process-connector { display: none !important; }
        }
      `}</style>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/why-us" element={<WhyUs />} />
            <Route path="/process" element={<Process />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/team" element={<Team />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
