import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const DIFFICULTY_LABEL = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  expert: "Expert",
};

function Chip({ children }) {
  return (
    <span className="inline-block rounded-full border border-nebula-accent/25 bg-nebula-accent/10 px-3 py-1 text-xs font-medium text-nebula-glow">
      {children}
    </span>
  );
}

function EmptyState({ icon, title, description }) {
  return (
    <div className="flex items-center gap-3 py-2 text-nebula-text/60">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-sm">
        {icon}
      </span>
      <div>
        <p className="text-xs font-medium text-nebula-text/70">{title}</p>
        <p className="text-xs leading-relaxed text-nebula-text/50">
          {description}
        </p>
      </div>
    </div>
  );
}

function ScoreStat({ label, value, icon, accentClass, barClass }) {
  const displayValue = typeof value === "number" ? Math.round(value) : "—";
  const percentValue =
    typeof value === "number" ? Math.min(100, Math.max(8, value)) : 0;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="group flex flex-col rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-md transition-colors hover:border-white/20 hover:bg-white/[0.05]"
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-black/20 text-xs ${accentClass}`}
        >
          {icon}
        </div>
        <div className="text-right">
          <p className="font-display text-lg font-semibold text-nebula-text">
            {displayValue}
            {typeof value === "number" ? "%" : ""}
          </p>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-nebula-text/45">
            {label}
          </p>
        </div>
      </div>
      <div className="mt-2.5 h-1.5 rounded-full bg-white/[0.06]">
        <div
          className={`h-1.5 rounded-full ${barClass}`}
          style={{ width: `${percentValue}%` }}
        />
      </div>
    </motion.div>
  );
}

function getRarityLabel(score, fallback = null) {
  if (fallback) return fallback;
  if (score == null) return "Pending";
  if (score >= 90) return "Legendary";
  if (score >= 80) return "Epic";
  if (score >= 68) return "Rare";
  return "Emerging";
}

function SkeletonCard() {
  return (
    <div className="space-y-3 p-2">
      <div className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
      <div className="h-3 w-full animate-pulse rounded-full bg-white/10" />
      <div className="h-3 w-4/5 animate-pulse rounded-full bg-white/10" />
    </div>
  );
}

export function CrystalDetail({
  crystal,
  onClose,
  onSelectForComparison,
  isSelectedForComparison,
  comparisonCount,
  isLoading = false,
}) {
  const [activeTurnIndex, setActiveTurnIndex] = useState(0);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    setActiveTurnIndex(0);
  }, [crystal?._id]);

  if (!crystal) return null;

  const hasScore = crystal.overallScore != null;
  const subScores = [
    {
      label: "Overall",
      value: crystal.overallScore,
      icon: "◉",
      accentClass: "text-nebula-cyan",
      barClass: "bg-nebula-cyan/80",
    },
    {
      label: "Technical",
      value: crystal.technicalScore,
      icon: "⚙",
      accentClass: "text-nebula-cyan",
      barClass: "bg-nebula-cyan/70",
    },
    {
      label: "Communication",
      value: crystal.communicationScore,
      icon: "✦",
      accentClass: "text-nebula-accent",
      barClass: "bg-nebula-accent/70",
    },
    {
      label: "Confidence",
      value: crystal.confidenceScore,
      icon: "⬢",
      accentClass: "text-nebula-accent",
      barClass: "bg-nebula-accent/65",
    },
    {
      label: "Problem Solving",
      value: crystal.problemSolvingScore,
      icon: "◌",
      accentClass: "text-nebula-cyan",
      barClass: "bg-nebula-cyan/75",
    },
  ];

  const strengths = crystal.summary?.strengths ?? [];
  const weaknesses = crystal.summary?.weaknesses ?? [];
  const overallFeedback = crystal.summary?.overallFeedback ?? null;
  const skills = crystal.skills ?? [];
  const turns = crystal.turns ?? [];
  const turnCount = turns.length;
  const selectedTurn = turns[activeTurnIndex] ?? null;
  const summaryLabel = [crystal.type, crystal.skillLevel]
    .filter(Boolean)
    .join(" • ");
  const rarityLabel = crystal.rarity || getRarityLabel(crystal.overallScore);

  /* SHOW STATUS BADGE ONLY FOR PROCESSING OR FAILED STATES */
  const showStatusBadge =
    crystal.status &&
    ["processing", "failed", "pending"].includes(crystal.status);

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-y-auto bg-nebula-bg/85 px-3 pt-4 pb-6 backdrop-blur-md sm:px-6 sm:pt-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative mx-auto my-2 w-full max-w-5xl rounded-[2rem] border border-white/10 bg-nebula-surface/95 p-6 shadow-[0_30px_120px_rgba(5,10,25,0.45)] backdrop-blur-2xl sm:p-8"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 animate-pulse rounded-full bg-white/10" />
              <div className="space-y-2">
                <div className="h-6 w-48 animate-pulse rounded-full bg-white/10" />
                <div className="h-3 w-28 animate-pulse rounded-full bg-white/10" />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* TOP HEADER SECTION */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex items-center gap-3.5">
                {/* CRYSTAL ICON */}
                <div
                  className="h-11 w-11 shrink-0 rounded-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 45%, #67e8f9 100%)",
                    clipPath:
                      "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
                    boxShadow: "0 0 24px rgba(167,139,250,0.35)",
                  }}
                />

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-xl font-semibold leading-tight text-nebula-text sm:text-2xl">
                      {crystal.role || "Interview Memory"}
                    </h2>

                    {showStatusBadge && (
                      <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-amber-300">
                        {crystal.status.replace(/_/g, " ")}
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-3">
                    <span className="text-xs text-nebula-text/60 capitalize">
                      {summaryLabel || "Practice session"}
                    </span>

                    <button
                      type="button"
                      onClick={() => onSelectForComparison?.(crystal)}
                      className="text-xs text-nebula-cyan hover:underline"
                    >
                      {isSelectedForComparison
                        ? "✓ Selected"
                        : `+ Compare (${comparisonCount}/2)`}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* OVERALL SCORE FOCUS / COMPACT NOT EVALUATED STATE */}
                {hasScore ? (
                  <div className="flex items-baseline gap-2.5">
                    <div className="text-right">
                      <span className="font-display text-3xl font-bold tracking-tight text-nebula-cyan">
                        {Math.round(crystal.overallScore)}%
                      </span>
                      <span className="block text-[9px] uppercase tracking-[0.2em] text-nebula-text/45">
                        {rarityLabel}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-nebula-text/60">
                    <span className="text-nebula-cyan">⧗</span>
                    <span>Not Evaluated</span>
                  </div>
                )}

                {/* CLOSE BUTTON */}
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-nebula-text/50 transition hover:bg-white/[0.08] hover:text-nebula-text"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* SCORE STATISTICS CARDS */}
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {subScores.map((score) => (
                <ScoreStat
                  key={score.label}
                  label={score.label}
                  value={score.value}
                  icon={score.icon}
                  accentClass={score.accentClass}
                  barClass={score.barClass}
                />
              ))}
            </div>

            {/* AI SUMMARY SECTION */}
            <div className="py-2">
              <h3 className="mb-2 font-display text-xs font-semibold uppercase tracking-[0.24em] text-nebula-text/50">
                AI Summary
              </h3>
              {overallFeedback ? (
                <p className="text-sm leading-relaxed text-nebula-text/80">
                  {overallFeedback}
                </p>
              ) : (
                <EmptyState
                  icon="✦"
                  title="Summary is on the way"
                  description="Once the interview is evaluated, your AI-generated reflection and coaching notes will appear here."
                />
              )}
            </div>

            {/* SKILLS SECTION */}
            <div className="py-2">
              <h3 className="mb-2 font-display text-xs font-semibold uppercase tracking-[0.24em] text-nebula-text/50">
                Skills Analyzed
              </h3>
              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Chip key={`${skill.name}-${index}`}>
                      {skill.name}
                      {typeof skill.score === "number"
                        ? ` • ${Math.round(skill.score)}%`
                        : ""}
                    </Chip>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon="✧"
                  title="Skills are still being gathered"
                  description="Completed interviews will surface strengths and focus areas to revisit."
                />
              )}
            </div>

            {/* STRENGTHS & WEAKNESSES */}
            {(strengths.length > 0 || weaknesses.length > 0) && (
              <div className="grid gap-6 border-t border-white/10 pt-4 lg:grid-cols-2">
                {strengths.length > 0 && (
                  <div>
                    <h3 className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.24em] text-nebula-cyan/80">
                      Strengths
                    </h3>
                    <ul className="space-y-2">
                      {strengths.map((item, index) => (
                        <li
                          key={`${item}-${index}`}
                          className="flex items-start gap-2.5 text-sm text-nebula-text/80"
                        >
                          <span className="mt-0.5 text-nebula-cyan">+</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {weaknesses.length > 0 && (
                  <div>
                    <h3 className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.24em] text-nebula-accent/80">
                      Areas to Grow
                    </h3>
                    <ul className="space-y-2">
                      {weaknesses.map((item, index) => (
                        <li
                          key={`${item}-${index}`}
                          className="flex items-start gap-2.5 text-sm text-nebula-text/80"
                        >
                          <span className="mt-0.5 text-nebula-accent">-</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* QUESTION REVIEW SECTION */}
            {turns.length > 0 && (
              <div className="border-t border-white/10 pt-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-display text-xs font-semibold uppercase tracking-[0.24em] text-nebula-text/50">
                    Question Review
                  </h3>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveTurnIndex((value) => Math.max(0, value - 1))
                      }
                      disabled={activeTurnIndex === 0}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-nebula-text/70 transition hover:bg-white/[0.08] disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <span className="text-xs text-nebula-text/50">
                      {activeTurnIndex + 1} / {turnCount}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveTurnIndex((value) =>
                          Math.min(turnCount - 1, value + 1),
                        )
                      }
                      disabled={activeTurnIndex >= turnCount - 1}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-nebula-text/70 transition hover:bg-white/[0.08] disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>

                {/* QUESTION INDEX BUTTONS */}
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {turns.map((_, index) => (
                    <button
                      key={`${index}-${crystal._id}`}
                      type="button"
                      onClick={() => setActiveTurnIndex(index)}
                      className={`h-7 min-w-7 rounded-lg text-xs font-medium transition ${
                        activeTurnIndex === index
                          ? "bg-nebula-cyan/20 text-nebula-cyan border border-nebula-cyan/40"
                          : "bg-white/[0.03] text-nebula-text/50 hover:bg-white/[0.06]"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                {selectedTurn && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${crystal._id}-${activeTurnIndex}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="space-y-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/5 pb-3">
                        <div>
                          <p className="text-sm font-medium text-nebula-text">
                            {selectedTurn.question?.text}
                          </p>
                          {selectedTurn.question?.topic && (
                            <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-nebula-text/40">
                              {selectedTurn.question.topic}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedTurn.question?.difficulty && (
                            <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] text-nebula-text/50">
                              {DIFFICULTY_LABEL[
                                selectedTurn.question.difficulty
                              ] ?? selectedTurn.question.difficulty}
                            </span>
                          )}
                          {typeof selectedTurn.evaluation?.score ===
                            "number" && (
                            <span className="rounded-full border border-nebula-cyan/30 bg-nebula-cyan/10 px-2 py-0.5 text-[11px] font-semibold text-nebula-cyan">
                              {Math.round(selectedTurn.evaluation.score)}%
                            </span>
                          )}
                        </div>
                      </div>

                      {/* COMPARATIVE ANSWER AND FEEDBACK CARDS */}
                      <div className="grid gap-4 lg:grid-cols-2">
                        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-nebula-text/40">
                            Your Answer
                          </p>
                          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-nebula-text/80">
                            {selectedTurn.answer?.text ||
                              "No answer recorded for this question."}
                          </p>
                        </div>

                        <div className="rounded-xl border border-nebula-cyan/20 bg-nebula-cyan/[0.04] p-4">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-nebula-cyan/70">
                            Feedback
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-nebula-text/80">
                            {selectedTurn.evaluation?.feedback ||
                              "No feedback available."}
                          </p>
                        </div>
                      </div>

                      {/* TURN-LEVEL STRENGTHS & WEAKNESSES */}
                      {(selectedTurn.evaluation?.strengths?.length > 0 ||
                        selectedTurn.evaluation?.weaknesses?.length > 0) && (
                        <div className="grid gap-4 lg:grid-cols-2">
                          {selectedTurn.evaluation?.strengths?.length > 0 && (
                            <div className="p-1">
                              <p className="text-[10px] uppercase tracking-[0.2em] text-nebula-cyan/70">
                                Question Strengths
                              </p>
                              <ul className="mt-1.5 space-y-1 text-xs text-nebula-text/75">
                                {selectedTurn.evaluation.strengths.map(
                                  (item, index) => (
                                    <li
                                      key={`${item}-${index}`}
                                      className="flex gap-2"
                                    >
                                      <span className="text-nebula-cyan">
                                        +
                                      </span>
                                      <span>{item}</span>
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          )}

                          {selectedTurn.evaluation?.weaknesses?.length > 0 && (
                            <div className="p-1">
                              <p className="text-[10px] uppercase tracking-[0.2em] text-nebula-accent/70">
                                Question Weaknesses
                              </p>
                              <ul className="mt-1.5 space-y-1 text-xs text-nebula-text/75">
                                {selectedTurn.evaluation.weaknesses.map(
                                  (item, index) => (
                                    <li
                                      key={`${item}-${index}`}
                                      className="flex gap-2"
                                    >
                                      <span className="text-nebula-accent">
                                        -
                                      </span>
                                      <span>{item}</span>
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* MODEL ANSWER SUGGESTION */}
                      {selectedTurn.evaluation?.improvedAnswer && (
                        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-nebula-text/40">
                            A Stronger Answer
                          </p>
                          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-nebula-text/75">
                            {selectedTurn.evaluation.improvedAnswer}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
