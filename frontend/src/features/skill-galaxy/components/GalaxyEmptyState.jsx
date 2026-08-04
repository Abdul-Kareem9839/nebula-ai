import React from "react";
import { Orbit } from "lucide-react";

export function GalaxyEmptyState({ error, onStartInterview }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-20">
      <div className="w-20 h-20 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-4 blur-[0.5px]">
        <Orbit
          className="w-10 h-10 text-cyan-400 animate-spin"
          style={{ animationDuration: "10s" }}
        />
      </div>
      <h3 className="text-lg font-medium text-slate-200">
        {error ? "We couldn't load your galaxy" : "No skills discovered yet"}
      </h3>
      <p className="text-xs text-slate-400 max-w-sm mt-1 mb-6">
        {error
          ? error
          : "Complete AI interviews to populate your personal Skill Galaxy and map your competencies."}
      </p>
      <button
        onClick={onStartInterview}
        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white text-xs font-semibold shadow-lg shadow-purple-500/20 hover:scale-105 transition-all cursor-pointer"
      >
        {error ? "Try again" : "Start Your First Interview →"}
      </button>
    </div>
  );
}
