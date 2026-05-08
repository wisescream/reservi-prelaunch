import { Clock, Sparkles, Zap, Settings, Star, Shield, Calendar, CheckCircle2, Heart } from "lucide-react";
import { Navbar, PhoneMockup, Footer, Page, useTranslation } from "./shared";
import { motion } from "motion/react";
import { AliveFeatureCard, Counter, TiltCard } from "./alive";

const heroFood = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" },
};

export function FeaturesPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const { t, lang } = useTranslation();
  const features = lang === "ar" ? [
    { icon: <Clock size={26} />, title: "التوافر في الوقت الفعلي", desc: "تحديثات حية للطاولات المتاحة فور الحجز." },
    { icon: <Sparkles size={26} />, title: "توصيات ذكية", desc: "اكتشف مطاعم مخصصة لتناسب ذوقك." },
    { icon: <Zap size={26} />, title: "تأكيد فوري", desc: "احصل على إشعار فور حجز طاولتك." },
    { icon: <Settings size={26} />, title: "إدارة سهلة", desc: "عدّل أو ألغِ حجزك بنقرة واحدة." },
    { icon: <Star size={26} />, title: "وصول حصري", desc: "أوقات حصرية للأعضاء وقوائم تذوق خاصة." },
    { icon: <Shield size={26} />, title: "آمن وموثوق", desc: "بياناتك ومعلومات الدفع آمنة دائماً." },
  ] : lang === "fr" ? [
    { icon: <Clock size={26} />, title: "Disponibilité réelle", desc: "Suivez les tables libres en direct." },
    { icon: <Sparkles size={26} />, title: "Recommandations", desc: "Découvrez des restaurants adaptés à vos goûts." },
    { icon: <Zap size={26} />, title: "Confirmation immédiate", desc: "Notification dès que la table est prête." },
    { icon: <Settings size={26} />, title: "Gestion facile", desc: "Modifiez votre réservation en un clic." },
    { icon: <Star size={26} />, title: "Accès exclusif", desc: "Créneaux membres et menus dégustation spéciaux." },
    { icon: <Shield size={26} />, title: "Sécurisé & Fiable", desc: "Paiements et données constamment protégés." },
  ] : [
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
          <motion.h2 initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ fontWeight: 800, fontSize: 48, color: "#1A1A1A", lineHeight: 1.15, willChange: "transform, opacity" }}>
            {lang === "ar" ? "كل ما تحتاجه لتجربة طعام مثالية" : lang === "fr" ? "Tout ce dont vous avez besoin pour une sortie réussie" : "Everything you need for the perfect dining experience"}
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
          <motion.h2 {...fadeUp} style={{ fontWeight: 800, fontSize: 40, color: "#1A1A1A", willChange: "transform, opacity" }} className="mb-12">
            {lang === "ar" ? "طريقة أفضل لتناول الطعام خارج المنزل" : lang === "fr" ? "Une meilleure façon de dîner" : "A better way to dine out"}
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {(lang === "ar" ? [
              { icon: <Calendar size={28} />, n: 1000, suffix: "+", l: "مطعم" },
              { icon: <CheckCircle2 size={28} />, n: 5000, suffix: "+", l: "حجز" },
              { icon: <Heart size={28} />, n: 98, suffix: "%", l: "رواد سعداء" },
            ] : lang === "fr" ? [
              { icon: <Calendar size={28} />, n: 1000, suffix: "+", l: "Restaurants" },
              { icon: <CheckCircle2 size={28} />, n: 5000, suffix: "+", l: "Réservations" },
              { icon: <Heart size={28} />, n: 98, suffix: "%", l: "Clients satisfaits" },
            ] : [
              { icon: <Calendar size={28} />, n: 1000, suffix: "+", l: "Restaurants" },
              { icon: <CheckCircle2 size={28} />, n: 5000, suffix: "+", l: "Reservations" },
              { icon: <Heart size={28} />, n: 98, suffix: "%", l: "Happy diners" },
            ]).map((s, i) => (
              <TiltCard key={s.l} intensity={6}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, type: "spring", stiffness: 140 }}
                  whileHover={{ y: -6 }}
                  className="relative bg-white border border-gray-100 rounded-2xl p-8 flex flex-col items-center overflow-hidden"
                  style={{ willChange: "transform" }}
                >
                  <motion.div
                    className="absolute inset-x-0 -bottom-12 h-24 bg-[#E8450A]/15 blur-2xl"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity }}
                    style={{ willChange: "transform" }}
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
