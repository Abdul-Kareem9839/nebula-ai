import { motion } from "framer-motion";

export function SkillBadges({ skills = [] }) {
  if (!skills.length) return null;

  return (
    <div>
      <p className="text-xs tracking-[0.15em] uppercase text-nebula-text/45 mb-3">
        Skills Assessed
      </p>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <motion.span
            key={skill.name ?? i}
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            className="rounded-full border border-nebula-accent/30 bg-nebula-accent/10 px-3.5 py-1.5 text-sm text-nebula-glow"
          >
            {skill.name}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
