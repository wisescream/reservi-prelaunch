import { TrendingUp, Settings, Shield, BarChart3 } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Navbar, PrimaryButton, SecondaryButton, Footer, Page, useTranslation } from "./shared";
import { ImageWithFallback } from "./ui/ImageWithFallback";
import { motion } from "motion/react";
import { AliveFeatureCard } from "./alive";
import { StepCard } from "./step-card";

const managerPhoto = "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=900";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" },
};

export function RestaurantsPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const { t, lang } = useTranslation();
  const chartData = [{ v: 10 }, { v: 16 }, { v: 12 }, { v: 22 }, { v: 18 }, { v: 28 }, { v: 32 }];

  const hero = lang === "ar" ? {
    title: "املأ المزيد من الطاولات. أسعد ضيوفك. طور ",
    accent: "عملك",
    desc: "تساعد منصة Reservi المطاعم على جذب الرواد وإدارة الحجوزات دون عناء وفتح آفاق حقيقية للنمو.",
    btn1: "كن شريكاً",
    btn2: "اعرف المزيد",
    overview: "نظرة عامة اليوم",
    bookings: "حجوزات",
    guests: "رواد",
    revenue: "الإيرادات",
  } : lang === "fr" ? {
    title: "Plus de tables. Plus de convives. Boostez votre ",
    accent: "activité",
    desc: "Reservi aide les restaurants à attirer de nouveaux clients, à gérer l'activité et à générer de la croissance.",
    btn1: "Devenir Partenaire",
    btn2: "En savoir plus",
    overview: "Aperçu du jour",
    bookings: "Réservations",
    guests: "Convives",
    revenue: "Revenus",
  } : {
    title: "Fill more tables. Delight more guests. Grow your ",
    accent: "business",
    desc: "Reservi helps restaurants attract diners, manage bookings effortlessly, and unlock real growth.",
    btn1: "Partner With Us",
    btn2: "Learn More",
    overview: "Today's overview",
    bookings: "Bookings",
    guests: "Guests",
    revenue: "Revenue",
  };

  const features = lang === "ar" ? [
    { icon: <TrendingUp size={26} />, title: "المزيد من الحجوزات", desc: "الوصول إلى الرواد الذين يبحثون بنشاط عن حجز." },
    { icon: <Settings size={26} />, title: "إدارة سهلة", desc: "قم بإدارة الطاولات من لوحة تحكم موحدة." },
    { icon: <Shield size={26} />, title: "تقليل عدم الحضور", desc: "التذكيرات والودائع الذكية تقلل الخسائر." },
    { icon: <BarChart3 size={26} />, title: "تحليلات مفيدة", desc: "افهم روادك وأوقات الذروة والتوجهات." },
  ] : lang === "fr" ? [
    { icon: <TrendingUp size={26} />, title: "Plus de clients", desc: "Touchez les gourmets prêts à réserver." },
    { icon: <Settings size={26} />, title: "Gestion aisée", desc: "Organisez vos tables depuis un panneau central." },
    { icon: <Shield size={26} />, title: "Moins d'absences", desc: "Rappels automatiques pour limiter les pertes." },
    { icon: <BarChart3 size={26} />, title: "Analyses précises", desc: "Suivez vos pics d'affluence et vos tendances." },
  ] : [
    { icon: <TrendingUp size={26} />, title: "More bookings", desc: "Reach diners actively looking to book." },
    { icon: <Settings size={26} />, title: "Easy management", desc: "Manage tables from a single dashboard." },
    { icon: <Shield size={26} />, title: "Reduce no-shows", desc: "Smart reminders and deposits cut losses." },
    { icon: <BarChart3 size={26} />, title: "Insights that help", desc: "Understand guests, busy nights, and trends." },
  ];

  const steps = lang === "ar" ? [
    { n: 1, title: "انضم إلى Reservi", desc: "سجل مطعمك في دقائق - بدون رسوم إعداد." },
    { n: 2, title: "احصل على حجوزات", desc: "احجز مكانك حيث يبحث الرواد الجائعون بنشاط." },
    { n: 3, title: "أدر حجوزاتك بسهولة", desc: "أدر الطاولات والضيوف من مكان واحد." },
    { n: 4, title: "طور عملك", desc: "استخدم التحليلات في الوقت الفعلي لاتخاذ قرارات أفضل." },
  ] : lang === "fr" ? [
    { n: 1, title: "Inscrivez-vous", desc: "Enregistrez votre établissement sans frais d'entrée." },
    { n: 2, title: "Attirez du monde", desc: "Soyez visible pour les clients qui cherchent où manger." },
    { n: 3, title: "Pilotez sans accroc", desc: "Gérez les tables et le service en quelques clics." },
    { n: 4, title: "Progressez", desc: "Prenez les bonnes décisions grâce aux rapports." },
  ] : [
    { n: 1, title: "Join Reservi", desc: "Sign up your restaurant in minutes — no setup fees." },
    { n: 2, title: "Get more bookings", desc: "Show up where hungry diners are actively searching." },
    { n: 3, title: "Manage with ease", desc: "Run reservations, floors, and guests from one place." },
    { n: 4, title: "Grow your business", desc: "Use real-time analytics to make better decisions." },
  ];

  return (
    <>
      <Navbar current="restaurants" onNavigate={onNavigate} />
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <h1 style={{ fontWeight: 800, fontSize: 52, lineHeight: 1.1, color: "#1A1A1A" }}>
              {hero.title}<span style={{ color: "#E8450A" }}>{hero.accent}</span>.
            </h1>
            <p style={{ color: "#555555", fontSize: 18 }} className="mt-5">
              {hero.desc}
            </p>
            <div className="mt-8 flex gap-4">
              <PrimaryButton onClick={() => onNavigate("partner")}>{hero.btn1}</PrimaryButton>
              <SecondaryButton onClick={() => onNavigate("features")}>{hero.btn2}</SecondaryButton>
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
              <div style={{ fontWeight: 700, color: "#1A1A1A" }} className="mb-3">{hero.overview}</div>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div><div style={{ fontWeight: 700, color: "#E8450A" }}>32</div><div style={{ fontSize: 12, color: "#555" }}>{hero.bookings}</div></div>
                <div><div style={{ fontWeight: 700, color: "#E8450A" }}>68</div><div style={{ fontSize: 12, color: "#555" }}>{hero.guests}</div></div>
                <div><div style={{ fontWeight: 700, color: "#E8450A" }}>2840$</div><div style={{ fontSize: 12, color: "#555" }}>{hero.revenue}</div></div>
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
          <motion.h2 {...fadeUp} style={{ fontWeight: 800, fontSize: 40, color: "#1A1A1A" }} className="text-center mb-12">
            {lang === "ar" ? "لماذا تحب المطاعم Reservi" : lang === "fr" ? "Pourquoi les restaurants adorent Reservi" : "Why restaurants love Reservi"}
          </motion.h2>
          <div className="grid md:grid-cols-4 gap-6">
            {features.map((f, i) => <AliveFeatureCard key={f.title} icon={f.icon} title={f.title} description={f.desc} index={i} />)}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <motion.h2 {...fadeUp} style={{ fontWeight: 800, fontSize: 40, color: "#1A1A1A" }} className="text-center mb-14">
            {lang === "ar" ? "كيف يعمل؟" : lang === "fr" ? "Comment ça marche" : "How it works"}
          </motion.h2>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
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
          <h2 style={{ fontWeight: 800, fontSize: 36 }}>
            {lang === "ar" ? "جاهز لتطوير مطعمك؟" : lang === "fr" ? "Prêt à développer votre restaurant ?" : "Ready to grow your restaurant?"}
          </h2>
          <PrimaryButton onClick={() => onNavigate("contact")}>
            {lang === "ar" ? "كن شريكاً" : lang === "fr" ? "Devenir Partenaire" : "Partner With Us"}
          </PrimaryButton>
        </motion.div>
      </section>

      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-12 text-center" style={{ color: "#555555" }}>
          {lang === "ar" ? "هل لديك أسئلة؟ اتصل بفريقنا على " : lang === "fr" ? "Des questions ? Contactez notre équipe à " : "Have questions? Contact our team at "}
          <span style={{ color: "#E8450A", fontWeight: 600 }}>hello@reservi.com</span>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </>
  );
}
