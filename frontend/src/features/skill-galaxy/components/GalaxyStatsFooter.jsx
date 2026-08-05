import React from "react";
import {
  Star,
  Flame,
  TrendingUp,
  AlertTriangle,
  Brain,
  MessageSquare,
} from "lucide-react";

/**
 * FOOTER COMPONENT DISPLAYING OVERALL GALAXY & SKILL METRICS
 */
export function GalaxyStatsFooter({ stats }) {
  if (!stats) return null;

  return (
    <div className="relative z-20 max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* TOTAL SKILLS CARD */}
      <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border-x border-white/10 shadow-lg">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">
          Total Skills
        </span>
        <p className="text-lg font-semibold text-slate-100 mt-0.5 flex items-center gap-1.5">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400/20" />
          <span>{stats.totalSkills}</span>
        </p>
      </div>

      {/* STRONGEST SKILL CARD */}
      <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border-x border-white/10 shadow-lg">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">
          Strongest
        </span>
        <p className="text-sm font-semibold text-emerald-300 mt-0.5 truncate flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate">{stats.strongest?.name || "N/A"}</span>
        </p>
      </div>

      {/* MOST IMPROVED SKILL CARD */}
      <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border-x border-white/10 shadow-lg">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">
          Most Improved
        </span>
        <p className="text-sm font-semibold text-cyan-300 mt-0.5 truncate flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="truncate">{stats.mostImproved?.name || "N/A"}</span>
        </p>
      </div>

      {/* NEEDS PRACTICE CARD */}
      <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border-x border-white/10 shadow-lg">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">
          Needs Practice
        </span>
        <p className="text-sm font-semibold text-amber-300 mt-0.5 truncate flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="truncate">{stats.weakest?.name || "N/A"}</span>
        </p>
      </div>

      {/* AI CONFIDENCE CARD */}
      <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border-x border-white/10 shadow-lg">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">
          AI Confidence
        </span>
        <p className="text-lg font-semibold text-purple-300 mt-0.5 flex items-center gap-1.5">
          <Brain className="w-4 h-4 text-purple-400" />
          <span>{stats.overallConfidence}%</span>
        </p>
      </div>

      {/* AVERAGE INTERVIEW SCORE CARD */}
      <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border-x border-white/10 shadow-lg">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">
          Avg Interview Score
        </span>
        <p className="text-lg font-semibold text-slate-100 mt-0.5 flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-slate-400" />
          <span>{stats.avgInterviewScore}%</span>
        </p>
      </div>
    </div>
  );
}
