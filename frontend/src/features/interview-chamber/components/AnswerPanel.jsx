import { motion } from "framer-motion";
import { VoiceVisualizer } from "./VoiceVisualizer.jsx";

export function AnswerPanel({
  answer,
  onChangeAnswer,
  onSubmit,
  disabled,
  isSupported,
  isListening,
  onToggleVoice,
  voiceState,
}) {
  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (!disabled && answer.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-2xl rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 p-5 md:p-6 space-y-4 shadow-2xl"
    >
      {/* PANEL HEADER */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-[0.2em] uppercase text-nebula-text/40">
          Your Response
        </span>
        {isSupported && (
          <div className="flex items-center gap-2">
            {isListening && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
            )}
            <span className="text-xs text-nebula-text/40 font-medium">
              {isListening ? "Listening…" : "Voice ready"}
            </span>
          </div>
        )}
      </div>

      {/* AUDIO WAVEFORM / VISUALIZER */}
      <VoiceVisualizer state={voiceState} />

      {/* ANSWER TEXT AREA */}
      <textarea
        className="w-full bg-black/30 rounded-2xl p-4 min-h-[120px] resize-none text-nebula-text placeholder:text-nebula-text/30 border border-white/[0.08] focus:border-nebula-glow/60 focus:ring-1 focus:ring-nebula-glow/40 focus:outline-none transition-all duration-300 text-sm md:text-base leading-relaxed"
        placeholder="Type your answer, or speak it aloud… (Ctrl + Enter to submit)"
        value={answer}
        onChange={(e) => onChangeAnswer(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />

      {/* ACTION CONTROLS */}
      <div className="flex items-center gap-3 pt-1">
        {isSupported && (
          <motion.button
            type="button"
            onClick={onToggleVoice}
            disabled={disabled}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            className={`px-6 py-3 rounded-full border text-sm font-medium transition-all duration-300 disabled:opacity-40 cursor-pointer ${
              isListening
                ? "bg-cyan-500/15 border-cyan-400/60 text-cyan-300 shadow-[0_0_15px_rgba(103,232,249,0.3)]"
                : "bg-white/[0.04] border-white/10 text-nebula-text/80 hover:border-white/20 hover:text-white"
            }`}
          >
            {isListening ? "Stop" : "Speak"}
          </motion.button>
        )}

        {/* PRIMARY SUBMIT BUTTON */}
        <div className="relative flex-1 group">
          {!disabled && answer.trim() && (
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 opacity-50 blur transition-all duration-500 group-hover:opacity-90 group-hover:blur-md" />
          )}
          <motion.button
            type="button"
            onClick={onSubmit}
            disabled={disabled || !answer.trim()}
            whileHover={!disabled && answer.trim() ? { scale: 1.01 } : {}}
            whileTap={!disabled && answer.trim() ? { scale: 0.98 } : {}}
            className="relative w-full px-6 py-3 rounded-full font-medium text-white text-sm bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
          >
            {disabled ? "Submitting…" : "Submit Answer"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
