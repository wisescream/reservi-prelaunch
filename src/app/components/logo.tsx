import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import logoImg from "../../imports/image-2.png";

import { useTranslation } from "../../lib/translations";

export function ReserviLogo({ animateOnMount = true }: { animateOnMount?: boolean }) {
  const { lang } = useTranslation();
  const [phase, setPhase] = useState<"utensils" | "logo">("utensils");
  const [hover, setHover] = useState(false);

  useEffect(() => {
    let t: number;
    const cycle = () => {
      setPhase((p) => {
        const next = p === "utensils" ? "logo" : "utensils";
        t = window.setTimeout(cycle, next === "logo" ? 4500 : 1600);
        return next;
      });
    };
    t = window.setTimeout(cycle, 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="flex items-center gap-2.5"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <motion.div
        className="relative w-11 h-11 grid place-items-center"
        initial={animateOnMount ? { rotate: -180, scale: 0 } : false}
        animate={{ rotate: hover ? 6 : 0, scale: hover ? 1.06 : 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 14 }}
      >
        <AnimatePresence mode="wait">
          {phase === "utensils" ? (
            <motion.div
              key="utensils"
              className="absolute inset-0 rounded-xl overflow-hidden grid place-items-center"
              style={{
                background: "linear-gradient(135deg, #a02000 0%, #8B1A00 50%, #5e1100 100%)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -8px 14px rgba(0,0,0,0.25), 0 6px 14px rgba(139,26,0,0.35)",
              }}
              initial={{ opacity: 0, scale: 0.6, rotate: -25 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 1.6, rotate: 25, filter: "blur(8px)" }}
              transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1] }}
            >
              <span
                className="absolute inset-x-0 top-0 h-1/2 pointer-events-none rounded-t-xl"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0))",
                }}
              />
              <svg viewBox="0 0 36 36" width="28" height="28">
                <motion.g
                  stroke="white"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  fill="white"
                  animate={{ x: [-1, -2, -1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transformOrigin: "12px 18px" }}
                >
                  <line x1="9" y1="4" x2="9" y2="11" />
                  <line x1="12" y1="4" x2="12" y2="11" />
                  <line x1="15" y1="4" x2="15" y2="11" />
                  <path d="M7.5 11 H16.5 V14 a4.5 4.5 0 0 1 -4.5 4.5 a4.5 4.5 0 0 1 -4.5 -4.5 Z" />
                  <line x1="12" y1="18.5" x2="12" y2="32" strokeWidth="2" />
                </motion.g>
                <motion.g
                  stroke="white"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  fill="white"
                  animate={{ x: [1, 2, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transformOrigin: "24px 18px" }}
                >
                  <path d="M24 4 Q30 10 28 18 L25 18 Q23 12 24 4 Z" />
                  <line x1="24.5" y1="18" x2="24.5" y2="32" strokeWidth="2.4" />
                </motion.g>
              </svg>
            </motion.div>
          ) : (
            <motion.div
              key="logo"
              className="absolute inset-0 rounded-xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.4, rotate: 25, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.7, filter: "blur(6px)" }}
              transition={{ type: "spring", stiffness: 220, damping: 16 }}
              style={{ boxShadow: "0 6px 14px rgba(139,26,0,0.35)" }}
            >
              <img src={logoImg} alt="Reservi" className="w-full h-full object-cover" />
              <motion.span
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.45) 50%, transparent 70%)",
                }}
                initial={{ x: "-100%" }}
                animate={{ x: "120%" }}
                transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Burst flash at morph apex */}
        <motion.div
          key={phase}
          className="absolute inset-0 rounded-xl bg-white pointer-events-none"
          initial={{ opacity: 0.7, scale: 0.4 }}
          animate={{ opacity: 0, scale: 1.4 }}
          transition={{ duration: 0.5 }}
        />

        {/* Sparkle */}
        <motion.div
          className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-white"
          animate={{ scale: [0, 1.6, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, delay: 0.8 }}
        />
      </motion.div>

      <div
        className="flex overflow-hidden"
        style={{ fontWeight: 800, fontSize: 22, color: "#1A1A1A", letterSpacing: lang === "ar" ? 0 : -0.5 }}
      >
        {lang === "ar" ? (
          <motion.span
            initial={animateOnMount ? { y: 24, opacity: 0 } : false}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 220, damping: 18 }}
            style={{
              display: "inline-block",
              color: "#E8450A",
              cursor: "pointer",
              fontFamily: "sans-serif"
            }}
          >
            رِزيرڤي
          </motion.span>
        ) : (
          "Reservi".split("").map((c, i) => (
            <motion.span
              key={i}
              initial={animateOnMount ? { y: 24, opacity: 0 } : false}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.05, type: "spring", stiffness: 220, damping: 18 }}
              whileHover={{ y: -3 }}
              style={{
                display: "inline-block",
                color: i === 0 ? "#E8450A" : "#1A1A1A",
                cursor: "pointer",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#E8450A")}
              onMouseLeave={(e) => (e.currentTarget.style.color = i === 0 ? "#E8450A" : "#1A1A1A")}
            >
              {c}
            </motion.span>
          ))
        )}
      </div>
    </div>
  );
}
