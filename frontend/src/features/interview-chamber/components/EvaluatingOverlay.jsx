import { motion } from 'framer-motion';

/**
 * Full-screen blocking overlay shown while the backend is generating
 * the final evaluation for what looks like the last answer (see the
 * maxQuestions heuristic in InterviewChamber.jsx). Replaced by
 * InterviewCompleted once the response comes back with status
 * 'completed'; if it turns out not to be the last question after all,
 * the page simply drops this overlay and resumes the normal flow.
 */
export function EvaluatingOverlay() {
  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center bg-nebula-bg/70 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center gap-5">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full bg-nebula-glow"
              animate={{ opacity: [0.25, 1, 0.25], scale: [1, 1.4, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
              style={{ boxShadow: '0 0 10px rgba(167,139,250,0.7)' }}
            />
          ))}
        </div>
        <p className="text-sm text-nebula-text/70 tracking-wide">Evaluating your interview…</p>
      </div>
    </motion.div>
  );
}
