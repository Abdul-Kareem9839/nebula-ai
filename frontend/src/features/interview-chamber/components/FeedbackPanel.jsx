import { motion } from "framer-motion";

export function FeedbackPanel({
  overallFeedback,
  strengths = [],
  weaknesses = [],
}) {
  const hasFeedback = Boolean(overallFeedback);
  const hasStrengths = strengths.length > 0;
  const hasWeaknesses = weaknesses.length > 0;

  if (!hasFeedback && !hasStrengths && !hasWeaknesses) return null;

  return (
    <div className="space-y-5">
      {hasFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border-x border-white/10 p-5 sm:p-6 shadow-xl"
        >
          <p className="text-xs tracking-[0.15em] uppercase text-nebula-text/45 mb-2.5 font-medium">
            Overall Feedback
          </p>
          <p className="text-sm text-nebula-text/80 leading-relaxed">
            {overallFeedback}
          </p>
        </motion.div>
      )}

      {(hasStrengths || hasWeaknesses) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {hasStrengths && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border-x border-white/10 p-5 shadow-xl"
            >
              <p className="text-xs tracking-[0.15em] uppercase text-emerald-400/80 mb-3 font-semibold">
                Strengths
              </p>
              <ul className="space-y-2.5">
                {strengths.map((s, i) => (
                  <li
                    key={i}
                    className="text-sm text-nebula-text/80 flex gap-2.5 leading-relaxed"
                  >
                    <span className="text-emerald-400 shrink-0 font-bold">
                      ✓
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {hasWeaknesses && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border-x border-white/10 p-5 shadow-xl"
            >
              <p className="text-xs tracking-[0.15em] uppercase text-amber-400/80 mb-3 font-semibold">
                Areas to Improve
              </p>
              <ul className="space-y-2.5">
                {weaknesses.map((w, i) => (
                  <li
                    key={i}
                    className="text-sm text-nebula-text/80 flex gap-2.5 leading-relaxed"
                  >
                    <span className="text-amber-400 shrink-0 font-bold">⚠</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
