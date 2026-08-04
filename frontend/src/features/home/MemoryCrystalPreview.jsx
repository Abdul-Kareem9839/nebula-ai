import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PREVIEW_CRYSTALS = [
  {
    role: "Frontend Engineer",
    type: "Technical",
    recency: "primary",
    score: "92%",
    gradient: "from-purple-400 via-indigo-500 to-cyan-400",
    glowColor: "rgba(167, 139, 250, 0.45)",
  },
  {
    role: "Backend Engineer",
    type: "System Design",
    recency: "secondary",
    score: "88%",
    gradient: "from-cyan-400 via-teal-500 to-indigo-500",
    glowColor: "rgba(103, 232, 249, 0.35)",
  },
  {
    role: "Product Manager",
    type: "Behavioral",
    recency: "secondary",
    score: "95%",
    gradient: "from-pink-400 via-purple-500 to-indigo-500",
    glowColor: "rgba(244, 114, 182, 0.35)",
  },
];

export function MemoryCrystalPreview() {
  return (
    <section className="relative z-10 px-6 py-24 md:py-32 max-w-5xl mx-auto text-center">
      <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-nebula-text mb-3">
        Every interview, remembered
      </h2>
      <p className="text-nebula-text/55 max-w-md mx-auto mb-16 leading-relaxed">
        Past sessions live on as crystals — questions, answers, feedback, and
        what to improve next.
      </p>

      {/* Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {PREVIEW_CRYSTALS.map((crystal, i) => {
          const isPrimary = crystal.recency === "primary";
          return (
            <motion.div
              key={crystal.role}
              className={`group relative flex flex-col items-center rounded-2xl p-8 bg-slate-900/40 border backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 ${
                isPrimary
                  ? "border-purple-500/30 hover:border-purple-400/60 shadow-[0_0_25px_rgba(167,139,250,0.15)]"
                  : "border-white/10 hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(103,232,249,0.12)]"
              }`}
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 4.5 + i * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Background Ambient Glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none -z-10"
                style={{
                  background: `radial-gradient(circle at center, ${crystal.glowColor}, transparent 70%)`,
                }}
              />

              {/* Crystal Gem Container */}
              <div className="relative mb-6 flex items-center justify-center">
                {/* Glowing Backlight */}
                <div
                  className="absolute rounded-full blur-md transition-transform duration-500 group-hover:scale-125"
                  style={{
                    width: isPrimary ? 52 : 44,
                    height: isPrimary ? 52 : 44,
                    backgroundColor: crystal.glowColor,
                  }}
                />

                {/* Crystal Vector Shape */}
                <motion.div
                  className="relative cursor-pointer"
                  whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                >
                  <svg
                    width={isPrimary ? 48 : 40}
                    height={isPrimary ? 56 : 48}
                    viewBox="0 0 40 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                  >
                    {/* Top Facet Left */}
                    <path
                      d="M20 2L4 16L20 22V2Z"
                      fill="url(#crystal-grad-1)"
                      fillOpacity="0.9"
                    />
                    {/* Top Facet Right */}
                    <path
                      d="M20 2L36 16L20 22V2Z"
                      fill="url(#crystal-grad-2)"
                      fillOpacity="0.75"
                    />
                    {/* Bottom Facet Left */}
                    <path
                      d="M4 16L20 46V22L4 16Z"
                      fill="url(#crystal-grad-1)"
                      fillOpacity="0.8"
                    />
                    {/* Bottom Facet Right */}
                    <path
                      d="M36 16L20 46V22L36 16Z"
                      fill="url(#crystal-grad-2)"
                      fillOpacity="0.95"
                    />
                    {/* Center Highlight Edge */}
                    <line
                      x1="20"
                      y1="2"
                      x2="20"
                      y2="46"
                      stroke="white"
                      strokeOpacity="0.4"
                      strokeWidth="0.75"
                    />

                    <defs>
                      <linearGradient
                        id="crystal-grad-1"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#c084fc" />
                        <stop offset="100%" stopColor="#38bdf8" />
                      </linearGradient>
                      <linearGradient
                        id="crystal-grad-2"
                        x1="100%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.div>
              </div>

              {/* Role Title */}
              <h3
                className={`font-medium tracking-tight text-nebula-text transition-colors duration-300 group-hover:text-white ${
                  isPrimary ? "text-base" : "text-sm"
                }`}
              >
                {crystal.role}
              </h3>

              {/* Type Badge */}
              <span className="mt-1.5 text-xs font-medium text-nebula-text/50 tracking-wider">
                {crystal.type}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Enhanced Memory Crystal Button */}
      <div className="mt-14">
        <Link
          to="/memory-crystals"
          className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900/60 border border-purple-500/30 backdrop-blur-md text-sm font-medium text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300 hover:border-purple-400 hover:bg-purple-950/40 hover:text-white hover:shadow-[0_0_25px_rgba(168,85,247,0.35)] focus:outline-none focus:ring-2 focus:ring-purple-400/50"
        >
          <span>View your memory crystals</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1 text-purple-400 group-hover:text-purple-200">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
