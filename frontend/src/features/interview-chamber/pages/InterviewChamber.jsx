import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useVoice } from "../../orb/useVoice.js";
import { api } from "../../../shared/api/client.js";
import { StarBackground } from "../../universe/StarBackground.jsx";
import { InterviewRoom } from "../components/InterviewRoom.jsx";
import { InterviewCompleted } from "../components/InterviewCompleted.jsx";
import { OverallScore } from "../components/OverallScore.jsx";
import { InterviewReport } from "../components/InterviewReport.jsx";
import { EvaluatingOverlay } from "../components/EvaluatingOverlay.jsx";

const PROGRESS_TARGET = 5;
const SUCCESS_SCREEN_MS = 2800;

const PHASE_TRANSITION = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: {
    duration: 0.5,
    ease: [0.16, 1, 0.3, 1],
  },
};

export function InterviewChamber() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [orbState, setOrbState] = useState("idle");
  const [answer, setAnswer] = useState("");

  const [phase, setPhase] = useState("interview");
  const [evaluating, setEvaluating] = useState(false);

  // Review mode
  const [reviewIndex, setReviewIndex] = useState(null);

  const {
    isSupported,
    isListening,
    transcript,
    startListening,
    stopListening,
    speak,
  } = useVoice();

  useEffect(() => {
    api.get(`/interviews/${id}`).then(({ data }) => {
      setInterview(data.interview);
    });
  }, [id]);

  useEffect(() => {
    if (transcript) {
      setAnswer(transcript);
    }
  }, [transcript]);

  async function handleSubmit() {
    if (!answer.trim()) return;

    const likelyFinal = interview
      ? interview.turns.length + 1 >=
        (interview.maxQuestions ?? PROGRESS_TARGET)
      : false;

    if (likelyFinal) {
      setEvaluating(true);
    } else {
      setOrbState("thinking");
    }

    const { data } = await api.post(`/interviews/${id}/answer`, {
      answer,
    });

    if (data.interview.status === "completed") {
      setInterview(data.interview);
      setAnswer("");
      setEvaluating(false);
      setOrbState("celebrating");

      setPhase("success");

      setTimeout(() => {
        setPhase("score");
      }, SUCCESS_SCREEN_MS);

      return;
    }

    setInterview(data.interview);

    setAnswer("");

    setEvaluating(false);

    setOrbState("speaking");

    const latestQuestion =
      data.interview.turns[data.interview.turns.length - 1]?.question?.text;

    if (latestQuestion) {
      speak(latestQuestion);
    }

    setTimeout(() => {
      setOrbState("idle");
    }, 1800);
  }

  function handleBackToDashboard() {
    navigate("/home");
  }

  // -------------------------
  // Completed Questions
  // -------------------------

  const completedTurns =
    interview?.turns.filter((turn) => turn.answer?.text) || [];

  // -------------------------
  // Live vs Review Mode
  // -------------------------

  const currentTurn =
    reviewIndex !== null
      ? completedTurns[reviewIndex]
      : interview?.turns[interview?.turns.length - 1];

  const currentQuestion = currentTurn?.question?.text ?? "";

  // -------------------------
  // Proper analysis mapping
  // -------------------------

  const analysis = currentTurn?.evaluation
    ? {
        scores: [
          currentTurn.evaluation.technical ?? currentTurn.evaluation.score ?? 0,

          currentTurn.evaluation.communication ??
            currentTurn.evaluation.score ??
            0,

          currentTurn.evaluation.confidence ??
            currentTurn.evaluation.score ??
            0,
        ],

        summary: currentTurn.evaluation.feedback ?? "",

        strengths: currentTurn.evaluation.strengths ?? [],

        weaknesses: currentTurn.evaluation.weaknesses ?? [],
      }
    : null;

  const completedCount = completedTurns.length;

  // -------------------------
  // Review Controls
  // -------------------------

  function startReview() {
    if (!completedTurns.length) return;

    setReviewIndex(completedTurns.length - 1);
  }

  function showPrevious() {
    if (reviewIndex === null) return;

    setReviewIndex((prev) => Math.max(0, prev - 1));
  }

  function showNext() {
    if (reviewIndex === null) return;

    if (reviewIndex >= completedTurns.length - 1) {
      setReviewIndex(null);
      return;
    }

    setReviewIndex((prev) => prev + 1);
  }

  return (
    <div className="relative min-h-screen bg-nebula-bg overflow-hidden">
      <StarBackground />

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {phase === "success" && (
            <motion.div key="success" {...PHASE_TRANSITION}>
              <InterviewCompleted />
            </motion.div>
          )}

          {phase === "score" && (
            <motion.div key="score" {...PHASE_TRANSITION}>
              <OverallScore
                interview={interview}
                onViewReport={() => setPhase("report")}
                onBackToDashboard={handleBackToDashboard}
              />
            </motion.div>
          )}

          {phase === "report" && (
            <motion.div key="report" {...PHASE_TRANSITION}>
              <InterviewReport
                interview={interview}
                onBackToDashboard={handleBackToDashboard}
              />
            </motion.div>
          )}

          {phase === "interview" && (
            <motion.div key="interview" {...PHASE_TRANSITION}>
              <InterviewRoom
                question={currentQuestion}
                orbState={orbState}
                completedCount={completedCount}
                totalTarget={interview?.maxQuestions ?? PROGRESS_TARGET}
                answer={
                  reviewIndex !== null
                    ? (currentTurn?.answer?.text ?? "")
                    : answer
                }
                onChangeAnswer={reviewIndex !== null ? () => {} : setAnswer}
                onSubmit={handleSubmit}
                submitting={orbState === "thinking" || evaluating}
                isSupported={isSupported}
                isListening={isListening}
                onToggleVoice={isListening ? stopListening : startListening}
                analysis={analysis}
                // Review
                reviewIndex={reviewIndex}
                reviewTotal={completedTurns.length}
                onPrevious={showPrevious}
                onNext={showNext}
                onReview={startReview}
                onExitReview={() => setReviewIndex(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>{evaluating && <EvaluatingOverlay />}</AnimatePresence>
    </div>
  );
}
