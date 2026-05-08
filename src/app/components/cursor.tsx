import { useEffect, useRef, useState, memo, useCallback } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { Heart, Pencil, Send, Camera } from "lucide-react";

type Mode = "default" | "button" | "submit" | "text" | "success" | "image" | "link";

declare global {
  interface Window {
    __reserviCursorSuccess?: () => void;
  }
}

export function KnifeForkCursor() {
  const [mode, setMode] = useState<Mode>("default");
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [throws, setThrows] = useState<{ id: number; x: number; y: number }[]>([]);
  const [successFx, setSuccessFx] = useState<{ id: number; x: number; y: number }[]>([]);
  const [trail, setTrail] = useState<{ id: number; x: number; y: number }[]>([]);

  // Spring-driven cursor position
  const cx = useMotionValue(-100);
  const cy = useMotionValue(-100);
  const sx = useSpring(cx, { stiffness: 1000, damping: 22, mass: 0.15 });
  const sy = useSpring(cy, { stiffness: 1000, damping: 22, mass: 0.15 });

  // Slower trailing follower (the orange dot)
  const tx = useSpring(cx, { stiffness: 500, damping: 18, mass: 0.25 });
  const ty = useSpring(cy, { stiffness: 500, damping: 18, mass: 0.25 });

  const lastPos = useRef({ x: 0, y: 0 });
  const lastTrail = useRef(0);

  useEffect(() => {
    const check = () => setIsDesktop(window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    const style = document.createElement("style");
    style.id = "cursor-none-important";
    style.innerHTML = `* { cursor: none !important; }`;
    document.head.appendChild(style);

    const move = (e: MouseEvent) => {
      let targetX = e.clientX;
      let targetY = e.clientY;

      const t = e.target as HTMLElement;
      // Magnetic snap: pull toward big buttons
      const magnet = t?.closest<HTMLElement>("[data-magnet], button.magnet");
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const cxv = r.left + r.width / 2;
        const cyv = r.top + r.height / 2;
        targetX = e.clientX + (cxv - e.clientX) * 0.25;
        targetY = e.clientY + (cyv - e.clientY) * 0.25;
      }

      cx.set(targetX);
      cy.set(targetY);
      lastPos.current = { x: targetX, y: targetY };
      setVisible(true);

      // Sparkle trail
      // Sparkle trail - throttled for performance
      const now = Date.now();
      if (now - lastTrail.current > 45) {
        lastTrail.current = now;
        const id = now + Math.random();
        setTrail((tr) => [...tr.slice(-6), { id, x: e.clientX, y: e.clientY }]);
        setTimeout(() => setTrail((tr) => tr.filter((p) => p.id !== id)), 600);
      }

      if (!t) return setMode("default");
      // Force-default zones (logo, navbar, footer brand)
      const labelEl = t.closest<HTMLElement>("[data-cursor-label]");
      setLabel(labelEl?.dataset.cursorLabel || null);
      if (t.closest("[data-cursor=default], header, nav, footer")) {
        if (t.closest("button, a, [role=button]")) setMode("button");
        else if (t.closest("input, textarea")) setMode("text");
        else setMode("default");
        return;
      }
      if (t.closest("input, textarea, [contenteditable=true]")) setMode("text");
      else if (t.closest("button[type=submit], [data-cursor=submit]")) setMode("submit");
      else if (t.closest("[data-cursor=image]")) setMode("image");
      else if (t.closest("a[target=_blank]")) setMode("link");
      else if (t.closest("button, a, [role=button], [data-cursor=button]")) setMode("button");
      else setMode("default");
    };
    const leave = () => setVisible(false);

    const click = (e: MouseEvent) => {
      setPressed(true);
      const id = Date.now() + Math.random();
      setThrows((t) => [...t, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setThrows((t) => t.filter((x) => x.id !== id)), 800);
    };
    const release = () => setPressed(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", leave);
    window.addEventListener("mousedown", click);
    window.addEventListener("mouseup", release);

    window.__reserviCursorSuccess = () => {
      setMode("success");
      const id = Date.now();
      setSuccessFx((s) => [...s, { id, x: lastPos.current.x, y: lastPos.current.y }]);
      setTimeout(() => setMode("default"), 1400);
      setTimeout(() => setSuccessFx((s) => s.filter((x) => x.id !== id)), 1500);
    };

    return () => {
      const style = document.getElementById("cursor-none-important");
      if (style) style.remove();
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
      window.removeEventListener("mousedown", click);
      window.removeEventListener("mouseup", release);
      delete window.__reserviCursorSuccess;
    };
  }, [isDesktop]);

  if (!isDesktop) return null;

  const baseScale =
    mode === "button" || mode === "submit" || mode === "image" ? 1.05 :
    mode === "text" ? 0.75 : 0.8;
  const scale = pressed ? baseScale * 0.75 : baseScale;

  return (
    <>
      {/* Trailing orange ghost dot */}
      <motion.div
        className="pointer-events-none fixed z-[9997] top-0 left-0"
        style={{ x: tx, y: ty, willChange: "transform" }}
      >
        <motion.div
          className="rounded-full bg-[#E8450A]"
          style={{ x: -6, y: -6 }}
          animate={{
            width: visible ? 8 : 0,
            height: visible ? 8 : 0,
            opacity: visible ? 0.4 : 0,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      {/* Main cursor */}
      <motion.div
        className="pointer-events-none fixed z-[9999] top-0 left-0"
        style={{ x: cx, y: cy, willChange: "transform" }}
      >
        <motion.div
          style={{ x: -18, y: -18, willChange: "transform" }}
          animate={{ scale, opacity: visible ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 26 }}
        >
          <AnimatePresence mode="wait">
            {mode === "success" ? (
              <motion.div
                key="success"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                className="w-9 h-9 rounded-full bg-[#E8450A] grid place-items-center"
              >
                <Heart size={20} fill="white" stroke="white" />
              </motion.div>
            ) : mode === "submit" ? (
              <motion.div
                key="submit"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="w-9 h-9 rounded-full bg-[#E8450A] grid place-items-center"
              >
                <motion.div animate={{ x: [0, 3, 0] }} transition={{ duration: 1.2, repeat: Infinity }} style={{ willChange: "transform" }}>
                  <Send size={18} stroke="white" fill="white" />
                </motion.div>
              </motion.div>
            ) : mode === "text" ? (
              <motion.div
                key="text"
                initial={{ scale: 0, rotate: 30 }}
                animate={{ scale: 1, rotate: -8 }}
                exit={{ scale: 0 }}
                className="w-9 h-9 rounded-lg bg-[#1A1A1A] grid place-items-center shadow-lg"
              >
                <Pencil size={16} stroke="#E8450A" />
              </motion.div>
            ) : mode === "image" ? (
              <motion.div
                key="image"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="px-3 h-9 rounded-full bg-[#1A1A1A] text-white grid place-items-center shadow-lg gap-2 flex items-center"
                style={{ fontSize: 12, fontWeight: 600 }}
              >
                <Camera size={14} /> View
              </motion.div>
            ) : mode === "link" ? (
              <motion.div
                key="link"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="w-9 h-9 rounded-full bg-[#E8450A] text-white grid place-items-center"
              >
                <span style={{ fontWeight: 800, fontSize: 14 }}>↗</span>
              </motion.div>
            ) : (
              <motion.div key="default" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <UtensilsCursor idle={mode === "default"} />
              </motion.div>
            )}
          </AnimatePresence>
          {(mode === "button" || mode === "submit" || mode === "image" || mode === "link") && (
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#E8450A]"
              initial={{ width: 0, height: 0, opacity: 0 }}
              animate={{ width: 44, height: 44, opacity: 0.5 }}
              style={{ willChange: "width, height, opacity" }}
            />
          )}
        </motion.div>
      </motion.div>

      {/* Contextual label */}
      <motion.div
        className="pointer-events-none fixed z-[9999] top-0 left-0"
        style={{ x: cx, y: cy, willChange: "transform" }}
      >
        <AnimatePresence>
          {label && (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.9 }}
              transition={{ duration: 0.18 }}
              className="absolute whitespace-nowrap px-2.5 py-1 rounded-full bg-[#1A1A1A] text-white shadow-lg"
              style={{ left: 22, top: 18, fontSize: 11, fontWeight: 600, letterSpacing: 0.2 }}
            >
              {label}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <SparkleTrail trail={trail} />

      <AnimatePresence>
        {throws.map((t) => (
          <ThrowBurst key={t.id} x={t.x} y={t.y} />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {successFx.map((s) => (
          <SuccessBurst key={s.id} x={s.x} y={s.y} />
        ))}
      </AnimatePresence>
    </>
  );
}

const UtensilsCursor = memo(({ idle }: { idle: boolean }) => {
  return (
    <motion.svg
      width="36" height="36" viewBox="0 0 36 36"
      animate={{ rotate: idle ? [-12, -8, -12, -16, -12] : -12 }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      style={{ willChange: "transform" }}
    >
      <g stroke="#1A1A1A" strokeWidth="1.6" strokeLinecap="round" fill="#1A1A1A">
        <line x1="9" y1="4" x2="9" y2="11" />
        <line x1="12" y1="4" x2="12" y2="11" />
        <line x1="15" y1="4" x2="15" y2="11" />
        <path d="M7.5 11 H16.5 V14 a4.5 4.5 0 0 1 -4.5 4.5 a4.5 4.5 0 0 1 -4.5 -4.5 Z" />
        <line x1="12" y1="18.5" x2="12" y2="32" strokeWidth="2" />
      </g>
      <g stroke="#E8450A" strokeWidth="1.6" strokeLinecap="round" fill="#E8450A">
        <path d="M24 4 Q30 10 28 18 L25 18 Q23 12 24 4 Z" />
        <line x1="24.5" y1="18" x2="24.5" y2="32" strokeWidth="2.4" stroke="#E8450A" />
      </g>
    </motion.svg>
  );
});

const SparkleTrail = memo(({ trail }: { trail: { id: number; x: number; y: number }[] }) => {
  return (
    <AnimatePresence>
      {trail.map((p) => (
        <motion.div
          key={p.id}
          className="pointer-events-none fixed z-[9996] top-0 left-0 rounded-full"
          style={{
            x: p.x - 3,
            y: p.y - 3,
            width: 6,
            height: 6,
            background: "#E8450A",
            willChange: "transform, opacity",
          }}
          initial={{ opacity: 0.7, scale: 1 }}
          animate={{ opacity: 0, scale: 0.2 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </AnimatePresence>
  );
});

function ThrowBurst({ x, y }: { x: number; y: number }) {
  return (
    <div className="pointer-events-none fixed z-[9998] top-0 left-0" style={{ transform: `translate(${x}px, ${y}px)` }}>
      <motion.svg
        width="28" height="28" viewBox="0 0 36 36"
        className="absolute"
        initial={{ x: -12, y: -12, rotate: 0, opacity: 1 }}
        animate={{ x: -120, y: -50, rotate: -720, opacity: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <g stroke="#1A1A1A" strokeWidth="1.6" strokeLinecap="round" fill="#1A1A1A">
          <line x1="9" y1="4" x2="9" y2="11" />
          <line x1="12" y1="4" x2="12" y2="11" />
          <line x1="15" y1="4" x2="15" y2="11" />
          <path d="M7.5 11 H16.5 V14 a4.5 4.5 0 0 1 -4.5 4.5 a4.5 4.5 0 0 1 -4.5 -4.5 Z" />
          <line x1="12" y1="18.5" x2="12" y2="32" strokeWidth="2" />
        </g>
      </motion.svg>
      <motion.svg
        width="28" height="28" viewBox="0 0 36 36"
        className="absolute"
        initial={{ x: -12, y: -12, rotate: 0, opacity: 1 }}
        animate={{ x: 100, y: -70, rotate: 900, opacity: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <g stroke="#E8450A" strokeWidth="1.6" strokeLinecap="round" fill="#E8450A">
          <path d="M24 4 Q30 10 28 18 L25 18 Q23 12 24 4 Z" />
          <line x1="24.5" y1="18" x2="24.5" y2="32" strokeWidth="2.4" stroke="#E8450A" />
        </g>
      </motion.svg>
      <motion.div
        className="absolute rounded-full border-2 border-[#E8450A]"
        style={{ left: -2, top: -2 }}
        initial={{ width: 4, height: 4, opacity: 0.8 }}
        animate={{ width: 90, height: 90, x: -43, y: -43, opacity: 0 }}
        transition={{ duration: 0.7 }}
      />
      {/* Spark dots */}
      {[...Array(5)].map((_, i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-[#E8450A]"
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{ x: Math.cos(a) * 40, y: Math.sin(a) * 40, opacity: 0, scale: 0 }}
            transition={{ duration: 0.6 }}
          />
        );
      })}
    </div>
  );
}

function SuccessBurst({ x, y }: { x: number; y: number }) {
  return (
    <div className="pointer-events-none fixed z-[9998] top-0 left-0" style={{ transform: `translate(${x}px, ${y}px)` }}>
      {[...Array(6)].map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <motion.div
            key={i}
            className="absolute text-[#E8450A]"
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{ x: Math.cos(a) * 50, y: Math.sin(a) * 50, scale: 1, opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          >
            <Heart size={14} fill="#E8450A" />
          </motion.div>
        );
      })}
      <motion.div
        className="absolute"
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="w-10 h-10 rounded-full bg-[#E8450A]/30 -translate-x-1/2 -translate-y-1/2" />
      </motion.div>
    </div>
  );
}

export function triggerCursorSuccess() {
  if (typeof window !== "undefined") window.__reserviCursorSuccess?.();
}
