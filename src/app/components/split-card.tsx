import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";

type Props = {
  title: string;
  items: string[];
  ctaLabel: string;
  onCta: () => void;
  variant?: "diner" | "restaurant";
};

export function SplitCard({ title, items, ctaLabel, onCta, variant = "diner" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 220, damping: 22 });
  const ry = useSpring(useTransform(mx, [0, 1], [-10, 10]), { stiffness: 220, damping: 22 });
  const lightX = useTransform(mx, [0, 1], ["0%", "100%"]);
  const lightY = useTransform(my, [0, 1], ["0%", "100%"]);

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  const accent = variant === "diner" ? "#E8450A" : "#FFB489";

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        mx.set(0.5);
        my.set(0.5);
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
      className="relative rounded-2xl p-8 flex flex-col text-white overflow-hidden"
    >
      {/* Animated gradient backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            variant === "diner"
              ? "linear-gradient(135deg, #1A1A1A 0%, #2a1a14 50%, #4a1c0a 100%)"
              : "linear-gradient(135deg, #2a1a14 0%, #1A1A1A 50%, #0e0e0e 100%)",
        }}
      />

      {/* moving radial light */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: useTransform([lightX, lightY] as any, ([x, y]: any) =>
            `radial-gradient(280px circle at ${x} ${y}, rgba(232,69,10,0.35), transparent 70%)`
          ),
          opacity: hover ? 1 : 0.45,
          transition: "opacity 0.3s",
        }}
      />

      {/* Floating ambient orbs */}
      <motion.div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgba(232,69,10,0.4)" }}
        animate={{ x: [0, 15, 0], y: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Diagonal shine sweep on hover */}
      <motion.div
        className="absolute inset-y-0 -left-1/2 w-1/2 pointer-events-none"
        style={{
          background:
            "linear-gradient(115deg, transparent, rgba(255,255,255,0.18), transparent)",
        }}
        animate={{ x: hover ? "300%" : "-50%" }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />

      <div className="relative">
        <motion.div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
          style={{ background: "rgba(232,69,10,0.18)", color: accent, fontSize: 12, fontWeight: 700, letterSpacing: 1 }}
          animate={{ y: hover ? -2 : 0 }}
        >
          <motion.span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: accent }}
            animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          {variant === "diner" ? "FOR DINERS" : "FOR RESTAURANTS"}
        </motion.div>

        <motion.h3
          style={{ fontWeight: 700, fontSize: 28, lineHeight: 1.1 }}
          animate={{ x: hover ? 3 : 0 }}
        >
          {title}
        </motion.h3>

        <ul className="space-y-3 my-7">
          {items.map((t, i) => (
            <motion.li
              key={t}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i + 0.3 }}
              className="flex items-center gap-3 text-white/90"
            >
              <motion.span
                className="w-7 h-7 rounded-full grid place-items-center shrink-0"
                style={{ background: "rgba(232,69,10,0.18)" }}
                whileHover={{ rotate: 360, scale: 1.15 }}
                transition={{ duration: 0.5 }}
              >
                <CheckCircle2 size={16} className="text-[#E8450A]" />
              </motion.span>
              <span>{t}</span>
            </motion.li>
          ))}
        </ul>

        <motion.button
          onClick={onCta}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="mt-auto self-start relative inline-flex items-center gap-2 bg-[#E8450A] text-white px-6 py-3 rounded-lg overflow-hidden group"
          style={{ fontWeight: 600 }}
        >
          <motion.span
            className="absolute inset-0 bg-white"
            initial={{ x: "-110%" }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.4 }}
            style={{ mixBlendMode: "overlay" }}
          />
          <span className="relative">{ctaLabel}</span>
          <motion.span
            className="relative"
            animate={{ x: hover ? [0, 4, 0] : 0 }}
            transition={{ duration: 0.9, repeat: Infinity }}
          >
            →
          </motion.span>
        </motion.button>
      </div>
    </motion.div>
  );
}
