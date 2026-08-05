import { motion } from "framer-motion";
import { ScoreCard } from "./ScoreCard.jsx";
import { FeedbackPanel } from "./FeedbackPanel.jsx";
import { SkillBadges } from "./SkillBadges.jsx";

const SUB_SCORES = [
  { key: "technicalScore", label: "Technical" },
  { key: "communicationScore", label: "Communication" },
  { key: "problemSolvingScore", label: "Problem Solving" },
  { key: "confidenceScore", label: "Confidence" },
];

export function InterviewReport({ interview, onBackToDashboard }) {
  const turns = interview?.turns ?? [];

  return (
    <div className="min-h-screen px-6 py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="font-display text-2xl sm:text-3xl font-medium text-nebula-text">
            Detailed Report
          </h1>
          <p className="text-sm text-nebula-text/50 mt-2">
            {interview?.role}
            {interview?.type ? ` · ${interview.type}` : ""}
          </p>
        </div>

        {/* Overall Score Card */}
        <div className="rounded-3xl border-x border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-nebula-cyan/70 font-semibold">
                Overall Score
              </p>
              <p className="font-display text-4xl font-medium text-nebula-text mt-2">
                {Math.round(interview?.overallScore ?? 0)}%
              </p>
            </div>
            <p className="text-sm text-nebula-text/60 max-w-xl">
              {interview?.summary?.overallFeedback ||
                "Your interview has been captured and is ready for review."}
            </p>
          </div>
        </div>

        {/* Sub Scores Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {SUB_SCORES.map((s, i) => (
            <ScoreCard
              key={s.key}
              label={s.label}
              score={interview?.[s.key] ?? 0}
              delay={i * 0.08}
            />
          ))}
        </div>

        {/* Feedback Panel */}
        <FeedbackPanel
          overallFeedback={interview?.summary?.overallFeedback}
          strengths={interview?.summary?.strengths}
          weaknesses={interview?.summary?.weaknesses}
        />

        {/* Skills Badges */}
        <SkillBadges skills={interview?.skills} />

        {/* Interview Turns Section */}
        <div className="rounded-3xl border-x border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl space-y-5 shadow-2xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <h2 className="font-display text-xl text-nebula-text">
              Interview Turns
            </h2>
            <span className="text-sm text-nebula-text/50">
              {turns.length} question{turns.length === 1 ? "" : "s"}
            </span>
          </div>

          {turns.length === 0 ? (
            <p className="text-sm text-nebula-text/60">
              No turns were recorded for this interview yet.
            </p>
          ) : (
            turns.map((turn, index) => (
              <div
                key={`${turn?.question?.text ?? index}-${index}`}
                className="rounded-2xl border-x border-white/10 bg-black/20 p-4 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-nebula-cyan/70 font-semibold">
                      Question {index + 1}
                    </p>
                    <p className="text-sm text-nebula-text mt-1 font-medium">
                      {turn?.question?.text}
                    </p>
                  </div>
                  <div className="text-xs text-nebula-text/60 shrink-0">
                    <span className="mr-3 font-medium text-nebula-cyan">
                      Score: {Math.round(turn?.evaluation?.score ?? 0)}%
                    </span>
                    <span className="uppercase tracking-wider">
                      Difficulty: {turn?.question?.difficulty || "medium"}
                    </span>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2 pt-1">
                  <div className="rounded-xl bg-white/[0.02] p-3 border-x border-white/5">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-nebula-text/40 font-medium">
                      Your Answer
                    </p>
                    <p className="text-sm text-nebula-text/75 mt-1 whitespace-pre-wrap leading-relaxed">
                      {turn?.answer?.text || "No answer recorded."}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/[0.02] p-3 border-x border-white/5">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-nebula-text/40 font-medium">
                      Feedback
                    </p>
                    <p className="text-sm text-nebula-text/75 mt-1 leading-relaxed">
                      {turn?.evaluation?.feedback || "No feedback available."}
                    </p>
                  </div>
                </div>

                {(turn?.evaluation?.strengths?.length ||
                  turn?.evaluation?.weaknesses?.length) && (
                  <div className="grid gap-3 md:grid-cols-2 pt-1">
                    {turn?.evaluation?.strengths?.length ? (
                      <div className="rounded-xl bg-white/[0.02] p-3 border-x border-white/5">
                        <p className="text-[11px] uppercase tracking-[0.24em] text-emerald-400/80 font-semibold">
                          Strengths
                        </p>
                        <ul className="mt-1 list-disc pl-5 text-sm text-nebula-text/70 space-y-1">
                          {turn.evaluation.strengths.map((item, itemIndex) => (
                            <li key={`${item}-${itemIndex}`}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {turn?.evaluation?.weaknesses?.length ? (
                      <div className="rounded-xl bg-white/[0.02] p-3 border-x border-white/5">
                        <p className="text-[11px] uppercase tracking-[0.24em] text-amber-400/80 font-semibold">
                          Weaknesses
                        </p>
                        <ul className="mt-1 list-disc pl-5 text-sm text-nebula-text/70 space-y-1">
                          {turn.evaluation.weaknesses.map((item, itemIndex) => (
                            <li key={`${item}-${itemIndex}`}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Action Button */}
        <div className="flex justify-center pt-4">
          <motion.button
            type="button"
            onClick={onBackToDashboard}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3 rounded-full text-sm font-medium border border-white/10 bg-white/[0.03] text-nebula-text/80 hover:border-white/20 hover:text-white transition-all duration-300 cursor-pointer shadow-lg backdrop-blur-md"
          >
            Back to Dashboard
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
