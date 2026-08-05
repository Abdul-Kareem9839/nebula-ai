import React from "react";

export function GalaxyHeader({
  searchQuery,
  onSearchChange,
  filterCategory,
  onFilterChange,
  onResetView,
}) {
  return (
    <div className="relative z-20 px-6 pt-8 pb-4 max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-medium tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
          Skill Galaxy
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Interactive map of your technical mastery, interview readiness, and
          skill growth.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 no-pan">
        <div className="relative">
          <input
            type="text"
            placeholder="Search skill..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 w-40 md:w-52 transition-all"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => onFilterChange(e.target.value)}
          className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-purple-500/50 cursor-pointer"
        >
          <option value="All" className="bg-slate-900 text-slate-200">
            All Tiers
          </option>
          <option value="Strong" className="bg-slate-900 text-slate-200">
            Strong (&gt;70%)
          </option>
          <option value="Medium" className="bg-slate-900 text-slate-200">
            Medium (50-70%)
          </option>
          <option
            value="Needs Practice"
            className="bg-slate-900 text-slate-200"
          >
            Needs Practice (&lt;50%)
          </option>
        </select>

        <button
          onClick={onResetView}
          className="px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-xs text-slate-300 hover:bg-white/10 transition cursor-pointer"
        >
          Reset View
        </button>
      </div>
    </div>
  );
}
