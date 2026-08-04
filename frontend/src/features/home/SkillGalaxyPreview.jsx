import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PREVIEW_SKILLS = [
  { name: "React", top: 25, left: 15, size: 22 },
  { name: "JavaScript", top: 60, left: 30, size: 28 },
  { name: "Node.js", top: 22, left: 52, size: 18 },
  { name: "DSA", top: 65, left: 70, size: 26 },
  { name: "Communication", top: 38, left: 88, size: 16 },
];

const CONNECTIONS = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
];

export function SkillGalaxyPreview() {
  return (
    <section className="relative z-10 px-6 py-10 max-w-4xl mx-auto text-center">
      <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-nebula-text mb-3">
        Your skills, as a constellation
      </h2>
      <p className="text-nebula-text/55 max-w-md mx-auto mb-16 leading-relaxed">
        Every skill you practice becomes a star. Brighter stars mean stronger
        skills.
      </p>

      {/* Galaxy Container */}
      <div className="relative h-72 w-full">
        {/* Constellation Lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          aria-hidden="true"
        >
          {CONNECTIONS.map(([a, b], i) => {
            const from = PREVIEW_SKILLS[a];
            const to = PREVIEW_SKILLS[b];
            return (
              <line
                key={i}
                x1={`${from.left}%`}
                y1={`${from.top}%`}
                x2={`${to.left}%`}
                y2={`${to.top}%`}
                stroke="rgba(103, 232, 249, 0.25)"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
            );
          })}
        </svg>

        {/* Stars / Skills */}
        {PREVIEW_SKILLS.map((skill, i) => (
          <div
            key={skill.name}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto"
            style={{ top: `${skill.top}%`, left: `${skill.left}%` }}
          >
            {/* Star Node Container */}
            <motion.div
              className="relative flex items-center justify-center cursor-pointer group"
              animate={{ y: [0, -5, 0] }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Outer Glowing Aura */}
              <div
                className="absolute rounded-full bg-cyan-400/20 blur-md transition-transform duration-300 group-hover:scale-150"
                style={{
                  width: skill.size * 2,
                  height: skill.size * 2,
                }}
              />

              {/* Core Star */}
              <span
                className="relative rounded-full bg-cyan-300 shadow-[0_0_15px_rgba(103,232,249,0.8)] transition-all duration-300 group-hover:bg-white group-hover:shadow-[0_0_22px_rgba(103,232,249,1)]"
                style={{
                  width: skill.size,
                  height: skill.size,
                }}
              />
            </motion.div>

            {/* Label below node */}
            <span className="mt-2.5 text-xs font-medium text-nebula-text/60 tracking-wider whitespace-nowrap transition-colors duration-200 hover:text-cyan-300">
              {skill.name}
            </span>
          </div>
        ))}
      </div>

      {/* Enhanced Explore Button */}
      <div>
        <Link
          to="/skill-galaxy"
          className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900/60 border border-cyan-500/30 backdrop-blur-md text-sm font-medium text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-950/40 hover:text-white hover:shadow-[0_0_25px_rgba(6,182,212,0.35)] focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
        >
          <span>Explore your full galaxy</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1 text-cyan-400 group-hover:text-cyan-200">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
