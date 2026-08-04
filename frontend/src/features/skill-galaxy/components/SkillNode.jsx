import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TIER_CONFIG } from "../utils/skillHelpers.js";

export function SkillNode({
  skill,
  isMatch,
  searchQuery,
  isSelected,
  isHovered,
  onSelect,
  onHoverStart,
  onHoverEnd,
}) {
  const cfg = TIER_CONFIG[skill.tier];

  return (
    <div
      className="interactive-node absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-opacity duration-300"
      style={{
        left: skill.x,
        top: skill.y,
        opacity: isMatch
          ? searchQuery &&
            !skill.name.toLowerCase().includes(searchQuery.toLowerCase())
            ? 0.3
            : 1
          : 0.25,
        zIndex: isSelected || isHovered ? 30 : 20,
      }}
      onClick={onSelect}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      {/* Planet Orb */}
      <motion.div
        className="relative rounded-full flex items-center justify-center"
        style={{
          width: cfg.baseSize,
          height: cfg.baseSize,
          background: `radial-gradient(circle at 30% 30%, #ffffff 0%, ${cfg.color} 70%, #000 100%)`,
          boxShadow: isSelected
            ? `0 0 35px 8px ${cfg.color}`
            : isHovered
              ? `0 0 25px 6px ${cfg.color}`
              : cfg.glow,
        }}
        animate={{ y: [0, -5, 0] }}
        transition={{
          duration: 3 + (skill.ring % 3),
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Ring for Excellent Skills */}
        {skill.tier === "excellent" && (
          <div className="absolute w-[160%] h-[40%] rounded-full border border-amber-300/60 rotate-[-25deg] pointer-events-none" />
        )}

        <span className="text-[10px] font-bold text-black/90">
          {Math.round(skill.confidence * 100)}%
        </span>
      </motion.div>

      {/* Skill Label Tag */}
      <div className="mt-1.5 text-center">
        <span className="text-[11px] font-medium text-slate-200 tracking-wide backdrop-blur-md bg-black/60 px-2 py-0.5 rounded-full border border-white/10 whitespace-nowrap shadow-md">
          {skill.name}
        </span>
      </div>

      {/* HOVER TOOLTIP */}
      <AnimatePresence>
        {isHovered && !isSelected && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-48 p-3 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/15 shadow-2xl pointer-events-none text-left z-40"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-100">
                {skill.name}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-medium">
                {cfg.label}
              </span>
            </div>
            <div className="text-[11px] text-slate-300 space-y-0.5">
              <p>
                Avg Score:{" "}
                <span className="text-cyan-300 font-medium">
                  {Math.round(skill.avgScore ?? skill.score ?? 0)}%
                </span>
              </p>
              <p>
                Questions:{" "}
                <span className="text-slate-200">
                  {skill.questionsAnswered || 0}
                </span>
              </p>
              <p>
                Last Improved:{" "}
                <span className="text-slate-400">
                  {skill.lastImproved || "Recently"}
                </span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
