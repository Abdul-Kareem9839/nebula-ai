import { motion } from "framer-motion";

const FEATURES = [
  {
    title: "Resume Intelligence",
    description:
      "AI analyzes your resume and extracts deeply contextual skills.",
    icon: (
      <svg
        className="w-5 h-5 text-cyan-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    ),
    accentColor: "rgba(56, 189, 248, 0.25)",
  },
  {
    title: "Voice Interview",
    description:
      "Real-time conversational audio practice powered by adaptive AI.",
    icon: (
      <svg
        className="w-5 h-5 text-purple-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    ),
    accentColor: "rgba(168, 85, 247, 0.25)",
  },
  {
    title: "Adaptive Questions",
    description:
      "Dynamic difficulty adjusts in real time according to your answers.",
    icon: (
      <svg
        className="w-5 h-5 text-indigo-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    accentColor: "rgba(99, 102, 241, 0.25)",
  },
  {
    title: "Skill Evolution",
    description:
      "Track growth over time with interactive constellation visualizers.",
    icon: (
      <svg
        className="w-5 h-5 text-pink-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    accentColor: "rgba(244, 114, 182, 0.25)",
  },
];

export function FeatureSection() {
  return (
    <section className="relative z-10 px-6 py-24 md:py-32 max-w-5xl mx-auto">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.12 } },
        }}
      >
        {FEATURES.map((feature) => (
          <motion.div
            key={feature.title}
            className="group relative rounded-2xl p-8 bg-slate-900/40 border border-white/10 backdrop-blur-xl hover:border-white/20 hover:bg-slate-900/60 transition-all duration-500 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.3)]"
            variants={{
              hidden: { opacity: 0, y: 24 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
          >
            {/* AMBIENT BACKGROUND GLOW ON HOVER */}
            <div
              className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${feature.accentColor}, transparent 70%)`,
              }}
            />

            {/* TOP ROW: ICON CONTAINER & STATUS DOT */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 group-hover:scale-110 group-hover:border-white/20 transition-all duration-300">
                {feature.icon}
              </div>
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
            </div>

            {/* FEATURE CONTENT */}
            <h3 className="font-display text-lg font-medium tracking-tight text-white mb-2 transition-colors duration-300 group-hover:text-cyan-200">
              {feature.title}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
