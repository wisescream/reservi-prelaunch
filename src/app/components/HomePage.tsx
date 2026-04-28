import { Phone, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { Navbar, PrimaryButton, SecondaryButton, PhoneMockup, EmailBanner, Footer, Page } from "./shared";
import { ImageWithFallback } from "./ui/ImageWithFallback";
import { motion } from "motion/react";
import { StepCard } from "./step-card";
import { SplitCard } from "./split-card";
import { useTranslation } from "../../lib/translations";
import { useState, useEffect } from "react";


const heroFood = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" },
};

export function HomePage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const { t, lang } = useTranslation();

  const [timeLeft, setTimeLeft] = useState({ days: 20, hours: 0, minutes: 0, seconds: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const targetDate = new Date("2026-05-18T18:19:19").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, []);


  const features = lang === "ar" ? [
    { icon: <Phone size={26} />, title: "وداعاً للمكالمات الهاتفية", desc: "تخطى الانتظار - احجز بنقرة واحدة." },
    { icon: <Clock size={26} />, title: "التوافر في الوقت الفعلي", desc: "شاهد الطاولات المتاحة فوراً وفي أي وقت." },
    { icon: <CheckCircle2 size={26} />, title: "تأكيد فوري", desc: "احصل على تأكيد الحجز في ثوانٍ." },
  ] : lang === "fr" ? [
    { icon: <Phone size={26} />, title: "Fini les appels", desc: "Évitez l'attente - réservez en un seul clic." },
    { icon: <Clock size={26} />, title: "Disponibilité réelle", desc: "Consultez les tables libres instantanément." },
    { icon: <CheckCircle2 size={26} />, title: "Confirmé immédiatement", desc: "Confirmation de réservation en quelques secondes." },
  ] : [
    { icon: <Phone size={26} />, title: "No more phone calls", desc: "Skip the wait — reserve in just a tap." },
    { icon: <Clock size={26} />, title: "Real-time availability", desc: "See open tables instantly, anytime." },
    { icon: <CheckCircle2 size={26} />, title: "Confirmed instantly", desc: "Get booking confirmation in seconds." },
  ];

  const steps = lang === "ar" ? [
    { n: 1, title: "ابحث عن مطعم", desc: "تصفح أفضل الأماكن بالقرب منك حسب الأجواء وحجم الطاولة." },
    { n: 2, title: "احجز فوراً", desc: "اختر الوقت والعدد، وقم بالتأكيد ببضع نقرات." },
    { n: 3, title: "احضر واستمتع", desc: "طاولتك جاهزة لحظة وصولك. لا انتظار ولا اتصالات." },
  ] : lang === "fr" ? [
    { n: 1, title: "Trouvez un restaurant", desc: "Découvrez des endroits sélectionnés selon vos envies." },
    { n: 2, title: "Réservez", desc: "Choisissez l'heure, la taille de votre groupe et confirmez en un clic." },
    { n: 3, title: "Venez & Profitez", desc: "Votre table est prête à votre arrivée. Ni attente, ni appels." },
  ] : [
    { n: 1, title: "Find a restaurant", desc: "Browse curated spots near you, filtered by mood, vibe, and table size." },
    { n: 2, title: "Book instantly", desc: "Pick a time, party size, and confirm in just a few taps." },
    { n: 3, title: "Show up & enjoy", desc: "Your table is ready the moment you walk in. No waiting, no calls." },
  ];

  return (
    <>
      <Navbar current="home" onNavigate={onNavigate} />
      {/* Hero */}
      <section 
        className="relative bg-cover bg-center text-white py-20 md:py-28" 
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80')` }}
      >
        <div className="absolute inset-0 bg-black/70 z-0" />
        <div className="relative max-w-[1200px] mx-auto px-6 grid md:grid-cols-2 gap-12 items-center z-10">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-3 py-1 rounded-full bg-[#E8450A]/20 text-[#FF7A45]"
              style={{ fontWeight: 600, fontSize: 13, letterSpacing: 1 }}
            >
              {lang === "ar" ? "قريباً" : lang === "fr" ? "BIENTÔT DISPONIBLE" : "COMING SOON"}
            </motion.span>
            <h1 style={{ fontWeight: 800, fontSize: 56, lineHeight: 1.1, color: "#FFFFFF" }} className="mt-5">
              {t("hero_title")}
            </h1>
            <p style={{ color: "#E5E7EB", fontSize: 18 }} className="mt-5">
              {t("hero_desc")}
            </p>

            {isMounted && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 grid grid-cols-4 gap-3 max-w-sm"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/20">
                  <span className="block text-2xl font-bold text-[#FF7A45]">{timeLeft.days}</span>
                  <span className="text-xs font-medium text-gray-300">{lang === "ar" ? "أيام" : lang === "fr" ? "Jours" : "Days"}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/20">
                  <span className="block text-2xl font-bold text-[#FF7A45]">{timeLeft.hours}</span>
                  <span className="text-xs font-medium text-gray-300">{lang === "ar" ? "ساعات" : lang === "fr" ? "Heures" : "Hours"}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/20">
                  <span className="block text-2xl font-bold text-[#FF7A45]">{timeLeft.minutes}</span>
                  <span className="text-xs font-medium text-gray-300">{lang === "ar" ? "دقائق" : lang === "fr" ? "Min" : "Min"}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/20">
                  <span className="block text-2xl font-bold text-[#FF7A45]">{timeLeft.seconds}</span>
                  <span className="text-xs font-medium text-gray-300">{lang === "ar" ? "ثواني" : lang === "fr" ? "Sec" : "Sec"}</span>
                </div>
              </motion.div>
            )}

            <div className="mt-8 flex items-center gap-4">
              <PrimaryButton onClick={() => onNavigate("waitlist")}>{t("join_waitlist")}</PrimaryButton>
              
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate("features")}
                className="group inline-flex items-center gap-2 text-white hover:text-[#FF7A45] transition-colors px-6 py-3 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm shadow-lg"
                style={{ fontWeight: 600 }}
              >
                {lang === "ar" ? "اعرف المزيد" : lang === "fr" ? "En savoir plus" : "Learn More"}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </motion.button>
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
          {features.map((f, i) => (
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
          <motion.h2 {...fadeUp} style={{ fontWeight: 800, fontSize: 40, color: "#1A1A1A" }} className="text-center mb-14">
            {lang === "ar" ? "كيف يعمل؟" : lang === "fr" ? "Comment ça marche" : "How it works"}
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
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
            title={lang === "ar" ? "للرواد" : lang === "fr" ? "Pour les Gourmets" : "For diners"}
            items={lang === "ar" ? ["اكتشف أفضل المطاعم", "توافر الطاولات في الوقت الفعلي", "تأكيد فوري"] : lang === "fr" ? ["Découvrez les meilleurs restaurants", "Disponibilité en temps réel", "Confirmation immédiate"] : ["Discover top restaurants", "Real-time table availability", "Instant confirmation"]}
            ctaLabel={t("join_waitlist")}
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
            title={t("for_restaurants")}
            items={lang === "ar" ? ["املأ المزيد من الطاولات يومياً", "قلل من حالات عدم الحضور", "تحليلات مفصلة"] : lang === "fr" ? ["Remplissez plus de tables", "Réduisez les absences", "Analyses détaillées"] : ["Fill more tables daily", "Reduce no-shows", "Insightful analytics"]}
            ctaLabel={lang === "ar" ? "كن شريكاً" : lang === "fr" ? "Devenir Partenaire" : "Partner With Us"}
            onCta={() => onNavigate("partner")}
          />
        </div>
      </section>

      {/* City launch */}
      <section className="bg-[#1A1A1A] text-white overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 py-16 text-center">
          <motion.h2 {...fadeUp} style={{ fontWeight: 800, fontSize: 36 }}>
            {lang === "ar" ? "قريباً في الدار البيضاء" : lang === "fr" ? "Lancement prochain à Casablanca" : "Launching soon in Casablanca"}
          </motion.h2>
          <motion.p {...fadeUp} className="text-white/70 mt-3">
            {lang === "ar" ? "الانضمام إلى قائمة مختارة بعناية من أفضل المطاعم." : lang === "fr" ? "Rejoignez une sélection exclusive de restaurants incroyables." : "Joining a curated list of incredible restaurants."}
          </motion.p>
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
