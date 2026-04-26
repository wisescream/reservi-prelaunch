import { Phone, Clock, CheckCircle2 } from "lucide-react";
import { Navbar, PrimaryButton, SecondaryButton, PhoneMockup, EmailBanner, Footer, Page } from "./shared";
import { ImageWithFallback } from "./ui/ImageWithFallback";
import { motion } from "motion/react";
import { StepCard } from "./step-card";
import { SplitCard } from "./split-card";

const heroFood = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" },
};

export function HomePage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <>
      <Navbar current="home" onNavigate={onNavigate} />
      {/* Hero */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-3 py-1 rounded-full bg-[#FFF1EA] text-[#E8450A]"
              style={{ fontWeight: 600, fontSize: 13, letterSpacing: 1 }}
            >
              COMING SOON
            </motion.span>
            <h1 style={{ fontWeight: 800, fontSize: 56, lineHeight: 1.1, color: "#1A1A1A" }} className="mt-5">
              Book the best tables in{" "}
              <motion.span
                initial={{ backgroundSize: "0% 8px" }}
                animate={{ backgroundSize: "100% 8px" }}
                transition={{ delay: 0.6, duration: 0.8 }}
                style={{
                  color: "#E8450A",
                  backgroundImage: "linear-gradient(#FFE0D2,#FFE0D2)",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "0 90%",
                }}
              >
                seconds
              </motion.span>
            </h1>
            <p style={{ color: "#555555", fontSize: 18 }} className="mt-5">
              Reservi makes restaurant reservations effortless — discover, book, and dine without the hassle of phone calls or waiting.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <PrimaryButton onClick={() => onNavigate("waitlist")}>Get Early Access</PrimaryButton>
              <SecondaryButton onClick={() => onNavigate("features")}>Learn More</SecondaryButton>
            </div>
          </motion.div>
          <div className="flex justify-center">
            <PhoneMockup image={heroFood} fetchpriority="high" />
          </div>
        </div>
      </section>

      <EmailBanner />

      {/* Features strip */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20 grid md:grid-cols-3 gap-8">
          {[
            { icon: <Phone size={26} />, title: "No more phone calls", desc: "Skip the wait — reserve in just a tap." },
            { icon: <Clock size={26} />, title: "Real-time availability", desc: "See open tables instantly, anytime." },
            { icon: <CheckCircle2 size={26} />, title: "Confirmed instantly", desc: "Get booking confirmation in seconds." },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="text-center"
            >
              <motion.div whileHover={{ scale: 1.1, rotate: 6 }} className="w-14 h-14 rounded-full bg-[#FFF1EA] text-[#E8450A] grid place-items-center mx-auto mb-4">{f.icon}</motion.div>
              <h3 style={{ fontWeight: 700, fontSize: 20, color: "#1A1A1A" }} className="mb-2">{f.title}</h3>
              <p style={{ color: "#555555" }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#F5F5F5]">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <motion.h2 {...fadeUp} style={{ fontWeight: 800, fontSize: 40, color: "#1A1A1A" }} className="text-center mb-14">How it works</motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { n: 1, title: "Find a restaurant", desc: "Browse curated spots near you, filtered by mood, vibe, and table size." },
              { n: 2, title: "Book instantly", desc: "Pick a time, party size, and confirm in just a few taps." },
              { n: 3, title: "Show up & enjoy", desc: "Your table is ready the moment you walk in. No waiting, no calls." },
            ].map((s, i) => (
              <StepCard key={s.n} n={s.n} title={s.title} desc={s.desc} delay={i * 0.12} />
            ))}
          </div>
        </div>
      </section>

      {/* Split section */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20 grid md:grid-cols-4 gap-6">
          <SplitCard
            variant="diner"
            title="For diners"
            items={["Discover top restaurants", "Real-time table availability", "Instant confirmation"]}
            ctaLabel="Join Waitlist"
            onCta={() => onNavigate("waitlist")}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl overflow-hidden h-72 md:h-auto relative group"
          >
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900"
              alt="Restaurant"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              {...({ loading: "lazy" } as any)}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl overflow-hidden h-72 md:h-auto relative group"
          >
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=900"
              alt="Diner"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              {...({ loading: "lazy" } as any)}
            />
          </motion.div>
          <SplitCard
            variant="restaurant"
            title="For restaurants"
            items={["Fill more tables daily", "Reduce no-shows", "Insightful analytics"]}
            ctaLabel="Partner With Us"
            onCta={() => onNavigate("partner")}
          />
        </div>
      </section>

      {/* City launch */}
      <section className="bg-[#1A1A1A] text-white overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 py-16 text-center">
          <motion.h2 {...fadeUp} style={{ fontWeight: 800, fontSize: 36 }}>Launching soon in Casablanca</motion.h2>
          <motion.p {...fadeUp} className="text-white/70 mt-3">Joining a curated list of incredible restaurants.</motion.p>
          <div className="mt-10 relative overflow-hidden" style={{ maskImage: "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)" }}>
            <motion.div
              className="flex gap-16 whitespace-nowrap"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            >
              {[...Array(2)].flatMap((_, k) =>
                ["Bella Italia", "Sakura", "Verde", "Olive & Fig", "Maison", "Le Petit", "Nori House", "Casa Roja"].map((n) => (
                  <motion.div
                    key={n + k}
                    whileHover={{ scale: 1.08, color: "#E8450A" }}
                    className="opacity-80"
                    style={{ fontWeight: 700, fontSize: 22, letterSpacing: 1 }}
                  >
                    {n}
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
          <div className="mt-8 flex justify-center gap-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-[#E8450A]"
                animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.18 }}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </>
  );
}
