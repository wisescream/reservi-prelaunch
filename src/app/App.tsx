import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Toaster } from "sonner";
import { Page } from "./components/shared";
import React, { Suspense } from "react";

const HomePage = React.lazy(() => import("./components/HomePage").then(module => ({ default: module.HomePage })));

const FeaturesPage = React.lazy(() => import("./components/FeaturesPage").then(module => ({ default: module.FeaturesPage })));
const RestaurantsPage = React.lazy(() => import("./components/RestaurantsPage").then(module => ({ default: module.RestaurantsPage })));
const AboutPage = React.lazy(() => import("./components/AboutPage").then(module => ({ default: module.AboutPage })));
const ContactPage = React.lazy(() => import("./components/ContactPage").then(module => ({ default: module.ContactPage })));
const WaitlistPage = React.lazy(() => import("./components/WaitlistPage").then(module => ({ default: module.WaitlistPage })));
const PartnerPage = React.lazy(() => import("./components/partner-page").then(module => ({ default: module.PartnerPage })));
const NotFoundPage = React.lazy(() => import("./components/NotFound").then(module => ({ default: module.NotFoundPage })));
import { KnifeForkCursor } from "./components/cursor";
import { ScrollDepthTracker } from "../components/ScrollDepthTracker";

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (p: Page) => {
    if (p === "home") {
      navigate("/");
    } else {
      navigate(`/${p}`);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen w-full bg-white" style={{ fontFamily: "Inter, 'Plus Jakarta Sans', sans-serif" }}>
      <KnifeForkCursor />
      <ScrollDepthTracker />
      <Toaster position="top-right" richColors />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white text-[#E8450A] font-bold text-2xl tracking-wide animate-pulse">Reservi</div>}>
            <Routes location={location}>
              <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />
              <Route path="/home" element={<HomePage onNavigate={handleNavigate} />} />
              <Route path="/features" element={<FeaturesPage onNavigate={handleNavigate} />} />
              <Route path="/restaurants" element={<RestaurantsPage onNavigate={handleNavigate} />} />
              <Route path="/about" element={<AboutPage onNavigate={handleNavigate} />} />
              <Route path="/contact" element={<ContactPage onNavigate={handleNavigate} />} />
              <Route path="/waitlist" element={<WaitlistPage onNavigate={handleNavigate} />} />
              <Route path="/partner" element={<PartnerPage onNavigate={handleNavigate} />} />
              <Route path="*" element={<NotFoundPage onNavigate={handleNavigate} />} />
            </Routes>
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
