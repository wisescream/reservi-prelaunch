import { Mail, Sparkles, Star, Zap } from "lucide-react";
import { Navbar, EmailJoin, Footer, Page } from "./shared";
import { ImageWithFallback } from "./ui/ImageWithFallback";
import { motion } from "motion/react";
import { AlivePerkCard } from "./alive";

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
