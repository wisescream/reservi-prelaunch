import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Toaster } from "sonner";
import { Page } from "./components/shared";
import React, { Suspense } from "react";

// Main Pages
const HomePage = React.lazy(() => import("./components/HomePage").then(module => ({ default: module.HomePage })));
const FeaturesPage = React.lazy(() => import("./components/FeaturesPage").then(module => ({ default: module.FeaturesPage })));
const RestaurantsPage = React.lazy(() => import("./components/RestaurantsPage").then(module => ({ default: module.RestaurantsPage })));
const AboutPage = React.lazy(() => import("./components/AboutPage").then(module => ({ default: module.AboutPage })));
const ContactPage = React.lazy(() => import("./components/ContactPage").then(module => ({ default: module.ContactPage })));
const WaitlistPage = React.lazy(() => import("./components/WaitlistPage").then(module => ({ default: module.WaitlistPage })));
const PartnerPage = React.lazy(() => import("./components/partner-page").then(module => ({ default: module.PartnerPage })));
const NotFoundPage = React.lazy(() => import("./components/NotFound").then(module => ({ default: module.NotFoundPage })));

// Admin Pages
const AdminLoginPage = React.lazy(() => import("./components/admin").then(module => ({ default: module.AdminLoginPage })));
const AdminDashboard = React.lazy(() => import("./components/admin").then(module => ({ default: module.AdminDashboard })));
const WaitlistManagement = React.lazy(() => import("./components/admin").then(module => ({ default: module.WaitlistManagement })));
const RestaurantLeads = React.lazy(() => import("./components/admin").then(module => ({ default: module.RestaurantLeads })));
const AnalyticsPage = React.lazy(() => import("./components/admin").then(module => ({ default: module.AnalyticsPage })));
const ContactMessages = React.lazy(() => import("./components/admin").then(module => ({ default: module.ContactMessages })));
const SettingsPage = React.lazy(() => import("./components/admin").then(module => ({ default: module.SettingsPage })));
const AdminLayout = React.lazy(() => import("./components/admin").then(module => ({ default: module.AdminLayout })));
const AdminRoute = React.lazy(() => import("./components/admin").then(module => ({ default: module.AdminRoute })));

import { KnifeForkCursor } from "./components/cursor";
import { ScrollDepthTracker } from "../components/ScrollDepthTracker";
import { LoadingScreen } from "./components/LoadingScreen";
import { TranslationProvider } from "../lib/translations";
import { AdminProvider } from "../lib/AdminContext";

import { useState, useEffect } from "react";

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = (p: Page) => {
    if (p === "home") {
      navigate("/");
    } else {
      navigate(`/${p}`);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isLoaded) {
    return <LoadingScreen />;
  }

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
          style={{ willChange: "transform, opacity" }}
        >
          <Suspense fallback={<LoadingScreen />}>
            <Routes location={location}>
              <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />
              <Route path="/home" element={<HomePage onNavigate={handleNavigate} />} />
              <Route path="/features" element={<FeaturesPage onNavigate={handleNavigate} />} />
              <Route path="/restaurants" element={<RestaurantsPage onNavigate={handleNavigate} />} />
              <Route path="/about" element={<AboutPage onNavigate={handleNavigate} />} />
              <Route path="/contact" element={<ContactPage onNavigate={handleNavigate} />} />
              <Route path="/waitlist" element={<WaitlistPage onNavigate={handleNavigate} />} />
              <Route path="/partner" element={<PartnerPage onNavigate={handleNavigate} />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <Suspense fallback={<LoadingScreen />}>
                      <AdminLayout>
                        <AdminDashboard />
                      </AdminLayout>
                    </Suspense>
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/waitlist"
                element={
                  <AdminRoute>
                    <Suspense fallback={<LoadingScreen />}>
                      <AdminLayout>
                        <WaitlistManagement />
                      </AdminLayout>
                    </Suspense>
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/leads"
                element={
                  <AdminRoute>
                    <Suspense fallback={<LoadingScreen />}>
                      <AdminLayout>
                        <RestaurantLeads />
                      </AdminLayout>
                    </Suspense>
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <AdminRoute>
                    <Suspense fallback={<LoadingScreen />}>
                      <AdminLayout>
                        <AnalyticsPage />
                      </AdminLayout>
                    </Suspense>
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/messages"
                element={
                  <AdminRoute>
                    <Suspense fallback={<LoadingScreen />}>
                      <AdminLayout>
                        <ContactMessages />
                      </AdminLayout>
                    </Suspense>
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <AdminRoute>
                    <Suspense fallback={<LoadingScreen />}>
                      <AdminLayout>
                        <SettingsPage />
                      </AdminLayout>
                    </Suspense>
                  </AdminRoute>
                }
              />

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
    <AdminProvider>
      <TranslationProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TranslationProvider>
    </AdminProvider>
  );
}
