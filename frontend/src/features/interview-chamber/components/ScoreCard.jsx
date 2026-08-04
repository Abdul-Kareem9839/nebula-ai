import { motion } from 'framer-motion';

/**
 * Single sub-score stat card (Technical / Communication / Problem
 * Solving / Confidence) — used four times from InterviewReport so the
 * markup lives in exactly one place.
 */
export function ScoreCard({ label, score = 0, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -3, borderColor: 'rgba(255,255,255,0.2)' }}
      transition={{ duration: 0.5, delay }}
      className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 p-5"
    >
      <p className="text-xs tracking-[0.15em] uppercase text-nebula-text/45">{label}</p>
      <p className="font-display text-3xl font-medium text-nebula-text mt-2">{Math.round(score)}</p>
      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden mt-3">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-nebula-glow to-nebula-cyan"
          initial={{ width: 0 }}
          whileInView={{ width: `${Math.min(100, Math.max(0, score))}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: delay + 0.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </motion.div>
  );
}
