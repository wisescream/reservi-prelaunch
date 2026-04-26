import { motion } from "motion/react";

export function LoadingScreen() {
  // Stagger animation for each letter of "Reservi" except the 'i'
  const letters = ["R", "e", "s", "e", "r", "v"];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const letterVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", damping: 12, stiffness: 200 },
    },
  };

  return (
    <div dir="ltr" className="min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden select-none pointer-events-none">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative flex items-baseline text-black font-extrabold"
        style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontSize: "3.5rem", letterSpacing: "-0.02em" }}
      >
        {/* Standard Letters */}
        {letters.map((char, index) => (
          <motion.span key={index} variants={letterVariants}>
            {char}
          </motion.span>
        ))}

        {/* Animated 'i' block */}
        <motion.span
          variants={letterVariants}
          className="relative inline-block"
          style={{ width: "0.8rem", height: "2.1rem", verticalAlign: "baseline" }}
        >
          {/* Custom 'i' stem to eliminate the font's dot */}
          <div 
            className="bg-black mx-auto rounded-[1px]" 
            style={{ width: "9px", height: "2.1rem" }}
          />
          {/* Pin dropping with bounce */}
          {/* Wrapper for the pin to handle layout positioning safely without transform conflicts */}
          <div 
            className="absolute" 
            style={{ bottom: "2.1rem", left: "50%", transform: "translateX(-50%)" }}
          >
            {/* Pin dropping with bounce */}
            <motion.svg
              viewBox="0 0 24 24"
              className="w-9 h-9"
              initial={{ y: -180, opacity: 0, scale: 0.5 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                damping: 10,
                stiffness: 120,
                delay: 0.5,
              }}
            >
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                fill="#E8450A"
              />
              <circle cx="12" cy="9" r="2.5" fill="white" />
            </motion.svg>
          </div>
        </motion.span>
      </motion.div>

      {/* Slogan: BOOK YOUR TABLE */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
        className="text-black font-bold tracking-[0.28em] mt-8"
        style={{ fontSize: "0.85rem", fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
      >
        BOOK YOUR TABLE
      </motion.div>
    </div>
  );
}
