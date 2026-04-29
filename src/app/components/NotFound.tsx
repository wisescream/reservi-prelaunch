import React from "react";
import { ArrowRight, AlertTriangle, Sparkles } from "lucide-react";
import { motion } from "motion/react";

type Page = "home" | "features" | "restaurants" | "about" | "contact" | "waitlist" | "partner";

export function NotFoundPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const fadeUp = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0B0B0F] text-white overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#6366F1]/10 blur-[160px] pointer-events-none animate-pulse delay-700" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="mx-auto mb-6 w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md"
        >
          <AlertTriangle className="w-12 h-12 text-primary animate-bounce" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-8xl md:text-9xl font-extrabold tracking-tighter bg-gradient-to-r from-white via-white/90 to-white/40 bg-clip-text text-transparent"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-2xl md:text-3xl font-bold mt-4 bg-gradient-to-r from-primary to-[#818CF8] bg-clip-text text-transparent"
        >
          Destination Unknown
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-white/60 mt-6 text-lg leading-relaxed"
        >
          We couldn't find the table you're looking for. It looks like this page has been moved or no longer exists.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => onNavigate("home")}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary text-[#0B0B0F] font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all duration-300 cursor-pointer shadow-lg shadow-primary/25 group"
          >
            Return to Homepage
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
