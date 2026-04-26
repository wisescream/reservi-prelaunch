import { motion } from "motion/react";
import { toast } from "sonner";
import { Check, Sparkles, TrendingUp, Calendar, Users, BarChart3, Shield, Zap, Star, ArrowRight } from "lucide-react";
import { Navbar, PrimaryButton, SecondaryButton, Footer, Page, useTranslation } from "./shared";
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
  const { t, lang } = useTranslation();

  const hero = lang === "ar" ? {
    tag: "لشركاء المطاعم",
    title: "كن شريكاً لـ ",
    accent: "Reservi",
    title2: ". املأ كل طاولة.",
    desc: "انضم إلى مئات المطاعم التي تستخدم Reservi لجذب رواد جدد، وأتمتة الحجوزات، وزيادة الإيرادات — بدون تعقيدات.",
    btn1: "قدم الآن",
    btn2: "تحدث للمبيعات",
    partnered: " مطعم شريك بالفعل",
    bookings: " حجوزات أكثر",
    rating: "تقييم الشركاء",
  } : lang === "fr" ? {
    tag: "POUR LES RESTAURATEURS",
    title: "Devenez partenaire ",
    accent: "Reservi",
    title2: ". Remplissez vos tables.",
    desc: "Rejoignez des centaines de restaurants qui font confiance à Reservi pour attirer des convives et booster leur chiffre.",
    btn1: "Postuler",
    btn2: "Contacter l'équipe",
    partnered: " établissements inscrits",
    bookings: " de réservations",
    rating: "note partenaires",
  } : {
    tag: "FOR RESTAURANT PARTNERS",
    title: "Partner with ",
    accent: "Reservi",
    title2: ". Fill every table.",
    desc: "Join hundreds of restaurants using Reservi to attract new diners, automate bookings, and grow revenue — without the hassle.",
    btn1: "Apply now",
    btn2: "Talk to sales",
    partnered: " restaurants already partnered",
    bookings: "more bookings",
    rating: "partner rating",
  };

  const perksTitle = lang === "ar" ? {
    tag: "لماذا تشترك؟",
    title: "مصممة للطريقة التي تدير بها مطعمك",
  } : lang === "fr" ? {
    tag: "POURQUOI NOUS ?",
    title: "Pensé pour votre gestion quotidienne",
  } : {
    tag: "WHY PARTNER",
    title: "Built for the way you run a restaurant",
  };

  const benefits = lang === "ar" ? [
    { icon: <Users size={26} />, title: "الوصول للرواد الجائعين", desc: "اكتشف من قبل الأشخاص الذين يبحثون بنشاط بالقرب منك." },
    { icon: <Calendar size={26} />, title: "تقويم حجز ذكي", desc: "إدارة الطاولات والحفلات وأوقات التدوير في عرض واحد." },
    { icon: <Shield size={26} />, title: "تقليل عدم الحضور", desc: "التذكيرات والودائع الآلية تقلل من عدم الحضور بنسبة 60٪." },
    { icon: <BarChart3 size={26} />, title: "تحليلات فورية", desc: "تتبع الأغطية والإيرادات وسلوك الضيف مباشرة." },
    { icon: <Zap size={26} />, title: "إعداد فوري", desc: "اربط مخطط الطابق الخاص بك وابدأ العمل في دقائق." },
    { icon: <Sparkles size={26} />, title: "أماكن مميزة", desc: "مواقع مميزة في تطبيق Reservi للشركاء الجدد." },
  ] : lang === "fr" ? [
    { icon: <Users size={26} />, title: "Captez les clients", desc: "Soyez visible par les gourmands à proximité." },
    { icon: <Calendar size={26} />, title: "Calendrier intelligent", desc: "Suivez les réservations et le turn-over en direct." },
    { icon: <Shield size={26} />, title: "Moins de 'No-shows'", desc: "Les rappels automatiques réduisent les oublis de 60%." },
    { icon: <BarChart3 size={26} />, title: "Suivi en temps réel", desc: "Observez les tendances et les revenus à la seconde." },
    { icon: <Zap size={26} />, title: "Installation express", desc: "Importez votre plan de salle en quelques minutes." },
    { icon: <Sparkles size={26} />, title: "Visibilité accrue", desc: "Emplacements premium offerts aux nouveaux inscrits." },
  ] : [
    { icon: <Users size={26} />, title: "Reach hungry diners", desc: "Get discovered by people actively booking nearby." },
    { icon: <Calendar size={26} />, title: "Smart booking calendar", desc: "Manage tables, parties, and turn times in one view." },
    { icon: <Shield size={26} />, title: "Reduce no-shows", desc: "Automated reminders and deposits cut no-shows by 60%." },
    { icon: <BarChart3 size={26} />, title: "Real-time analytics", desc: "Track covers, revenue, and guest behaviour live." },
    { icon: <Zap size={26} />, title: "Instant setup", desc: "Connect your floor plan and go live in minutes." },
    { icon: <Sparkles size={26} />, title: "Premium placements", desc: "Featured spots in the Reservi app for new partners." },
  ];

  const pricingTitle = lang === "ar" ? {
    title: "أسعار بسيطة وعادلة",
    desc: "لا عقود طويلة. قم بالإلغاء في أي وقت.",
  } : lang === "fr" ? {
    title: "Tarifs simples et clairs",
    desc: "Aucun engagement. Résiliable à tout moment.",
  } : {
    title: "Simple, fair pricing",
    desc: "No long contracts. Cancel anytime.",
  };

  const pricing = lang === "ar" ? [
    { name: "المبتدئ", price: "$0", per: "/شهر", desc: "مثالي للمطاعم الصغيرة التي بدأت للتو.", features: ["حتى 50 حجز/شهر", "تقويم أساسي", "دعم عبر البريد"], featured: false },
    { name: "النمو", price: "$99", per: "/شهر", desc: "قم بتوسيع حجوزاتك باستخدام الأتمتة والتحليلات.", features: ["حجوزات غير محدودة", "تذكيرات ذكية", "تحليلات فورية", "دعم ذو أولوية"], featured: true },
    { name: "المميز", price: "مخصص", per: "", desc: "مصمم للمجموعات والأماكن ذات الحجم الكبير.", features: ["مواقع متعددة", "تكاملات مخصصة", "مدير حساب مخصص", "إبراز مميز"], featured: false },
  ] : lang === "fr" ? [
    { name: "Starter", price: "0 €", per: "/mois", desc: "Parfait pour démarrer.", features: ["Jusqu'à 50 réservations/mois", "Calendrier simple", "Support mail"], featured: false },
    { name: "Croissance", price: "99 €", per: "/mois", desc: "Automatisez pour croître plus vite.", features: ["Réservations illimitées", "Rappels intelligents", "Analyses live", "Support premium"], featured: true },
    { name: "Premium", price: "Sur mesure", per: "", desc: "Pour les réseaux ou gros volumes.", features: ["Multi-établissements", "Intégrations CRM", "Conseiller dédié", "Mise en avant"], featured: false },
  ] : [
    { name: "Starter", price: "$0", per: "/mo", desc: "Perfect for small restaurants getting started.", features: ["Up to 50 bookings/mo", "Basic calendar", "Email support"], featured: false },
    { name: "Growth", price: "$99", per: "/mo", desc: "Scale your bookings with automation & analytics.", features: ["Unlimited bookings", "Smart reminders", "Real-time analytics", "Priority support"], featured: true },
    { name: "Premium", price: "Custom", per: "", desc: "Tailored for groups and high-volume venues.", features: ["Multi-location", "Custom integrations", "Dedicated CSM", "Featured placement"], featured: false },
  ];

  const testimonial = lang === "ar" ? {
    quote: `"نجحت Reservi في ملء الطاولات في أبطأ ليالينا. في غضون 3 أشهر، زادت حجوزات منتصف الأسبوع بنسبة 42٪ — وتوقف فريقنا أخيراً عن التوفيق بين المكالمات الهاتفية."`,
    author: "ماركو روسي",
    role: "المالك، بيلا إيطاليا · بروكلين",
  } : lang === "fr" ? {
    quote: `"Reservi a rempli nos tables les soirs creux. En 3 mois, l'activité a augmenté de 42 % — et le staff n'a plus à gérer les appels."`,
    author: "Marco Rossi",
    role: "Gérant, Bella Italia · Brooklyn",
  } : {
    quote: `"Reservi filled tables on our slowest nights. Within 3 months, weeknight covers were up 42% — and our team finally stopped juggling phone calls."`,
    author: "Marco Rossi",
    role: "Owner, Bella Italia · Brooklyn",
  };

  const applySection = lang === "ar" ? {
    title: "جاهز لملء طاولاتك؟",
    desc: "أخبرنا قليلاً عن مطعمك وسنقوم بإعداد عرض توضيحي مخصص لك في غضون 24 ساعة.",
    points: ["تجربة مجانية لمدة 30 يوماً - بدون بطاقة ائتمان", "توجيه مخصص", "إلغاء في أي وقت"],
    agreement: "من خلال التقديم فإنك توافق على شروطنا وسياسة الخصوصية.",
    btn: "إرسال الطلب",
  } : lang === "fr" ? {
    title: "Envie d'optimiser votre salle ?",
    desc: "Dites-nous en plus. Nous programmerons une démo adaptée sous 24h.",
    points: ["Essai gratuit 30 jours", "Assistance au démarrage", "Sans engagement"],
    agreement: "En postulant, vous acceptez nos conditions générales.",
    btn: "Envoyer le dossier",
  } : {
    title: "Ready to fill your tables?",
    desc: "Tell us a bit about your restaurant and we'll set you up with a personalised demo within 24 hours.",
    points: ["Free 30-day trial — no credit card", "Personalised onboarding", "Cancel anytime"],
    agreement: "By submitting you agree to our terms and privacy policy.",
    btn: "Submit application",
  };

  const formLabels = lang === "ar" ? {
    name: "اسم المطعم",
    yourName: "اسمك",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    city: "المدينة",
    capacity: "الطاولات (السعة)",
    about: "أخبرنا عن مطعمك",
    select1: "1-10 طاولات",
    select2: "11-25 طاولة",
    select3: "26-50 طاولة",
    select4: "50+ طاولة",
  } : lang === "fr" ? {
    name: "Nom du restaurant",
    yourName: "Votre nom",
    email: "Email",
    phone: "Téléphone",
    city: "Ville",
    capacity: "Nombre de tables",
    about: "Parlez-nous de votre restaurant",
    select1: "1-10 tables",
    select2: "11-25 tables",
    select3: "26-50 tables",
    select4: "50+ tables",
  } : {
    name: "Restaurant name",
    yourName: "Your name",
    email: "Email",
    phone: "Phone number",
    city: "City",
    capacity: "Tables (capacity)",
    about: "Tell us about your restaurant",
    select1: "1-10 tables",
    select2: "11-25 tables",
    select3: "26-50 tables",
    select4: "50+ tables",
  };

  const stats = lang === "ar" ? [
    { n: 500, suffix: "+", l: "مطعم شريك" },
    { n: 12, prefix: "$", suffix: "مليون+", l: "إيرادات محققة" },
    { n: 2.4, suffix: "مليون", l: "وصول للرواد" },
    { n: 2, prefix: "<", suffix: " دقائق", l: "وقت الإعداد" },
  ] : lang === "fr" ? [
    { n: 500, suffix: "+", l: "Établissements partenaires" },
    { n: 12, prefix: "$", suffix: "M+", l: "Chiffre généré" },
    { n: 2.4, suffix: "M", l: "Clients touchés" },
    { n: 2, prefix: "<", suffix: " min", l: "Temps d'installation" },
  ] : [
    { n: 500, suffix: "+", l: "Partner restaurants" },
    { n: 12, prefix: "$", suffix: "M+", l: "Revenue driven" },
    { n: 2.4, suffix: "M", l: "Diners reached" },
    { n: 2, prefix: "<", suffix: " min", l: "Setup time" },
  ];

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
      toast.error(lang === "ar" ? "يرجى ملء جميع الحقول المطلوبة" : lang === "fr" ? "Veuillez remplir tous les champs obligatoires" : "Please fill in all required fields");
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
      toast.success(
        lang === "ar" ? "تم استلام طلبك!" : lang === "fr" ? "Dossier envoyé !" : "Application received!", 
        { description: lang === "ar" ? "سنتصل بك خلال يوم عمل واحد." : lang === "fr" ? "Nous reviendrons vers vous sous 24 heures." : "We'll be in touch within 1 business day." }
      );
      triggerCursorSuccess();
      f.reset();
    } catch (error) {
      toast.error(lang === "ar" ? "فشل في إرسال الطلب. حاول مرة أخرى." : lang === "fr" ? "Échec de l'envoi. Veuillez réessayer." : "Failed to submit application. Please try again.");
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
              {hero.tag}
            </span>
            <h1 style={{ fontWeight: 800, fontSize: 60, lineHeight: 1.05 }} className="mt-5">
              {hero.title}<span style={{ color: "#E8450A" }}>{hero.accent}</span>{hero.title2}
            </h1>
            <p className="mt-5 text-white/80" style={{ fontSize: 18 }}>
              {hero.desc}
            </p>
            <div className="mt-8 flex gap-4 items-center">
              <PrimaryButton onClick={() => document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" })}>
                {hero.btn1}
              </PrimaryButton>
              <SecondaryButton onClick={() => onNavigate("contact")}>{hero.btn2}</SecondaryButton>
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
                <span className="text-white" style={{ fontWeight: 700 }}>500+</span>{hero.partnered}
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
                <div style={{ fontSize: 12, color: "#555" }}>{hero.bookings}</div>
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
                <div style={{ fontSize: 12, color: "#555" }}>{hero.rating}</div>
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
          {stats.map((s, i) => (
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
            <span style={{ fontWeight: 700, color: "#E8450A", letterSpacing: 2, fontSize: 13 }}>{perksTitle.tag}</span>
            <h2 style={{ fontWeight: 800, fontSize: 44, color: "#1A1A1A" }} className="mt-3">{perksTitle.title}</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <AliveFeatureCard key={b.title} icon={b.icon} title={b.title} description={b.desc} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-[#F5F5F5]">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 style={{ fontWeight: 800, fontSize: 44, color: "#1A1A1A" }}>{pricingTitle.title}</h2>
            <p style={{ color: "#555555", fontSize: 17 }} className="mt-3">{pricingTitle.desc}</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {pricing.map((p, i) => (
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
              {testimonial.quote}
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <ImageWithFallback src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200" alt="Owner" className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <div style={{ fontWeight: 700, color: "#1A1A1A" }}>{testimonial.author}</div>
                <div style={{ fontSize: 14, color: "#555" }}>{testimonial.role}</div>
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
              {applySection.title}
            </h2>
            <p className="mt-4 text-white/80" style={{ fontSize: 17 }}>
              {applySection.desc}
            </p>
            <ul className="mt-8 space-y-3 text-white/90">
              {applySection.points.map((t) => (
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
                <label style={{ fontWeight: 600 }}>{formLabels.name}</label>
                <input name="restaurantName" required className="mt-1 w-full px-4 py-3 rounded-lg bg-[#F5F5F5] outline-none focus:ring-2 focus:ring-[#E8450A]" placeholder={formLabels.name} />
              </div>
              <div>
                <label style={{ fontWeight: 600 }}>{formLabels.yourName}</label>
                <input name="yourName" required className="mt-1 w-full px-4 py-3 rounded-lg bg-[#F5F5F5] outline-none focus:ring-2 focus:ring-[#E8450A]" placeholder={formLabels.yourName} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={{ fontWeight: 600 }}>{formLabels.email}</label>
                <input name="contactEmail" required type="email" className="mt-1 w-full px-4 py-3 rounded-lg bg-[#F5F5F5] outline-none focus:ring-2 focus:ring-[#E8450A]" placeholder={formLabels.email} />
              </div>
              <div>
                <label style={{ fontWeight: 600 }}>{formLabels.phone}</label>
                <input name="phone" required type="tel" className="mt-1 w-full px-4 py-3 rounded-lg bg-[#F5F5F5] outline-none focus:ring-2 focus:ring-[#E8450A]" placeholder={formLabels.phone} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={{ fontWeight: 600 }}>{formLabels.city}</label>
                <input name="city" required className="mt-1 w-full px-4 py-3 rounded-lg bg-[#F5F5F5] outline-none focus:ring-2 focus:ring-[#E8450A]" placeholder={formLabels.city} />
              </div>
              <div>
                <label style={{ fontWeight: 600 }}>{formLabels.capacity}</label>
                <select name="tables" className="mt-1 w-full px-4 py-3 rounded-lg bg-[#F5F5F5] outline-none focus:ring-2 focus:ring-[#E8450A]">
                  <option>{formLabels.select1}</option>
                  <option>{formLabels.select2}</option>
                  <option>{formLabels.select3}</option>
                  <option>{formLabels.select4}</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontWeight: 600 }}>{formLabels.about}</label>
              <textarea name="about" rows={3} className="mt-1 w-full px-4 py-3 rounded-lg bg-[#F5F5F5] outline-none focus:ring-2 focus:ring-[#E8450A] resize-none" placeholder={formLabels.about} />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-cursor="submit"
              type="submit"
              className="w-full bg-[#E8450A] hover:bg-[#c93a08] text-white py-4 rounded-lg inline-flex items-center justify-center gap-2 transition-colors"
              style={{ fontWeight: 700 }}
            >
              {applySection.btn} <ArrowRight size={18} />
            </motion.button>
            <p style={{ fontSize: 12, color: "#888" }} className="text-center">
              {applySection.agreement}
            </p>
          </motion.form>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </>
  );
}
