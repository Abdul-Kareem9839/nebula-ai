import { motion } from "framer-motion";

export function InterviewProgress({ completed, total = 5 }) {
  const items = Array.from({ length: total }, (_, i) => {
    const index = i + 1;
    if (index < completed + 1) return "done";
    if (index === completed + 1) return "current";
    return "upcoming";
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-5 py-3 rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/10"
    >
      {items.map((status, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span
            className={`flex items-center justify-center rounded-full text-[10px] font-medium transition-all duration-500 ${
              status === "current" ? "w-6 h-6" : "w-2.5 h-2.5"
            }`}
            style={{
              background:
                status === "done"
                  ? "rgba(103,232,249,0.85)"
                  : status === "current"
                    ? "rgba(167,139,250,0.9)"
                    : "rgba(255,255,255,0.12)",
              boxShadow:
                status === "current"
                  ? "0 0 14px rgba(167,139,250,0.7)"
                  : "none",
              color: status === "current" ? "#0a0a14" : "transparent",
            }}
          >
            {status === "current" ? i + 1 : ""}
          </span>
        </div>
      ))}
    </motion.div>
  );
}
