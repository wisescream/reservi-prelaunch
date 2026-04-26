import { motion } from "motion/react";
import { toast } from "sonner";
import { Check, Sparkles, TrendingUp, Calendar, Users, BarChart3, Shield, Zap, Star, ArrowRight } from "lucide-react";
import { Navbar, PrimaryButton, SecondaryButton, Footer, Page } from "./shared";
import { ImageWithFallback } from "./ui/ImageWithFallback";
import { triggerCursorSuccess } from "./cursor";
import { AliveFeatureCard, AlivePricingCard, Counter } from "./alive";
import { submitPartnerRequest } from "../../lib/firestore";
import { trackEvent } from "../../lib/analytics";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" },
};

export function PartnerPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const f = e.currentTarget as HTMLFormElement;
    const formData = new FormData(f);
    const restaurantName = formData.get("restaurantName") as string;
    const contactEmail = formData.get("contactEmail") as string;
    const yourName = formData.get("yourName") as string;
    const city = formData.get("city") as string;
    const tables = formData.get("tables") as string;
    const about = formData.get("about") as string;
    const phone = formData.get("phone") as string;

    if (!restaurantName || !contactEmail || !yourName || !city || !tables) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await submitPartnerRequest({
        restaurantName,
        contactEmail,
        yourName,
        city,
        tables,
        about,
        phone,
      });
      trackEvent("partner_click", {
        restaurant_name: restaurantName,
        contact_email: contactEmail,
        your_name: yourName,
      });
      toast.success("Application received!", { description: "We'll be in touch within 1 business day." });
      triggerCursorSuccess();
      f.reset();
    } catch (error) {
      toast.error("Failed to submit application. Please try again.");
      console.error(error);
    }
  };

  return (
    <>
      <Navbar current="restaurants" onNavigate={onNavigate} />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#1A1A1A] via-[#2a1a14] to-[#1A1A1A] text-white overflow-hidden">
        <motion.div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#E8450A]/30 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative max-w-[1200px] mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-block px-3 py-1 rounded-full bg-[#E8450A]/20 text-[#FF8A4D]" style={{ fontWeight: 600, fontSize: 13, letterSpacing: 1 }}>
              FOR RESTAURANT PARTNERS
            </span>
            <h1 style={{ fontWeight: 800, fontSize: 60, lineHeight: 1.05 }} className="mt-5">
              Partner with <span style={{ color: "#E8450A" }}>Reservi</span>. Fill every table.
            </h1>
            <p className="mt-5 text-white/80" style={{ fontSize: 18 }}>
              Join hundreds of restaurants using Reservi to attract new diners, automate bookings, and grow revenue — without the hassle.
            </p>
            <div className="mt-8 flex gap-4 items-center">
              <PrimaryButton onClick={() => document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" })}>
                Apply now
              </PrimaryButton>
              <SecondaryButton onClick={() => onNavigate("contact")}>Talk to sales</SecondaryButton>
            </div>
            <div className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-3">
                {["1438761681033-6461ffad8d80", "1507003211169-0a1dd7228f2d", "1544005313-94ddf0286df2", "1500648767791-00dcc994a43e"].map((id, i) => (
                  <motion.div
                    key={id}
                    initial={{ scale: 0, x: 20 }}
                    animate={{ scale: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1, type: "spring" }}
                    className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#1A1A1A]"
                  >
                    <ImageWithFallback src={`https://images.unsplash.com/photo-${id}?w=200`} alt="" className="w-full h-full object-cover" />
                  </motion.div>
                ))}
              </div>
              <div className="text-white/80" style={{ fontSize: 14 }}>
                <span className="text-white" style={{ fontWeight: 700 }}>500+</span> restaurants already partnered
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden h-[480px]">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900"
                alt="Restaurant"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating stats */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute top-6 -left-4 bg-white text-[#1A1A1A] rounded-xl shadow-2xl p-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-[#FFF1EA] text-[#E8450A] grid place-items-center">
                <TrendingUp size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 20 }}>+38%</div>
                <div style={{ fontSize: 12, color: "#555" }}>more bookings</div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute bottom-8 -right-4 bg-white text-[#1A1A1A] rounded-xl shadow-2xl p-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-[#FFF1EA] text-[#E8450A] grid place-items-center">
                <Star size={20} fill="#E8450A" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 20 }}>4.9/5</div>
                <div style={{ fontSize: 12, color: "#555" }}>partner rating</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="relative bg-[#E8450A] text-white overflow-hidden">
        <motion.div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2), transparent 40%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.2), transparent 40%)",
          }}
          animate={{ x: [-20, 20, -20] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative max-w-[1200px] mx-auto px-6 py-14 grid md:grid-cols-4 gap-8 text-center">
          {[
            { n: 500, suffix: "+", l: "Partner restaurants" },
            { n: 12, prefix: "$", suffix: "M+", l: "Revenue driven" },
            { n: 2.4, suffix: "M", l: "Diners reached" },
            { n: 2, prefix: "<", suffix: " min", l: "Setup time" },
          ].map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div style={{ fontWeight: 800, fontSize: 44 }}>
                <Counter to={s.n} prefix={s.prefix || ""} suffix={s.suffix} />
              </div>
              <div className="text-white/80 mt-1">{s.l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <motion.div {...fadeUp} className="text-center mb-14">
            <span style={{ fontWeight: 700, color: "#E8450A", letterSpacing: 2, fontSize: 13 }}>WHY PARTNER</span>
            <h2 style={{ fontWeight: 800, fontSize: 44, color: "#1A1A1A" }} className="mt-3">Built for the way you run a restaurant</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Users size={26} />, title: "Reach hungry diners", desc: "Get discovered by people actively booking nearby." },
              { icon: <Calendar size={26} />, title: "Smart booking calendar", desc: "Manage tables, parties, and turn times in one view." },
              { icon: <Shield size={26} />, title: "Reduce no-shows", desc: "Automated reminders and deposits cut no-shows by 60%." },
              { icon: <BarChart3 size={26} />, title: "Real-time analytics", desc: "Track covers, revenue, and guest behaviour live." },
              { icon: <Zap size={26} />, title: "Instant setup", desc: "Connect your floor plan and go live in minutes." },
              { icon: <Sparkles size={26} />, title: "Premium placements", desc: "Featured spots in the Reservi app for new partners." },
            ].map((b, i) => (
              <AliveFeatureCard key={b.title} icon={b.icon} title={b.title} description={b.desc} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-[#F5F5F5]">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 style={{ fontWeight: 800, fontSize: 44, color: "#1A1A1A" }}>Simple, fair pricing</h2>
            <p style={{ color: "#555555", fontSize: 17 }} className="mt-3">No long contracts. Cancel anytime.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Starter", price: "$0", per: "/mo", desc: "Perfect for small restaurants getting started.", features: ["Up to 50 bookings/mo", "Basic calendar", "Email support"], featured: false },
              { name: "Growth", price: "$99", per: "/mo", desc: "Scale your bookings with automation & analytics.", features: ["Unlimited bookings", "Smart reminders", "Real-time analytics", "Priority support"], featured: true },
              { name: "Premium", price: "Custom", per: "", desc: "Tailored for groups and high-volume venues.", features: ["Multi-location", "Custom integrations", "Dedicated CSM", "Featured placement"], featured: false },
            ].map((p, i) => (
              <AlivePricingCard
                key={p.name}
                index={i}
                name={p.name}
                price={p.price}
                per={p.per}
                desc={p.desc}
                features={p.features}
                featured={p.featured}
                onCta={() => document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" })}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-white">
        <div className="max-w-[1000px] mx-auto px-6 py-20 text-center">
          <motion.div {...fadeUp}>
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                >
                  <Star size={24} fill="#E8450A" stroke="#E8450A" />
                </motion.div>
              ))}
            </div>
            <p style={{ fontWeight: 600, fontSize: 28, color: "#1A1A1A", lineHeight: 1.4 }}>
              "Reservi filled tables on our slowest nights. Within 3 months, weeknight covers were up 42% — and our team finally stopped juggling phone calls."
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <ImageWithFallback src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200" alt="Owner" className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <div style={{ fontWeight: 700, color: "#1A1A1A" }}>Marco Rossi</div>
                <div style={{ fontSize: 14, color: "#555" }}>Owner, Bella Italia · Brooklyn</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Application form */}
      <section id="apply" className="bg-[#1A1A1A] text-white">
        <div className="max-w-[1200px] mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-start">
          <motion.div {...fadeUp}>
            <h2 style={{ fontWeight: 800, fontSize: 44, lineHeight: 1.1 }}>
              Ready to fill your tables?
            </h2>
            <p className="mt-4 text-white/80" style={{ fontSize: 17 }}>
              Tell us a bit about your restaurant and we'll set you up with a personalised demo within 24 hours.
            </p>
            <ul className="mt-8 space-y-3 text-white/90">
              {["Free 30-day trial — no credit card", "Personalised onboarding", "Cancel anytime"].map((t) => (
                <li key={t} className="flex gap-2 items-center">
                  <div className="w-6 h-6 rounded-full bg-[#E8450A] grid place-items-center"><Check size={14} /></div>
                  {t}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.form
            {...fadeUp}
            onSubmit={submit}
            className="bg-white text-[#1A1A1A] rounded-2xl p-8 space-y-4 shadow-2xl"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={{ fontWeight: 600 }}>Restaurant name</label>
                <input name="restaurantName" required className="mt-1 w-full px-4 py-3 rounded-lg bg-[#F5F5F5] outline-none focus:ring-2 focus:ring-[#E8450A]" placeholder="Bella Italia" />
              </div>
              <div>
                <label style={{ fontWeight: 600 }}>Your name</label>
                <input name="yourName" required className="mt-1 w-full px-4 py-3 rounded-lg bg-[#F5F5F5] outline-none focus:ring-2 focus:ring-[#E8450A]" placeholder="Marco" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={{ fontWeight: 600 }}>Email</label>
                <input name="contactEmail" required type="email" className="mt-1 w-full px-4 py-3 rounded-lg bg-[#F5F5F5] outline-none focus:ring-2 focus:ring-[#E8450A]" placeholder="you@restaurant.com" />
              </div>
              <div>
                <label style={{ fontWeight: 600 }}>Phone number</label>
                <input name="phone" required type="tel" className="mt-1 w-full px-4 py-3 rounded-lg bg-[#F5F5F5] outline-none focus:ring-2 focus:ring-[#E8450A]" placeholder="+1 (555) 000-0000" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={{ fontWeight: 600 }}>City</label>
                <input name="city" required className="mt-1 w-full px-4 py-3 rounded-lg bg-[#F5F5F5] outline-none focus:ring-2 focus:ring-[#E8450A]" placeholder="Brooklyn, NY" />
              </div>
              <div>
                <label style={{ fontWeight: 600 }}>Tables (capacity)</label>
                <select name="tables" className="mt-1 w-full px-4 py-3 rounded-lg bg-[#F5F5F5] outline-none focus:ring-2 focus:ring-[#E8450A]">
                  <option>1–10 tables</option>
                  <option>11–25 tables</option>
                  <option>26–50 tables</option>
                  <option>50+ tables</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontWeight: 600 }}>Tell us about your restaurant</label>
              <textarea name="about" rows={3} className="mt-1 w-full px-4 py-3 rounded-lg bg-[#F5F5F5] outline-none focus:ring-2 focus:ring-[#E8450A] resize-none" placeholder="Cuisine, vibe, anything we should know..." />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-cursor="submit"
              type="submit"
              className="w-full bg-[#E8450A] hover:bg-[#c93a08] text-white py-4 rounded-lg inline-flex items-center justify-center gap-2 transition-colors"
              style={{ fontWeight: 700 }}
            >
              Submit application <ArrowRight size={18} />
            </motion.button>
            <p style={{ fontSize: 12, color: "#888" }} className="text-center">
              By submitting you agree to our terms and privacy policy.
            </p>
          </motion.form>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </>
  );
}
