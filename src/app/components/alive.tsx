import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useInView, animate } from "motion/react";

export function TiltCard({
  children,
  className = "",
  intensity = 8,
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [intensity, -intensity]), { stiffness: 220, damping: 22 });
  const ry = useSpring(useTransform(mx, [0, 1], [-intensity, intensity]), { stiffness: 220, damping: 22 });
  const gx = useTransform(mx, [0, 1], ["0%", "100%"]);
  const gy = useTransform(my, [0, 1], ["0%", "100%"]);

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
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
      className={`relative ${className}`}
    >
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: useTransform([gx, gy] as any, ([x, y]: any) =>
            `radial-gradient(220px circle at ${x} ${y}, rgba(232,69,10,0.18), transparent 60%)`
          ),
          opacity: hover ? 1 : 0,
          transition: "opacity 0.25s",
        }}
      />
      {children}
    </motion.div>
  );
}

export function AliveFeatureCard({
  icon,
  title,
  description,
  index = 0,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  index?: number;
}) {
  return (
    <TiltCard>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: index * 0.08 }}
        whileHover={{ y: -6 }}
        className="relative h-full p-6 rounded-2xl border border-gray-200 bg-white overflow-hidden group"
      >
        <motion.div
          className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[#E8450A]/10 blur-2xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
        />
        <motion.div
          whileHover={{ rotate: 12, scale: 1.12 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative w-12 h-12 rounded-xl grid place-items-center mb-4 text-white"
          style={{
            background: "linear-gradient(135deg, #E8450A 0%, #ff6a30 100%)",
            boxShadow: "0 8px 18px rgba(232,69,10,0.35)",
          }}
        >
          {icon}
          <motion.span
            className="absolute inset-0 rounded-xl border-2 border-[#E8450A]"
            animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: index * 0.2 }}
          />
        </motion.div>
        <h3 className="relative" style={{ fontWeight: 700, color: "#1A1A1A", fontSize: 20 }}>
          {title}
        </h3>
        <p className="relative mt-2" style={{ color: "#555555" }}>
          {description}
        </p>
      </motion.div>
    </TiltCard>
  );
}

export function Counter({ to, suffix = "", prefix = "", duration = 1.6 }: { to: number; suffix?: string; prefix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setVal(v),
    });
    return () => c.stop();
  }, [inView, to, duration]);

  const display = to >= 1000 ? Math.round(val).toLocaleString() : to % 1 === 0 ? Math.round(val) : val.toFixed(1);
  return (
    <span ref={ref}>
      {prefix}{display}{suffix}
    </span>
  );
}

export function AliveValueCard({
  icon,
  title,
  description,
  index = 0,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  index?: number;
}) {
  return (
    <TiltCard intensity={6}>
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        whileHover={{ y: -4 }}
        className="relative bg-white border border-gray-100 rounded-2xl p-6 flex gap-4 items-start overflow-hidden"
      >
        <motion.div
          className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-[#E8450A]/10 blur-2xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, delay: index * 0.4 }}
        />
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.7 }}
          className="relative w-12 h-12 rounded-xl bg-[#FFF1EA] text-[#E8450A] grid place-items-center shrink-0"
        >
          {icon}
        </motion.div>
        <div className="relative">
          <h3 style={{ fontWeight: 700, fontSize: 20, color: "#1A1A1A" }} className="mb-1">{title}</h3>
          <p style={{ color: "#555555" }}>{description}</p>
        </div>
      </motion.div>
    </TiltCard>
  );
}

export function AlivePerkCard({
  icon,
  title,
  description,
  index = 0,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  index?: number;
}) {
  return (
    <TiltCard intensity={5}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.12, type: "spring", stiffness: 160 }}
        className="relative bg-white border border-gray-100 rounded-2xl p-7 text-center overflow-hidden group"
      >
        <motion.div
          className="absolute inset-x-0 -bottom-12 h-24 bg-[#E8450A]/10 blur-2xl"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto w-14 h-14 rounded-2xl text-white grid place-items-center mb-4"
          style={{
            background: "linear-gradient(135deg, #E8450A 0%, #ff6a30 100%)",
            boxShadow: "0 10px 22px rgba(232,69,10,0.35)",
          }}
        >
          {icon}
        </motion.div>
        <h3 className="relative" style={{ fontWeight: 700, fontSize: 20, color: "#E8450A" }}>{title}</h3>
        <p className="relative mt-2" style={{ color: "#555555" }}>{description}</p>
      </motion.div>
    </TiltCard>
  );
}

export function AlivePricingCard({
  name,
  price,
  per,
  desc,
  features,
  featured,
  onCta,
  index = 0,
}: {
  name: string;
  price: string;
  per: string;
  desc: string;
  features: string[];
  featured?: boolean;
  onCta: () => void;
  index?: number;
}) {
  return (
    <TiltCard intensity={featured ? 10 : 6}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.55 }}
        whileHover={{ y: -10 }}
        className={`relative rounded-2xl p-8 overflow-hidden ${featured ? "text-white" : "text-[#1A1A1A] bg-white border border-gray-200"}`}
        style={
          featured
            ? {
                background:
                  "linear-gradient(135deg, #1A1A1A 0%, #2a1a14 50%, #4a1c0a 100%)",
                boxShadow: "0 24px 50px rgba(232,69,10,0.25)",
              }
            : {}
        }
      >
        {featured && (
          <>
            <motion.div
              className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl"
              style={{ background: "rgba(232,69,10,0.5)" }}
              animate={{ x: [0, 20, 0], y: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#E8450A] text-white"
              style={{ fontSize: 12, fontWeight: 700 }}
            >
              MOST POPULAR
            </motion.div>
          </>
        )}
        <div className="relative">
          <div style={{ fontWeight: 700, fontSize: 22 }}>{name}</div>
          <div className="mt-4 flex items-baseline gap-1">
            <span style={{ fontWeight: 800, fontSize: 44 }}>{price}</span>
            <span className={featured ? "text-white/70" : "text-[#555]"}>{per}</span>
          </div>
          <p className={featured ? "text-white/80 mt-3" : "text-[#555] mt-3"}>{desc}</p>
          <ul className="mt-6 space-y-3">
            {features.map((f, i) => (
              <motion.li
                key={f}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + i * 0.06 }}
                className="flex gap-2 items-start"
              >
                <motion.span
                  whileHover={{ scale: 1.3, rotate: 360 }}
                  transition={{ duration: 0.4 }}
                  className="w-5 h-5 rounded-full bg-[#E8450A] grid place-items-center shrink-0 mt-0.5"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </motion.span>
                <span className={featured ? "text-white/90" : "text-[#1A1A1A]"}>{f}</span>
              </motion.li>
            ))}
          </ul>
          <motion.button
            onClick={onCta}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-cursor="button"
            className={`mt-7 w-full py-3 rounded-lg transition-colors relative overflow-hidden ${featured ? "bg-[#E8450A] hover:bg-[#c93a08] text-white" : "bg-[#1A1A1A] hover:bg-[#E8450A] text-white"}`}
            style={{ fontWeight: 600 }}
          >
            <span className="relative">Get started</span>
          </motion.button>
        </div>
      </motion.div>
    </TiltCard>
  );
}

export function AliveContactRow({
  icon,
  label,
  value,
  index = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ x: 6 }}
      className="flex gap-4 items-start group cursor-pointer"
    >
      <motion.div
        whileHover={{ rotate: 360, scale: 1.1 }}
        transition={{ duration: 0.5 }}
        className="w-11 h-11 rounded-xl bg-[#FFF1EA] text-[#E8450A] grid place-items-center shrink-0 group-hover:bg-[#E8450A] group-hover:text-white transition-colors"
      >
        {icon}
      </motion.div>
      <div>
        <div style={{ fontWeight: 600, color: "#1A1A1A" }}>{label}</div>
        <div style={{ color: "#555555" }} className="group-hover:text-[#E8450A] transition-colors">{value}</div>
      </div>
    </motion.div>
  );
}
