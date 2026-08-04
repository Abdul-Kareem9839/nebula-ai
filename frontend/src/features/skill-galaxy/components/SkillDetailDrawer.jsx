import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SkillDetailDrawer({ selectedSkill, onClose, onStartInterview }) {
  return (
    <AnimatePresence>
      {selectedSkill && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-slate-950/90 backdrop-blur-2xl border-l border-white/10 p-6 z-50 overflow-y-auto shadow-2xl flex flex-col justify-between"
        >
          <div>
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-purple-400 font-semibold">
                  Skill Deep Dive
                </span>
                <h2 className="text-xl font-semibold text-slate-100">
                  {selectedSkill.name}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Confidence Progress */}
            <div className="mt-5 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Mastery Level</span>
                <span className="text-cyan-300 font-semibold">
                  {Math.round(selectedSkill.confidence * 100)}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-black/50 overflow-hidden border border-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400"
                  style={{ width: `${selectedSkill.confidence * 100}%` }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mt-5">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                  Avg Score
                </span>
                <p className="text-lg font-semibold text-slate-100">
                  {selectedSkill.avgScore || 85}%
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                  Questions
                </span>
                <p className="text-lg font-semibold text-slate-100">
                  {selectedSkill.questionsAnswered || 12}
                </p>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="mt-6 space-y-4">
              {selectedSkill.strengths?.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-2">
                    Key Strengths
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {selectedSkill.strengths.map((st, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-emerald-400 font-bold">✓</span>{" "}
                        {st}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedSkill.weakAreas?.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-2">
                    Focus Areas
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {selectedSkill.weakAreas.map((wa, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold">⚠</span>{" "}
                        {wa}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-6 border-t border-white/10">
            <button
              onClick={onStartInterview}
              className="w-full py-3 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white text-xs font-semibold shadow-lg shadow-purple-500/20 hover:opacity-90 transition cursor-pointer"
            >
              Practice Questions for {selectedSkill.name} →
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
