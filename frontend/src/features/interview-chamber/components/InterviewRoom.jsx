import { AnimatePresence, motion } from "framer-motion";
import { Orb } from "../../orb/Orb.jsx";
import { QuestionDisplay } from "./QuestionDisplay.jsx";
import { AnswerPanel } from "./AnswerPanel.jsx";
import { InterviewProgress } from "./InterviewProgress.jsx";

const METRIC_LABELS = ["Technical Accuracy", "Communication", "Confidence"];

export function InterviewRoom({
  question,
  orbState,
  completedCount,
  totalTarget,

  answer,
  onChangeAnswer,
  onSubmit,

  submitting,

  isSupported,
  isListening,
  onToggleVoice,

  analysis,
  currentTurn,

  reviewIndex,
  reviewTotal,

  onPrevious,
  onNext,
  onReview,
  onExitReview,
}) {
  const voiceState = isListening
    ? "listening"
    : orbState === "speaking"
      ? "speaking"
      : "idle";

  const isReviewing = reviewIndex !== null;

  return (
    <div className="relative min-h-screen flex flex-col items-center px-6 py-10 md:py-14 justify-between">
      {/* Top Header Section: Orb & Question */}
      <div className="w-full flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <Orb state={isListening ? "listening" : orbState} />
        </motion.div>

        <div className="mt-6 w-full flex justify-center">
          <QuestionDisplay question={question} orbState={orbState} />
        </div>

        {/* Review Navigation Bar */}
        {isReviewing && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex items-center gap-4 rounded-full border-x border-white/10 bg-white/[0.04] backdrop-blur-xl px-5 py-2.5 shadow-xl"
          >
            <button
              onClick={onPrevious}
              disabled={reviewIndex === 0}
              className="px-4 py-1.5 rounded-full text-xs font-medium bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer text-white"
            >
              ← Previous
            </button>

            <span className="text-xs text-nebula-text/70 min-w-[90px] text-center font-medium">
              {reviewIndex + 1} / {reviewTotal}
            </span>

            <button
              onClick={onNext}
              className="px-4 py-1.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-200 hover:bg-purple-500/30 border border-purple-500/30 transition-all duration-200 cursor-pointer"
            >
              {reviewIndex === reviewTotal - 1 ? "Current Question" : "Next →"}
            </button>
          </motion.div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-2xl mt-6">
        <AnimatePresence mode="wait">
          {isReviewing ? (
            <motion.div
              key={reviewIndex}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              className="rounded-3xl border-x border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 md:p-8 space-y-6 shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-white/[0.06] pb-4">
                <h3 className="text-nebula-cyan uppercase tracking-widest text-xs font-semibold">
                  AI Evaluation
                </h3>

                <div className="text-xs px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-slate-300">
                  Reviewed Response
                </div>
              </div>

              {/* Metrics */}
              <div className="space-y-4">
                {METRIC_LABELS.map((label, i) => (
                  <div key={label}>
                    <div className="flex justify-between mb-1 text-xs font-medium">
                      <span className="text-nebula-text/70">{label}</span>
                      <span className="text-nebula-cyan font-semibold">
                        {analysis?.scores?.[i] ?? 0}%
                      </span>
                    </div>

                    <div className="h-2 rounded-full bg-black/40 overflow-hidden border border-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${analysis?.scores?.[i] ?? 0}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Reviewed Question */}
              <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4 space-y-1">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Question
                  </h4>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-cyan-400">
                    {currentTurn?.question?.difficulty || "medium"}
                  </span>
                </div>
                <p className="text-sm md:text-base text-slate-200 leading-relaxed">
                  {currentTurn?.question?.text || question?.text}
                </p>
              </div>

              {/* Candidate Response */}
              <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4 space-y-1">
                <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Your Answer
                </h4>
                <p className="text-sm md:text-base text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {currentTurn?.answer?.text || "No answer recorded."}
                </p>
              </div>

              {/* Feedback */}
              {analysis?.summary && (
                <div className="space-y-1">
                  <h4 className="text-xs uppercase tracking-wider text-purple-300 font-semibold">
                    Feedback
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {analysis.summary}
                  </p>
                  {currentTurn?.evaluation?.reason && (
                    <p className="mt-2 text-xs text-cyan-300">
                      Why this was asked: {currentTurn.evaluation.reason}
                    </p>
                  )}
                </div>
              )}

              {/* Strengths */}
              {!!analysis?.strengths?.length && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-2">
                    Strengths
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-300">
                    {analysis.strengths.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Weaknesses */}
              {!!analysis?.weaknesses?.length && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-2">
                    Areas to Improve
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-300">
                    {analysis.weaknesses.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ) : (
            <AnswerPanel
              answer={answer}
              onChangeAnswer={onChangeAnswer}
              onSubmit={onSubmit}
              disabled={submitting}
              isSupported={isSupported}
              isListening={isListening}
              onToggleVoice={onToggleVoice}
              voiceState={voiceState}
            />
          )}
        </AnimatePresence>

        {/* Sub-panel Controls: Review Button aligned under the Speak button */}
        {!isReviewing && completedCount > 0 && (
          <div className="mt-3 flex justify-start pl-1">
            <button
              onClick={onReview}
              className="text-xs font-medium text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 px-4 py-2 rounded-full backdrop-blur-md transition-all duration-300 cursor-pointer"
            >
              ← Review Previous Answers
            </button>
          </div>
        )}

        {isReviewing && (
          <div className="mt-3 flex justify-start pl-1">
            <button
              onClick={onExitReview}
              className="text-xs font-medium text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 px-4 py-2 rounded-full backdrop-blur-md transition-all duration-300 cursor-pointer"
            >
              Return to Live Interview
            </button>
          </div>
        )}
      </div>

      {/* Bottom Progress Bar Section */}
      <div className="mt-8 flex justify-center w-full">
        <InterviewProgress completed={completedCount} total={totalTarget} />
      </div>
    </div>
  );
}
