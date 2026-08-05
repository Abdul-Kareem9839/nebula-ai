import { motion } from "framer-motion";

export function InterviewCompleted() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md rounded-3xl bg-white/[0.03] backdrop-blur-xl border-x border-white/10 shadow-2xl px-8 py-12 flex flex-col items-center text-center"
      >
        {/* ANIMATED CHECKMARK ICON */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-6 flex items-center justify-center"
        >
          <div
            className="absolute w-28 h-28 rounded-full blur-2xl pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(52,211,153,0.35) 0%, transparent 70%)",
            }}
          />
          <svg
            width="88"
            height="88"
            viewBox="0 0 88 88"
            className="relative z-10"
          >
            <circle
              cx="44"
              cy="44"
              r="40"
              fill="rgba(52,211,153,0.06)"
              stroke="rgba(52,211,153,0.35)"
              strokeWidth="2"
            />
            <motion.path
              d="M28 45L39 56L60 33"
              fill="none"
              stroke="#34d399"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
            />
          </svg>
        </motion.div>

        {/* COMPLETED TITLE */}
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="font-display text-2xl font-medium tracking-tight text-slate-100"
        >
          Interview Completed!
        </motion.h2>

        {/* SUBTITLE */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="text-sm text-slate-300/80 mt-2 leading-relaxed"
        >
          Your interview has been submitted successfully.
        </motion.p>

        {/* PROCESSING INDICATOR TEXT */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="text-xs text-slate-400/60 mt-5 font-medium tracking-wide uppercase"
        >
          Preparing your detailed evaluation…
        </motion.p>

        {/* PULSING LOADING DOTS */}
        <div className="flex items-center gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full bg-emerald-400"
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.85, 1.25, 0.85] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
