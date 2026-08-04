import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Orb } from "../orb/Orb.jsx";

export function HeroSection() {
  return (
    <motion.section
      className="relative z-10 flex flex-col items-center justify-center h-screen max-h-screen px-6 py-6 md:py-8 text-center overflow-hidden"
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
      }}
    >
      {/* Background Ambient Cosmic Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full opacity-25 blur-3xl pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(167, 139, 250, 0.4), rgba(103, 232, 249, 0.15) 50%, transparent 70%)",
        }}
      />

      {/* Hero Content Container with tight vertical gaps */}
      <div className="flex flex-col items-center justify-center gap-4 sm:gap-5 max-w-3xl my-auto">
        {/* Interactive Orb */}
        <motion.div
          className="relative scale-90 sm:scale-100"
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            show: { opacity: 1, scale: 1 },
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="absolute -inset-4 rounded-full bg-purple-500/10 blur-xl -z-10" />
          <Orb state="idle" />
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          className="font-display font-medium tracking-tight text-4xl sm:text-5xl md:text-6xl leading-[1.1] bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400 drop-shadow-sm"
          variants={{
            hidden: { opacity: 0, y: 15 },
            show: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          Your AI Interview Mentor
        </motion.h1>

        {/* Subheadline Tagline */}
        <motion.p
          className="text-base sm:text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-300 tracking-wide max-w-xl"
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Practice. Improve. Evolve.
        </motion.p>

        {/* Description */}
        <motion.p
          className="text-xs sm:text-sm md:text-base text-slate-400 max-w-md leading-relaxed"
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Nebula remembers every session, adapts its questions to how you
          actually perform, and grows with you until you're interview ready.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-5 pt-2"
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Primary Action Button */}
          <div className="relative group">
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 opacity-60 blur transition-all duration-500 group-hover:opacity-100 group-hover:blur-md" />
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/start-interview"
                className="relative inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white text-sm font-medium tracking-wide shadow-[0_0_25px_rgba(168,85,247,0.35)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(103,232,249,0.5)]"
              >
                <span>Enter Interview Chamber</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Secondary Action Button */}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/skill-galaxy"
              className="group inline-flex items-center gap-2 px-7 py-3 rounded-full bg-slate-900/60 border border-white/10 text-slate-200 text-sm font-medium tracking-wide backdrop-blur-xl hover:bg-slate-800/80 hover:border-cyan-500/40 hover:text-white transition-all duration-300 shadow-lg"
            >
              <span>Explore Your Galaxy</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1 text-cyan-400">
                <Sparkles className="w-4 h-4" />
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
