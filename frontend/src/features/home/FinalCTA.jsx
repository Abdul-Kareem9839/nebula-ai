import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function FinalCTA() {
  return (
    <motion.section
      className="relative z-10 px-6 py-28 md:py-36 max-w-5xl mx-auto text-center overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* BACKGROUND AMBIENT COSMIC GLOWS */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full opacity-30 blur-3xl pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(167,139,250,0.4), rgba(103,232,249,0.15) 50%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px] rounded-full opacity-20 blur-2xl pointer-events-none -z-10 animate-pulse"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.6), transparent 70%)",
        }}
      />

      {/* GLASS CONTAINER CARD */}
      <div className="relative rounded-3xl border border-white/10 bg-slate-900/30 backdrop-blur-xl px-8 py-16 sm:px-14 sm:py-20 shadow-[0_0_50px_rgba(0,0,0,0.4)]">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-4 bg-cyan-950/60 border border-cyan-500/20 rounded-full px-4 py-1">
          READY TO EVOLVE?
        </span>

        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mb-8 max-w-2xl mx-auto leading-tight">
          BEGIN YOUR JOURNEY WITH{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-300">
            NEBULA
          </span>
        </h2>

        {/* CTA BUTTON */}
        <div className="relative inline-block">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 opacity-60 blur-md transition-all duration-500 group-hover:opacity-100 group-hover:blur-lg animate-pulse" />

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/start-interview"
              className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white font-medium tracking-wide shadow-[0_0_30px_rgba(147,51,234,0.35)] transition-all duration-300 hover:shadow-[0_0_50px_rgba(103,232,249,0.5)] hover:brightness-110"
            >
              <span>ENTER INTERVIEW CHAMBER</span>
              <span className="text-lg transition-transform duration-300 group-hover:translate-x-1.5">
                →
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
