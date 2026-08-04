import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const STATE_LABEL = {
  idle: "Ready",
  thinking: "Thinking",
  speaking: "Speaking",
  listening: "Listening",
  analyzing: "Analyzing",
};

/**
 * Renders the current question as an AI message with a soft typing
 * reveal. Supports both:
 * - question: "What is React?"
 * - question: { text: "What is React?", topic, difficulty }
 */
export function QuestionDisplay({ question, orbState = "idle" }) {
  const [typed, setTyped] = useState("");

  // Normalize question to a string
  const questionText =
    typeof question === "string" ? question : (question?.text ?? "");

  useEffect(() => {
    if (!questionText) {
      setTyped("");
      return;
    }

    setTyped("");

    let i = 0;

    const speed = Math.max(8, Math.min(22, 900 / questionText.length));

    const interval = setInterval(() => {
      i++;

      setTyped(questionText.slice(0, i));

      if (i >= questionText.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [questionText]);

  return (
    <div className="w-full max-w-2xl flex flex-col items-center text-center gap-3">
      <AnimatePresence mode="wait">
        <motion.div
          key={orbState}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-nebula-cyan/70"
        >
          <span
            className="inline-block w-1.5 h-1.5 rounded-full bg-nebula-cyan"
            style={{ boxShadow: "0 0 8px rgba(103,232,249,0.8)" }}
          />
          AI Interviewer &middot; {STATE_LABEL[orbState] || "Ready"}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.p
          key={questionText || "loading"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-xl md:text-2xl font-medium leading-relaxed text-nebula-text min-h-[3.5rem]"
        >
          {questionText ? typed : "Preparing your first question…"}

          {questionText && typed.length < questionText.length && (
            <span className="inline-block w-[2px] h-5 ml-1 align-middle bg-nebula-cyan animate-pulse" />
          )}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
