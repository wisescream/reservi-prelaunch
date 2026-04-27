import { Phone, Clock, CheckCircle2, Calendar, Sparkles, Zap, Settings, Star, Shield, TrendingUp, Users, DollarSign, BarChart3, Target, Eye, Heart, Mail, MapPin, Instagram, Facebook, Linkedin, Twitter, Play } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Navbar, PrimaryButton, SecondaryButton, PhoneMockup, FeatureCard, StepCircle, EmailJoin, EmailBanner, Footer, Page } from "./shared";
import { ImageWithFallback } from "./ui/ImageWithFallback";
import { motion } from "motion/react";
import { toast } from "sonner";
import { triggerCursorSuccess } from "./cursor";
import { submitContactMessage } from "../../lib/firestore";
import { trackEvent } from "../../lib/analytics";
import { StepCard } from "./step-card";
import { SplitCard } from "./split-card";
import { AliveFeatureCard, AliveValueCard, AlivePerkCard, AliveContactRow, Counter, TiltCard } from "./alive";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" },
};

const heroFood = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900";
const womanPhoto = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600";
const manPhoto = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600";
const managerPhoto = "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=900";
const restaurantVideo = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200";

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
            <PhoneMockup image={heroFood} />
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
            data-cursor="image" className="rounded-2xl overflow-hidden h-72 md:h-auto relative group"
          >
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900"
              alt="Restaurant"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            data-cursor="image" className="rounded-2xl overflow-hidden h-72 md:h-auto relative group"
          >
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=900"
              alt="Diner"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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

export function FeaturesPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const features = [
    { icon: <Clock size={26} />, title: "Real-time availability", desc: "See open tables update live as guests book." },
    { icon: <Sparkles size={26} />, title: "Smart recommendations", desc: "Discover restaurants tailored to your taste." },
    { icon: <Zap size={26} />, title: "Instant confirmation", desc: "Get notified the moment your table is set." },
    { icon: <Settings size={26} />, title: "Easy management", desc: "Modify or cancel your booking with one tap." },
    { icon: <Star size={26} />, title: "Exclusive access", desc: "Members-only times and special tasting menus." },
    { icon: <Shield size={26} />, title: "Secure & reliable", desc: "Your data and payment info are always safe." },
  ];
  return (
    <>
      <Navbar current="features" onNavigate={onNavigate} />
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <motion.h2 initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ fontWeight: 800, fontSize: 48, color: "#1A1A1A", lineHeight: 1.15 }}>
            Everything you need for the perfect dining experience
          </motion.h2>
          <div className="relative h-[520px]">
            <div className="absolute left-0 top-6"><PhoneMockup image={heroFood} /></div>
            <div className="absolute left-32 top-0 hidden md:block"><PhoneMockup image="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600" /></div>
            <div className="absolute left-64 top-12 hidden lg:block"><PhoneMockup image="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600" /></div>
          </div>
        </div>
      </section>

      <section className="bg-[#F5F5F5]">
        <div className="max-w-[1200px] mx-auto px-6 py-20 grid md:grid-cols-3 gap-6">
          {features.map((f, i) => <AliveFeatureCard key={f.title} icon={f.icon} title={f.title} description={f.desc} index={i} />)}
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20 text-center">
          <motion.h2 {...fadeUp} style={{ fontWeight: 800, fontSize: 40, color: "#1A1A1A" }} className="mb-12">A better way to dine out</motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Calendar size={28} />, n: 1000, suffix: "+", l: "Restaurants" },
              { icon: <CheckCircle2 size={28} />, n: 5000, suffix: "+", l: "Reservations" },
              { icon: <Heart size={28} />, n: 98, suffix: "%", l: "Happy diners" },
            ].map((s, i) => (
              <TiltCard key={s.l} intensity={6}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, type: "spring", stiffness: 140 }}
                  whileHover={{ y: -6 }}
                  className="relative bg-white border border-gray-100 rounded-2xl p-8 flex flex-col items-center overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-x-0 -bottom-12 h-24 bg-[#E8450A]/15 blur-2xl"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity }}
                  />
                  <motion.div
                    whileHover={{ rotate: 12, scale: 1.15 }}
                    className="relative w-16 h-16 rounded-2xl text-white grid place-items-center mb-4"
                    style={{ background: "linear-gradient(135deg, #E8450A 0%, #ff6a30 100%)", boxShadow: "0 12px 24px rgba(232,69,10,0.35)" }}
                  >
                    {s.icon}
                  </motion.div>
                  <div className="relative" style={{ fontWeight: 800, fontSize: 44, color: "#E8450A" }}>
                    <Counter to={s.n} suffix={s.suffix} />
                  </div>
                  <div className="relative" style={{ color: "#555555" }}>{s.l}</div>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </>
  );
}

export function RestaurantsPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const chartData = [{ v: 10 }, { v: 16 }, { v: 12 }, { v: 22 }, { v: 18 }, { v: 28 }, { v: 32 }];
  return (
    <>
      <Navbar current="restaurants" onNavigate={onNavigate} />
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <h1 style={{ fontWeight: 800, fontSize: 52, lineHeight: 1.1, color: "#1A1A1A" }}>
              Fill more tables. Delight more guests. Grow your <span style={{ color: "#E8450A" }}>business</span>.
            </h1>
            <p style={{ color: "#555555", fontSize: 18 }} className="mt-5">
              Reservi helps restaurants attract diners, manage bookings effortlessly, and unlock real growth.
            </p>
            <div className="mt-8 flex gap-4">
              <PrimaryButton onClick={() => onNavigate("partner")}>Partner With Us</PrimaryButton>
              <SecondaryButton onClick={() => onNavigate("features")}>Learn More</SecondaryButton>
            </div>
          </motion.div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden h-[480px]">
              <ImageWithFallback src={managerPhoto} alt="Manager" className="w-full h-full object-cover" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 140 }}
              className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl p-5 w-72 border border-gray-100">
              <div style={{ fontWeight: 700, color: "#1A1A1A" }} className="mb-3">Today's overview</div>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div><div style={{ fontWeight: 700, color: "#E8450A" }}>32</div><div style={{ fontSize: 12, color: "#555" }}>Bookings</div></div>
                <div><div style={{ fontWeight: 700, color: "#E8450A" }}>68</div><div style={{ fontSize: 12, color: "#555" }}>Guests</div></div>
                <div><div style={{ fontWeight: 700, color: "#E8450A" }}>$2,840</div><div style={{ fontSize: 12, color: "#555" }}>Revenue</div></div>
              </div>
              <div className="h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <Line type="monotone" dataKey="v" stroke="#E8450A" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-[#F5F5F5]">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <motion.h2 {...fadeUp} style={{ fontWeight: 800, fontSize: 40, color: "#1A1A1A" }} className="text-center mb-12">Why restaurants love Reservi</motion.h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: <TrendingUp size={26} />, title: "More bookings", desc: "Reach diners actively looking to book." },
              { icon: <Settings size={26} />, title: "Easy management", desc: "Manage tables from a single dashboard." },
              { icon: <Shield size={26} />, title: "Reduce no-shows", desc: "Smart reminders and deposits cut losses." },
              { icon: <BarChart3 size={26} />, title: "Insights that help", desc: "Understand guests, busy nights, and trends." },
            ].map((f, i) => <AliveFeatureCard key={f.title} icon={f.icon} title={f.title} description={f.desc} index={i} />)}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <motion.h2 {...fadeUp} style={{ fontWeight: 800, fontSize: 40, color: "#1A1A1A" }} className="text-center mb-14">How it works</motion.h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { n: 1, title: "Join Reservi", desc: "Sign up your restaurant in minutes — no setup fees." },
              { n: 2, title: "Get more bookings", desc: "Show up where hungry diners are actively searching." },
              { n: 3, title: "Manage with ease", desc: "Run reservations, floors, and guests from one place." },
              { n: 4, title: "Grow your business", desc: "Use real-time analytics to make better decisions." },
            ].map((s, i) => (
              <StepCard key={s.n} n={s.n} title={s.title} desc={s.desc} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#8B1A00] text-white">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-[1200px] mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <h2 style={{ fontWeight: 800, fontSize: 36 }}>Ready to grow your restaurant?</h2>
          <PrimaryButton onClick={() => onNavigate("contact")}>Partner With Us</PrimaryButton>
        </motion.div>
      </section>

      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-12 text-center" style={{ color: "#555555" }}>
          Have questions? Contact our team at <span style={{ color: "#E8450A", fontWeight: 600 }}>admin@reservi-eat.ma</span>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </>
  );
}

export function AboutPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <>
      <Navbar current="about" onNavigate={onNavigate} />
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <motion.span initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ fontWeight: 700, color: "#E8450A", letterSpacing: 2, fontSize: 13 }}>OUR STORY</motion.span>
          <div className="mt-4 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 style={{ fontWeight: 800, fontSize: 44, color: "#1A1A1A", lineHeight: 1.15 }}>Why we built Reservi</h2>
              <div className="mt-6 space-y-4" style={{ color: "#555555", fontSize: 17 }}>
                <p>We believe dining out is one of life's greatest joys — a moment to connect, celebrate, and explore.</p>
                <p>But the way we book a table hasn't kept up. So we created Reservi to make reservations as simple and delightful as the meals themselves.</p>
                <p>Our mission is to bring people and restaurants together — seamlessly, instantly, and beautifully.</p>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden h-[440px] bg-[#1A1A1A]">
              <ImageWithFallback src={restaurantVideo} alt="Restaurant" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 grid place-items-center">
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ boxShadow: ["0 0 0 0 rgba(232,69,10,0.6)", "0 0 0 24px rgba(232,69,10,0)"] }}
                  transition={{ boxShadow: { duration: 1.6, repeat: Infinity } }}
                  className="w-20 h-20 rounded-full bg-[#E8450A] text-white grid place-items-center shadow-2xl"
                >
                  <Play size={32} fill="white" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F5F5F5]">
        <div className="max-w-[1200px] mx-auto px-6 py-20 grid md:grid-cols-3 gap-6">
          {[
            { icon: <Target size={26} />, title: "Our mission", desc: "Make reservations effortless for everyone." },
            { icon: <Eye size={26} />, title: "Our vision", desc: "A world where great meals are always one tap away." },
            { icon: <Heart size={26} />, title: "Our values", desc: "Hospitality, trust, and joy at every table." },
          ].map((v, i) => (
            <AliveValueCard key={v.title} icon={v.icon} title={v.title} description={v.desc} index={i} />
          ))}
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </>
  );
}

export function ContactPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <>
      <Navbar current="contact" onNavigate={onNavigate} />
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20 grid md:grid-cols-2 gap-12">
          <div>
            <h2 style={{ fontWeight: 800, fontSize: 44, color: "#1A1A1A" }}>Get in touch</h2>
            <p style={{ color: "#555555", fontSize: 17 }} className="mt-4">We'd love to hear from you. Fill out the form or reach us directly.</p>
            <div className="mt-10 space-y-6">
              {[
                { icon: <Mail size={20} />, label: "Email", value: "admin@reservi-eat.ma" },
                { icon: <Phone size={20} />, label: "Phone", value: "+212 784-115699" },
                { icon: <MapPin size={20} />, label: "Address", value: "Casablanca, Morocco" },
              ].map((c, i) => (
                <AliveContactRow key={c.label} icon={c.icon} label={c.label} value={c.value} index={i} />
              ))}
            </div>
            <div className="mt-10">
              <div style={{ fontWeight: 700, color: "#1A1A1A" }} className="mb-3">Follow us</div>
              <div className="flex gap-3">
                {[Instagram, Facebook, Linkedin, Twitter].map((Ic, i) => (
                  <a key={i} href="#" className="w-11 h-11 rounded-xl border border-gray-200 hover:border-[#E8450A] hover:text-[#E8450A] text-[#555] grid place-items-center transition-colors">
                    <Ic size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const f = e.currentTarget as HTMLFormElement;
                const formData = new FormData(f);
                const name = formData.get("name") as string;
                const email = formData.get("email") as string;
                const subject = formData.get("subject") as string;
                const message = formData.get("message") as string;

                if (!name || !email || !subject || !message) {
                  toast.error("Please fill in all fields");
                  return;
                }

                try {
                  await submitContactMessage({ name, email, subject, message });
                  trackEvent("cta_click", { action: "contact_form_submit", email });
                  toast.success("Message sent!", { description: "Our team will get back to you within 24 hours." });
                  triggerCursorSuccess();
                  f.reset();
                } catch (error) {
                  toast.error("Failed to send message. Please try again.");
                  console.error(error);
                }
              }}
              className="bg-[#F5F5F5] rounded-2xl p-8 space-y-4"
            >
              <div>
                <label style={{ fontWeight: 600, color: "#1A1A1A" }}>Name</label>
                <input name="name" required className="mt-1 w-full px-4 py-3 rounded-lg bg-white border border-gray-200 outline-none focus:border-[#E8450A]" placeholder="Your name" />
              </div>
              <div>
                <label style={{ fontWeight: 600, color: "#1A1A1A" }}>Email address</label>
                <input name="email" type="email" required className="mt-1 w-full px-4 py-3 rounded-lg bg-white border border-gray-200 outline-none focus:border-[#E8450A]" placeholder="you@example.com" />
              </div>
              <div>
                <label style={{ fontWeight: 600, color: "#1A1A1A" }}>Subject</label>
                <input name="subject" required className="mt-1 w-full px-4 py-3 rounded-lg bg-white border border-gray-200 outline-none focus:border-[#E8450A]" placeholder="How can we help?" />
              </div>
              <div>
                <label style={{ fontWeight: 600, color: "#1A1A1A" }}>Message</label>
                <textarea name="message" required rows={5} className="mt-1 w-full px-4 py-3 rounded-lg bg-white border border-gray-200 outline-none focus:border-[#E8450A] resize-none" placeholder="Write your message..." />
              </div>
              <PrimaryButton full>Send Message</PrimaryButton>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-[#F5F5F5]">
        <div className="max-w-[1200px] mx-auto px-6 py-16 grid md:grid-cols-3 gap-6">
          {[
            { icon: <Target size={24} />, title: "Our mission", desc: "Make reservations effortless." },
            { icon: <Eye size={24} />, title: "Our vision", desc: "Great meals one tap away." },
            { icon: <Heart size={24} />, title: "Our values", desc: "Hospitality at every table." },
          ].map((v, i) => (
            <AliveValueCard key={v.title} icon={v.icon} title={v.title} description={v.desc} index={i} />
          ))}
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </>
  );
}

export function WaitlistPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const avatars = [
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
  ];
  return (
    <>
      <Navbar current="waitlist" onNavigate={onNavigate} />
      <section className="bg-white">
        <div className="max-w-[800px] mx-auto px-6 py-24 text-center flex flex-col items-center">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 160, damping: 12 }}
            className="w-20 h-20 rounded-2xl bg-[#FFF1EA] text-[#E8450A] grid place-items-center"
          >
            <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <Mail size={36} />
            </motion.div>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ fontWeight: 800, fontSize: 48, color: "#1A1A1A" }} className="mt-6">You're one step away!</motion.h2>
          <p style={{ color: "#555555", fontSize: 18 }} className="mt-4 max-w-md">
            Join the Reservi waitlist and be the first to book the best tables in your city.
          </p>
          <div className="mt-8 w-full flex justify-center">
            <EmailJoin />
          </div>
          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {avatars.map((a, i) => (
                <div key={i} className="w-11 h-11 rounded-full overflow-hidden border-2 border-white">
                  <ImageWithFallback src={a} alt="user" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div style={{ color: "#555555" }}>Join <span style={{ color: "#1A1A1A", fontWeight: 700 }}>1,250+</span> others on the waitlist</div>
          </div>
        </div>
      </section>

      <section className="bg-[#F5F5F5]">
        <div className="max-w-[1200px] mx-auto px-6 py-16 grid md:grid-cols-3 gap-6">
          {[
            { icon: <Sparkles size={26} />, title: "Early access", desc: "Be first to use Reservi when we launch." },
            { icon: <Star size={26} />, title: "Exclusive offers", desc: "Get special perks at partner restaurants." },
            { icon: <Zap size={26} />, title: "Priority booking", desc: "Skip the line on the most-wanted tables." },
          ].map((p, i) => (
            <AlivePerkCard key={p.title} icon={p.icon} title={p.title} description={p.desc} index={i} />
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-8 text-center" style={{ color: "#888", fontSize: 13 }}>
          We respect your privacy. Unsubscribe anytime.
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </>
  );
}
