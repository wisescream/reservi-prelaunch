import { motion, useMotionValue, useTransform, useSpring } from "motion/react";
import { useRef, useState } from "react";

type Props = {
  n: number;
  title: string;
  desc: string;
  icon?: React.ReactNode;
  delay?: number;
};

export function StepCard({ n, title, desc, icon, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);

  // 3D tilt on hover
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotX = useSpring(useTransform(my, [0, 1], [10, -10]), { stiffness: 200, damping: 20 });
  const rotY = useSpring(useTransform(mx, [0, 1], [-12, 12]), { stiffness: 200, damping: 20 });
  const glowX = useTransform(mx, [0, 1], ["0%", "100%"]);
  const glowY = useTransform(my, [0, 1], ["0%", "100%"]);

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

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
      transition={{ delay, duration: 0.55, ease: "easeOut" }}
      style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1000 }}
      className="relative bg-white border border-gray-100 rounded-2xl p-7 cursor-pointer group"
    >
      {/* Animated gradient border on hover */}
      <motion.div
        className="absolute -inset-[1px] rounded-2xl pointer-events-none"
        style={{
          background:
            "conic-gradient(from var(--angle, 0deg), #E8450A, #FFB489, #E8450A, transparent 60%)",
          opacity: hover ? 0.7 : 0,
          padding: 1,
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
        animate={{ "--angle": hover ? "360deg" : "0deg" } as any}
        transition={{ duration: 2, repeat: hover ? Infinity : 0, ease: "linear" }}
      />

      {/* Cursor-following glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: useTransform(
            [glowX, glowY] as any,
            ([x, y]: any) =>
              `radial-gradient(180px circle at ${x} ${y}, rgba(232,69,10,0.18), transparent 60%)`
          ),
          opacity: hover ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />

      {/* Big background number */}
      <motion.span
        aria-hidden
        className="absolute -top-4 right-4 select-none pointer-events-none"
        style={{
          fontWeight: 900,
          fontSize: 110,
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: "2px rgba(232,69,10,0.12)",
        }}
        animate={{ y: hover ? -4 : 0, opacity: hover ? 0.9 : 0.5 }}
      >
        {n}
      </motion.span>

      {/* Animated step circle */}
      <motion.div
        className="relative w-14 h-14 rounded-full grid place-items-center text-white mb-5"
        style={{
          background:
            "linear-gradient(135deg, #E8450A 0%, #ff6a30 100%)",
          boxShadow: "0 10px 24px rgba(232,69,10,0.35)",
        }}
        animate={{
          rotate: hover ? [0, -8, 8, 0] : 0,
          scale: hover ? 1.08 : 1,
        }}
        transition={{ duration: hover ? 0.6 : 0.3 }}
      >
        <span style={{ fontWeight: 800, fontSize: 22 }}>{n}</span>
        {/* Pulse ring */}
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-[#E8450A]"
          animate={{ scale: [1, 1.6, 1.6], opacity: [0.6, 0, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: delay + 0.5 }}
        />
        {/* Connector line trailing right */}
        <motion.span
          aria-hidden
          className="hidden md:block absolute left-full top-1/2 h-[2px] -translate-y-1/2"
          style={{
            background:
              "repeating-linear-gradient(90deg, #E8450A 0 6px, transparent 6px 12px)",
            width: 90,
          }}
          initial={{ scaleX: 0, transformOrigin: "left" }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.3, duration: 0.6 }}
        />
      </motion.div>

      <motion.h3
        className="relative"
        style={{ fontWeight: 700, fontSize: 22, color: "#1A1A1A" }}
        animate={{ x: hover ? 2 : 0 }}
      >
        {title}
      </motion.h3>
      <p style={{ color: "#555555" }} className="relative mt-2">
        {desc}
      </p>

    </motion.div>
  );
}
