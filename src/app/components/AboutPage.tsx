import { Target, Eye, Heart, Play, Pause } from "lucide-react";
import { Navbar, Footer, Page, useTranslation } from "./shared";
import { ImageWithFallback } from "./ui/ImageWithFallback";
import { motion, AnimatePresence } from "motion/react";
import { AliveValueCard } from "./alive";
import { useState, useRef } from "react";

const restaurantVideo = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200";

export function AboutPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const { t, lang } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const story = lang === "ar" ? {
    label: "قصتنا",
    title: "لماذا قمنا ببناء Reservi",
    p1: "نؤمن بأن تناول الطعام في الخارج هو أحد أعظم مباهج الحياة - لحظة للتواصل والاحتفال والاستكشاف.",
    p2: "لكن طريقة حجز الطاولات لم تتطور. لذلك قمنا بإنشاء Reservi لجعل الحجوزات بسيطة وممتعة تماماً مثل الوجبات نفسها.",
    p3: "مهمتنا هي الجمع بين الناس والمطاعم - بسلاسة، وبشكل فوري وجميل.",
  } : lang === "fr" ? {
    label: "NOTRE HISTOIRE",
    title: "Pourquoi Reservi ?",
    p1: "Nous croyons que dîner au restaurant est l'un des plus grands plaisirs de la vie — pour se retrouver et célébrer.",
    p2: "Pourtant, réserver une table est parfois compliqué. Nous avons créé Reservi pour rendre les réservations simples et agréables.",
    p3: "Notre mission : rapprocher les gens et les restaurants avec élégance.",
  } : {
    label: "OUR STORY",
    title: "Why we built Reservi",
    p1: "We believe dining out is one of life's greatest joys — a moment to connect, celebrate, and explore.",
    p2: "But the way we book a table hasn't kept up. So we created Reservi to make reservations as simple and delightful as the meals themselves.",
    p3: "Our mission is to bring people and restaurants together — seamlessly, instantly, and beautifully.",
  };

  const values = lang === "ar" ? [
    { icon: <Target size={26} />, title: "مهمتنا", desc: "جعل الحجوزات سهلة للجميع بدون عناء." },
    { icon: <Eye size={26} />, title: "رؤيتنا", desc: "عالم تكون فيه الوجبات الرائعة على بعد نقرة واحدة." },
    { icon: <Heart size={26} />, title: "قيمنا", desc: "الضيافة والثقة والبهجة على كل طاولة." },
  ] : lang === "fr" ? [
    { icon: <Target size={26} />, title: "Notre Mission", desc: "Rendre les réservations simples pour tous." },
    { icon: <Eye size={26} />, title: "Notre Vision", desc: "Un monde où trouver la bonne table prend une seconde." },
    { icon: <Heart size={26} />, title: "Nos Valeurs", desc: "Hospitalité, confiance et bonheur partagé." },
  ] : [
    { icon: <Target size={26} />, title: "Our mission", desc: "Make reservations effortless for everyone." },
    { icon: <Eye size={26} />, title: "Our vision", desc: "A world where great meals are always one tap away." },
    { icon: <Heart size={26} />, title: "Our values", desc: "Hospitality, trust, and joy at every table." },
  ];

  return (
    <>
      <Navbar current="about" onNavigate={onNavigate} />
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <motion.span initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ fontWeight: 700, color: "#E8450A", letterSpacing: 2, fontSize: 13 }}>{story.label}</motion.span>
          <div className="mt-4 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 style={{ fontWeight: 800, fontSize: 44, color: "#1A1A1A", lineHeight: 1.15 }}>{story.title}</h2>
              <div className="mt-6 space-y-4" style={{ color: "#555555", fontSize: 17 }}>
                <p>{story.p1}</p>
                <p>{story.p2}</p>
                <p>{story.p3}</p>
              </div>
            </div>
            <div 
              data-cursor="image" 
              className="relative rounded-2xl overflow-hidden h-[440px] bg-[#1A1A1A] group cursor-pointer shadow-xl"
              onClick={() => {
                if (videoRef.current) {
                  if (isPlaying) {
                    videoRef.current.pause();
                    setIsPlaying(false);
                  } else {
                    videoRef.current.play();
                    setIsPlaying(true);
                  }
                }
              }}
            >
              <video 
                ref={videoRef}
                src={lang === "ar" || lang === "en" ? "/about-video-english.mp4" : "/about-video.mp4"} 
                className="w-full h-full object-cover transition-opacity duration-300" 
                style={{ opacity: isPlaying ? 1 : 0.7 }}
                loop 
                playsInline
              />
              <AnimatePresence>
                {!isPlaying && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 grid place-items-center bg-black/40 group-hover:bg-black/50 transition-colors"
                  >
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      animate={{ boxShadow: ["0 0 0 0 rgba(232,69,10,0.6)", "0 0 0 24px rgba(232,69,10,0)"] }}
                      transition={{ boxShadow: { duration: 1.6, repeat: Infinity } }}
                      className="w-20 h-20 rounded-full bg-[#E8450A] text-white grid place-items-center shadow-2xl"
                    >
                      <Play size={32} fill="white" />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {isPlaying && (
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm text-white grid place-items-center border border-white/10">
                    <Pause size={18} fill="white" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F5F5F5]">
        <div className="max-w-[1200px] mx-auto px-6 py-20 grid md:grid-cols-3 gap-6">
          {values.map((v, i) => (
            <AliveValueCard key={v.title} icon={v.icon} title={v.title} description={v.desc} index={i} />
          ))}
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </>
  );
}
