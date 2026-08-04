import { motion } from 'framer-motion';

const SIZE = 200;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function performanceLabel(score) {
  if (score >= 90) return 'Outstanding';
  if (score >= 80) return 'Excellent Performance';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Fair';
  return 'Needs Improvement';
}

/**
 * The "Overall Score Screen" — a single, dramatic circular reveal of
 * interview.overallScore plus the two exit actions. Score-card /
 * feedback / skills detail live one step further, in InterviewReport,
 * reached via "View Full Report".
 */
export function OverallScore({ interview, onViewReport, onBackToDashboard }) {
  const score = Math.round(interview?.overallScore ?? 0);
  const offset = CIRCUMFERENCE * (1 - Math.min(100, Math.max(0, score)) / 100);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md flex flex-col items-center text-center"
      >
        <p className="text-xs tracking-[0.2em] uppercase text-nebula-cyan/70 mb-6">
          Your Interview Score
        </p>

        <div className="relative" style={{ width: SIZE, height: SIZE }}>
          <div
            className="absolute inset-0 rounded-full blur-2xl"
            style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.35) 0%, transparent 70%)' }}
          />
          <svg width={SIZE} height={SIZE} className="relative -rotate-90">
            <defs>
              <linearGradient id="score-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#67e8f9" />
              </linearGradient>
            </defs>
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={STROKE}
            />
            <motion.circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="url(#score-ring)"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.3, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="font-display text-5xl font-semibold text-nebula-text"
            >
              {score}
            </motion.span>
            <span className="text-sm text-nebula-text/40 -mt-1">/100</span>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="font-display text-xl font-medium text-nebula-glow mt-6"
        >
          {performanceLabel(score)}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.15 }}
          className="flex flex-col sm:flex-row gap-3 w-full mt-10"
        >
          <motion.button
            type="button"
            onClick={onViewReport}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 px-6 py-3 rounded-full font-medium text-nebula-bg bg-gradient-to-r from-nebula-glow to-nebula-cyan shadow-glow transition-shadow duration-300"
          >
            View Full Report
          </motion.button>
          <motion.button
            type="button"
            onClick={onBackToDashboard}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 px-6 py-3 rounded-full font-medium border border-white/10 bg-white/[0.03] text-nebula-text/80 hover:border-white/20 transition-colors duration-300"
          >
            Back to Dashboard
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
