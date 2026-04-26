import { useEffect, useState } from "react";
import { ArrowRight, Mail, Instagram, Facebook, Linkedin, Twitter, ArrowUpRight, Menu, X } from "lucide-react";
import { motion, useScroll, useSpring, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { ImageWithFallback } from "./ui/ImageWithFallback";
import { ReserviLogo } from "./logo";
import { triggerCursorSuccess } from "./cursor";
import { submitWaitlistSignup } from "../../lib/firestore";
import { trackEvent } from "../../lib/analytics";
import { useTranslation, Language } from "../../lib/translations";
export { useTranslation };

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" },
};

const stagger = {
  initial: {},
  whileInView: {},
  viewport: { once: true, margin: "-80px" },
  transition: { staggerChildren: 0.1 },
};

const Reveal = motion.div;

type Page = "home" | "features" | "restaurants" | "about" | "contact" | "waitlist" | "partner";

export function Navbar({ current, onNavigate }: { current: Page; onNavigate: (p: Page) => void }) {
  const { lang, setLang, t } = useTranslation();
  
  const links: { key: Page; label: string }[] = [
    { key: "home", label: lang === "ar" ? "الرئيسية" : lang === "fr" ? "Accueil" : "Home" },
    { key: "features", label: t("features") },
    { key: "restaurants", label: t("for_restaurants") },
    { key: "about", label: t("about") },
    { key: "contact", label: t("contact") },
  ];
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<Page | null>(null);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progressX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 140, damping: 18 }}
      className="sticky top-0 z-40"
    >
      <div
        className="transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,1)",
          backdropFilter: scrolled ? "blur(14px)" : "blur(0px)",
          boxShadow: scrolled ? "0 8px 30px rgba(0,0,0,0.06)" : "none",
          borderBottom: scrolled ? "1px solid rgba(0,0,0,0.05)" : "1px solid #f3f4f6",
        }}
      >
        <div
          className="max-w-[1200px] mx-auto flex items-center justify-between px-6 transition-all duration-300"
          style={{ paddingTop: scrolled ? 12 : 20, paddingBottom: scrolled ? 12 : 20 }}
        >
          <button onClick={() => onNavigate("home")} className="flex items-center gap-2">
            <ReserviLogo />
          </button>

          {/* Desktop nav with floating active pill */}
          <nav
            className="hidden md:flex items-center gap-1 rounded-full bg-[#F5F5F5]/70 px-2 py-1.5 relative"
            onMouseLeave={() => setHovered(null)}
          >
            {links.map((l) => {
              const active = current === l.key;
              const isHover = hovered === l.key;
              return (
                <button
                  key={l.key}
                  onMouseEnter={() => setHovered(l.key)}
                  onClick={() => onNavigate(l.key)}
                  className="relative px-4 py-2 rounded-full transition-colors"
                  style={{
                    color: active ? "#FFFFFF" : "#1A1A1A",
                    fontWeight: 600,
                    fontSize: 14,
                    zIndex: 1,
                  }}
                >
                  {(active || isHover) && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: active ? "#E8450A" : "rgba(232,69,10,0.12)", zIndex: -1 }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span style={{ color: active ? "#FFFFFF" : isHover ? "#E8450A" : "#1A1A1A" }}>
                    {l.label}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {/* Language Selector Dropdown */}
            <div className="relative group">
              <button 
                className="flex items-center gap-1 px-3.5 py-2 rounded-full bg-[#F5F5F5]/70 hover:bg-gray-200 text-[#1A1A1A] transition-colors shadow-sm"
                style={{ fontWeight: 700, fontSize: 13 }}
              >
                <span className="uppercase tracking-wider">{lang}</span>
                <span className="text-[9px] opacity-60 group-hover:rotate-180 transition-transform duration-200">▼</span>
              </button>
              <div className="absolute right-0 mt-1 hidden group-hover:block bg-white shadow-xl rounded-xl py-1.5 border border-black/5 min-w-[80px] z-[9999] overflow-hidden">
                {(["en", "fr", "ar"] as Language[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`w-full px-4 py-2 text-center text-xs font-bold hover:bg-gray-50 transition-colors ${lang === l ? 'text-[#E8450A]' : 'text-[#1A1A1A]'}`}
                  >
                    <span className="uppercase tracking-wider">{l}</span>
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onNavigate("waitlist")}
              className="hidden sm:inline-flex relative items-center gap-2 bg-[#1A1A1A] hover:bg-[#E8450A] text-white px-5 py-2.5 rounded-full transition-colors group overflow-hidden"
              style={{ fontWeight: 600, fontSize: 14 }}
            >
              <motion.span
                className="absolute inset-0 bg-[#E8450A]"
                initial={{ x: "-110%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.4 }}
              />
              <span className="relative inline-flex items-center gap-2">
                {t("join_waitlist")}
                <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
                  <ArrowRight size={16} />
                </motion.span>
              </span>
              <span className="absolute -inset-1 rounded-full bg-[#E8450A]/30 blur-md -z-10" />
            </motion.button>

            <button
              onClick={() => setOpen((o) => !o)}
              className="md:hidden w-10 h-10 grid place-items-center rounded-full bg-[#F5F5F5]"
              aria-label="menu"
            >
              <AnimatePresence mode="wait">
                {open ? (
                  <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <X size={20} />
                  </motion.span>
                ) : (
                  <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    <Menu size={20} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Scroll progress bar */}
        <motion.div
          className="h-[2px] bg-[#E8450A] origin-left"
          style={{ scaleX: progressX }}
        />

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden bg-white border-t border-gray-100"
            >
              <div className="max-w-[1200px] mx-auto px-6 py-4 flex flex-col gap-1">
                {links.map((l, i) => (
                  <motion.button
                    key={l.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => {
                      onNavigate(l.key);
                      setOpen(false);
                    }}
                    className="text-left px-4 py-3 rounded-lg hover:bg-[#FFF1EA] transition-colors"
                    style={{
                      color: current === l.key ? "#E8450A" : "#1A1A1A",
                      fontWeight: 600,
                    }}
                  >
                    {l.label}
                  </motion.button>
                ))}
                <div className="flex items-center gap-2 mt-2 px-4 py-2 bg-[#F5F5F5]/60 rounded-lg">
                  <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">{lang === "ar" ? "اللغة:" : lang === "fr" ? "Langue:" : "Language:"}</span>
                  <div className="flex gap-1 items-center ml-auto">
                    {(["en", "fr", "ar"] as Language[]).map((l) => (
                      <button
                        key={l}
                        onClick={() => {
                          setLang(l);
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all ${lang === l ? 'bg-[#E8450A] text-white' : 'text-[#1A1A1A] hover:bg-gray-200'}`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    onNavigate("waitlist");
                    setOpen(false);
                  }}
                  className="mt-2 bg-[#E8450A] text-white px-4 py-3 rounded-lg"
                  style={{ fontWeight: 600 }}
                >
                  {t("join_waitlist")}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

export function PrimaryButton({ children, onClick, full }: { children: React.ReactNode; onClick?: () => void; full?: boolean }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04, boxShadow: "0 10px 24px rgba(232,69,10,0.35)" }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      data-magnet
      className={`bg-[#E8450A] hover:bg-[#c93a08] text-white px-6 py-3 rounded-lg transition-colors ${full ? "w-full" : ""}`}
      style={{ fontWeight: 600 }}
    >
      {children}
    </motion.button>
  );
}

export function SecondaryButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <motion.button
      whileHover={{ x: 4 }}
      onClick={onClick}
      className="group inline-flex items-center gap-2 text-[#1A1A1A] hover:text-[#E8450A] transition-colors px-2 py-3"
      style={{ fontWeight: 600 }}
    >
      {children}
      <motion.span initial={{ x: 0 }} animate={{ x: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}>
        <ArrowRight size={18} />
      </motion.span>
    </motion.button>
  );
}

export function PhoneMockup({ image, className = "", fetchpriority }: { image?: string; className?: string; fetchpriority?: "high" | "low" | "auto" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: -2 }}
      animate={{ opacity: 1, y: [0, -8, 0], rotate: 0 }}
      transition={{ opacity: { duration: 0.8 }, rotate: { duration: 0.8 }, y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
      className={`relative ${className}`} style={{ width: 280, height: 560 }}>
      <div className="absolute inset-0 rounded-[40px] bg-[#1A1A1A] p-2 shadow-2xl">
        <div className="w-full h-full rounded-[32px] overflow-hidden relative bg-gray-800">
          <ImageWithFallback
            src={image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600"}
            alt="Restaurant"
            className="w-full h-full object-cover"
            {...({ fetchpriority } as any)}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full" />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="absolute bottom-6 left-4 right-4 bg-white/95 backdrop-blur rounded-2xl p-4">
            <div className="text-xs text-[#555]" style={{ fontWeight: 500 }}>Tonight, 7:30 PM</div>
            <div style={{ fontWeight: 700, color: "#1A1A1A" }} className="mt-1">Bella Italia</div>
            <div className="flex gap-2 mt-3">
              <span className="text-xs px-2 py-1 rounded bg-[#E8450A] text-white">Available</span>
              <span className="text-xs px-2 py-1 rounded bg-gray-100 text-[#555]">2 guests</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6, boxShadow: "0 18px 32px rgba(0,0,0,0.08)" }}
      className="p-6 rounded-2xl border border-gray-200 hover:border-[#E8450A] transition-colors bg-white"
    >
      <motion.div whileHover={{ rotate: 8, scale: 1.1 }} className="w-12 h-12 rounded-xl border-2 border-[#E8450A] text-[#E8450A] grid place-items-center mb-4">
        {icon}
      </motion.div>
      <h3 style={{ fontWeight: 700, color: "#1A1A1A", fontSize: 20 }} className="mb-2">{title}</h3>
      <p style={{ color: "#555555" }}>{description}</p>
    </motion.div>
  );
}

export function StepCircle({ n }: { n: number }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -90 }}
      whileInView={{ scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 200, damping: 12, delay: n * 0.1 }}
      whileHover={{ scale: 1.1 }}
      className="w-14 h-14 rounded-full bg-[#E8450A] text-white grid place-items-center"
      style={{ fontWeight: 700, fontSize: 22 }}
    >
      {n}
    </motion.div>
  );
}

export function EmailJoin({ dark }: { dark?: boolean }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }
    try {
      await submitWaitlistSignup({ email, sourcePage: window.location.pathname });
      trackEvent("waitlist_signup", { email, source_page: window.location.pathname });
      toast.success("You're on the waitlist!", { description: `We'll email ${email} when we launch.` });
      triggerCursorSuccess();
      setEmail("");
    } catch (error) {
      toast.error("Failed to join waitlist. Please try again.");
      console.error(error);
    }
  };

  return (
    <form onSubmit={submit} className="flex gap-2 w-full max-w-md">
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder={t("email_placeholder")}
        className={`flex-1 px-4 py-3 rounded-lg outline-none ${dark ? "bg-white text-[#1A1A1A]" : "bg-white border border-gray-200 text-[#1A1A1A]"}`}
      />
      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} type="submit" className="bg-[#E8450A] hover:bg-[#c93a08] text-white px-5 py-3 rounded-lg whitespace-nowrap" style={{ fontWeight: 600 }}>
        {t("join_waitlist")}
      </motion.button>
    </form>
  );
}

export function EmailBanner() {
  return (
    <section className="bg-[#8B1A00] text-white">
      <div className="max-w-[1200px] mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/10 grid place-items-center">
            <Mail size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 20 }}>Be the first to know</div>
            <div className="text-white/80">Get early access when we launch in your city.</div>
          </div>
        </div>
        <EmailJoin dark />
      </div>
    </section>
  );
}

const TikTokIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export function Footer({ onNavigate }: { onNavigate?: (p: Page) => void }) {
  const { t, lang } = useTranslation();
  const go = (p: Page) => onNavigate?.(p);
  const [activeModal, setActiveModal] = useState<"privacy" | "terms" | "cookies" | null>(null);

  const policies = {
    privacy: {
      title: "Privacy Policy",
      content: "At Reservi, we prioritize your privacy. We collect minimal data required to securely process waitlist reservations and optimize application performance. Your information is never sold or distributed maliciously."
    },
    terms: {
      title: "Terms of Service",
      content: "By accessing the Reservi prelaunch framework, you agree to comply with operational guidelines. Waitlist statuses represent exclusive access prioritization and do not guarantee instantaneous placement configurations."
    },
    cookies: {
      title: "Cookies Policy",
      content: "Reservi utilizes localized caching tokens to maintain preferences securely. Analytics tracking improves application navigation metrics comfortably."
    }
  };

  return (
    <footer className="relative bg-gradient-to-br from-[#8B1A00] via-[#a02000] to-[#5e1100] text-white overflow-hidden">
      {/* animated decorative blobs */}
      <motion.div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#E8450A]/30 blur-3xl"
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#E8450A]/20 blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative max-w-[1200px] mx-auto px-6 pt-20 pb-10">
        {/* big CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-12 border-b border-white/15"
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: 44, lineHeight: 1.05 }}>{t("hungry_yet")}</div>
            <div className="text-white/80 mt-2">{t("hungry_desc")}</div>
          </div>
          <button
            onClick={() => go("waitlist")}
            className="bg-white text-[#8B1A00] px-7 py-4 rounded-lg inline-flex items-center gap-2 hover:bg-[#E8450A] hover:text-white transition-colors group"
            style={{ fontWeight: 700 }}
          >
            {t("join_waitlist")}
            <ArrowUpRight size={20} className="group-hover:rotate-45 transition-transform" />
          </button>
        </motion.div>

        <div className="grid md:grid-cols-12 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-5"
          >
            <div className="flex items-center gap-2 mb-4 text-white">
              <div className="bg-white/10 rounded-lg p-1">
                <ReserviLogo />
              </div>
            </div>
            <p className="text-white/80 max-w-sm">
              {t("hero_title")} {t("hero_desc")}
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { Ic: Instagram, href: "https://www.instagram.com/reservi_app?igsh=MWRra3kxeGR5Nm50ZA%3D%3D&utm_source=qr" },
                { Ic: TikTokIcon, href: "https://www.tiktok.com/@reservi.io?_r=1&_t=ZS-95rjZzGYL4v" }
              ].map((item, i) => (
                <motion.a
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -4, backgroundColor: "rgba(232,69,10,1)" }}
                  style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                  className="w-11 h-11 rounded-xl grid place-items-center"
                >
                  <item.Ic size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <FooterCol title={t("product")} items={[
            { label: t("features"), page: "features" as Page },
            { label: t("for_restaurants"), page: "restaurants" as Page },
            { label: t("partner_us"), page: "partner" as Page },
            { label: t("waitlist"), page: "waitlist" as Page },
          ]} go={go} />

          <FooterCol title={t("company")} items={[
            { label: t("about"), page: "about" as Page },
            { label: t("contact"), page: "contact" as Page },
          ]} go={go} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-3"
          >
            <div style={{ fontWeight: 700 }} className="mb-4">{t("get_in_touch")}</div>
            <ul className="space-y-2 text-white/80" style={{ fontSize: 14 }}>
              <li>reservifouders@gmail.com</li>
              <li>+212 784-115699</li>
              <li>Casablanca, Morocco</li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-14 pt-6 border-t border-white/15 flex flex-col md:flex-row items-center justify-between gap-4 text-white/70"
          style={{ fontSize: 13 }}
        >
          <div>© 2026 Reservi. All rights reserved.</div>
          <div className="flex gap-6">
            <span onClick={() => setActiveModal("privacy")} className="hover:text-white cursor-pointer transition-colors">Privacy</span>
            <span onClick={() => setActiveModal("terms")} className="hover:text-white cursor-pointer transition-colors">Terms</span>
            <span onClick={() => setActiveModal("cookies")} className="hover:text-white cursor-pointer transition-colors">Cookies</span>
          </div>
        </motion.div>
      </div>

      {/* giant watermark text */}
      <motion.div
        aria-hidden
        className="pointer-events-none select-none absolute bottom-[-50px] left-1/2 -translate-x-1/2 whitespace-nowrap text-white/5"
        style={{ fontWeight: 900, fontSize: 240, letterSpacing: -8 }}
        animate={{ x: ["-50%", "-52%", "-50%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        RESERVI
      </motion.div>

      {/* Policy Overlay Modal */}
      <AnimatePresence>
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={() => setActiveModal(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-md bg-[#1A1A1A] text-white p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[#E8450A]/20 blur-xl" />
              
              <div className="relative">
                <h3 style={{ fontWeight: 800, fontSize: 24 }} className="mb-4 text-white">
                  {policies[activeModal].title}
                </h3>
                <p className="text-white/80 leading-relaxed" style={{ fontSize: 15 }}>
                  {policies[activeModal].content}
                </p>
                
                <button 
                  onClick={() => setActiveModal(null)}
                  className="mt-6 w-full bg-[#E8450A] hover:bg-[#FF5722] text-white py-3 rounded-xl transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}

function FooterCol({ title, items, go }: { title: string; items: { label: string; page: Page }[]; go: (p: Page) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="md:col-span-2"
    >
      <div style={{ fontWeight: 700 }} className="mb-4">{title}</div>
      <ul className="space-y-2.5">
        {items.map((it) => (
          <li key={it.label}>
            <motion.button
              whileHover={{ x: 4 }}
              onClick={() => go(it.page)}
              className="text-white/80 hover:text-white transition-colors inline-flex items-center gap-1 group"
              style={{ fontSize: 14 }}
            >
              <span className="w-0 h-px bg-[#E8450A] group-hover:w-3 transition-all" />
              {it.label}
            </motion.button>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export type { Page };
