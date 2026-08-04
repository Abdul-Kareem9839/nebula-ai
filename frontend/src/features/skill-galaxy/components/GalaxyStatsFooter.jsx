import React from "react";

export function GalaxyStatsFooter({ stats }) {
  if (!stats) return null;

  return (
    <div className="relative z-20 max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border-x border-white/10 shadow-lg">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">
          Total Skills
        </span>
        <p className="text-lg font-semibold text-slate-100 mt-0.5">
          ⭐ {stats.totalSkills}
        </p>
      </div>
      <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border-x border-white/10 shadow-lg">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">
          Strongest
        </span>
        <p className="text-sm font-semibold text-emerald-300 mt-0.5 truncate">
          🔥 {stats.strongest?.name || "N/A"}
        </p>
      </div>
      <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border-x border-white/10 shadow-lg">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">
          Most Improved
        </span>
        <p className="text-sm font-semibold text-cyan-300 mt-0.5 truncate">
          📈 {stats.mostImproved?.name || "N/A"}
        </p>
      </div>
      <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border-x border-white/10 shadow-lg">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">
          Needs Practice
        </span>
        <p className="text-sm font-semibold text-amber-300 mt-0.5 truncate">
          ⚠ {stats.weakest?.name || "N/A"}
        </p>
      </div>
      <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border-x border-white/10 shadow-lg">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">
          AI Confidence
        </span>
        <p className="text-lg font-semibold text-purple-300 mt-0.5">
          🧠 {stats.overallConfidence}%
        </p>
      </div>
      <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border-x border-white/10 shadow-lg">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">
          Avg Interview Score
        </span>
        <p className="text-lg font-semibold text-slate-100 mt-0.5">
          💬 {stats.avgInterviewScore}%
        </p>
      </div>
    </div>
  );
}
