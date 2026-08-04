import { motion } from "framer-motion";

/**
 * Timeline layout (Phase 1, requirement 3). One card per interview,
 * expects `crystals` already sorted/filtered by the parent. Same crystal
 * shape as CrystalCard/CrystalDetail — see notes there.
 */

function getScoreTone(overallScore) {
  const hasScore = overallScore != null;
  if (!hasScore) return { text: "text-nebula-text/40", dot: "#8b8ba3" };
  if (overallScore >= 81) return { text: "text-nebula-cyan", dot: "#67e8f9" };
  if (overallScore >= 61) return { text: "text-nebula-glow", dot: "#a78bfa" };
  if (overallScore >= 41) return { text: "text-nebula-accent", dot: "#8b5cf6" };
  return { text: "text-nebula-text/60", dot: "#5a5a72" };
}

function formatDate(value) {
  if (!value) return "Unknown date";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Unknown date";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const STATUS_LABEL = {
  completed: "Completed",
  in_progress: "In Progress",
  paused: "Paused",
  abandoned: "Abandoned",
};

export function CrystalTimeline({ crystals, onOpenCrystal }) {
  if (crystals.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-nebula-text/50 text-sm">
          No memories match these filters.
        </p>
      </div>
    );
  }

  return (
    <div className="relative max-w-3xl mx-auto">
      {/* Connecting line */}
      <div className="absolute left-[7px] sm:left-[9px] top-2 bottom-2 w-px bg-gradient-to-b from-nebula-accent/40 via-white/10 to-transparent" />

      <div className="space-y-4">
        {crystals.map((crystal, i) => {
          const tone = getScoreTone(crystal.overallScore);
          const hasScore = crystal.overallScore != null;
          const questionCount = Array.isArray(crystal.turns)
            ? crystal.turns.length
            : 0;

          return (
            <motion.button
              key={crystal._id ?? i}
              type="button"
              onClick={() => onOpenCrystal(crystal)}
              className="relative flex w-full items-start gap-4 text-left group"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.4,
                delay: Math.min(i, 10) * 0.04,
                ease: "easeOut",
              }}
            >
              {/* Node */}
              <span
                className="relative z-10 mt-1.5 shrink-0 rounded-full"
                style={{
                  width: 16,
                  height: 16,
                  background: tone.dot,
                  boxShadow: `0 0 12px ${tone.dot}99`,
                }}
              />

              {/* Card */}
              <div className="flex-1 min-w-0 rounded-xl border border-white/[0.08] bg-white/[0.02] group-hover:bg-white/[0.05] group-hover:border-white/[0.14] backdrop-blur-xl px-4 py-3.5 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-display text-sm font-medium text-nebula-text truncate">
                      {crystal.role || "Interview"}
                    </p>
                    <p className="text-xs text-nebula-text/50 mt-0.5">
                      {[crystal.type, crystal.skillLevel]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  {hasScore && (
                    <span
                      className={`shrink-0 font-display text-lg font-medium ${tone.text}`}
                    >
                      {Math.round(crystal.overallScore)}%
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2.5 text-[11px] text-nebula-text/40">
                  <span>{formatDate(crystal.createdAt)}</span>
                  <span>·</span>
                  <span className="capitalize">
                    {STATUS_LABEL[crystal.status] ||
                      crystal.status ||
                      "Unknown"}
                  </span>
                  <span>·</span>
                  <span>
                    {questionCount} question{questionCount === 1 ? "" : "s"}
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
