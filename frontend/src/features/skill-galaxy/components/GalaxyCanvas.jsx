import React from "react";
import { motion } from "framer-motion";
import { SKILL_RELATIONS } from "../utils/skillHelpers.js";
import { GalaxyEmptyState } from "./GalaxyEmptyState.jsx";
import { SkillNode } from "./SkillNode.jsx";

export function GalaxyCanvas({
  hasSkills,
  error,
  onStartInterview,
  zoomLevel,
  panOffset,
  positionedSkills,
  filteredSet,
  searchQuery,
  selectedSkill,
  hoveredSkill,
  stats,
  onWheel,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onSelectSkill,
  onHoverSkill,
}) {
  return (
    <div
      className="relative w-full h-[62vh] md:h-[66vh] overflow-hidden cursor-grab active:cursor-grabbing border-x border-white/10"
      onWheel={onWheel}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {!hasSkills ? (
        <GalaxyEmptyState error={error} onStartInterview={onStartInterview} />
      ) : (
        /* GALAXY CANVAS WORLD */
        <div
          className="absolute left-1/2 top-1/2 transition-transform duration-300 ease-out"
          style={{
            transform: `translate(calc(-50% + ${panOffset.x}px), calc(-50% + ${panOffset.y}px)) scale(${zoomLevel})`,
          }}
        >
          {/* Orbit Rings */}
          {[150, 240, 330, 420].map((r, idx) => (
            <motion.div
              key={r}
              className="absolute rounded-full border border-white/[0.07] pointer-events-none -translate-x-1/2 -translate-y-1/2"
              style={{ width: r * 2, height: r * 2 }}
              animate={{ rotate: idx % 2 === 0 ? 360 : -360 }}
              transition={{
                duration: 120 + idx * 30,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}

          {/* SVG SKILL CONNECTIONS */}
          <svg className="absolute overflow-visible pointer-events-none -translate-x-1/2 -translate-y-1/2 w-0 h-0">
            {SKILL_RELATIONS.map(([fromName, toName], i) => {
              const source = positionedSkills.find((s) => s.name === fromName);
              const target = positionedSkills.find((s) => s.name === toName);
              if (!source || !target) return null;

              const isHighlighted =
                hoveredSkill?.name === fromName ||
                hoveredSkill?.name === toName ||
                selectedSkill?.name === fromName ||
                selectedSkill?.name === toName;

              return (
                <line
                  key={i}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={
                    isHighlighted ? "#cyan-400" : "rgba(167, 139, 250, 0.25)"
                  }
                  strokeWidth={isHighlighted ? 2 : 1}
                  strokeDasharray={isHighlighted ? "none" : "4 4"}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>

          {/* CENTRAL GALAXY CORE */}
          <motion.div
            className="absolute -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full bg-gradient-to-tr from-purple-600/40 via-indigo-600/30 to-cyan-400/40 border border-white/20 backdrop-blur-md shadow-[0_0_50px_rgba(168,85,247,0.4)] flex flex-col items-center justify-center text-center z-10 pointer-events-none"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-purple-200 font-semibold">
              AI Confidence
            </span>
            <span className="font-display text-3xl font-bold bg-gradient-to-b from-white to-purple-200 bg-clip-text text-transparent">
              {stats?.overallConfidence}%
            </span>
            <span className="text-[9px] text-slate-300/80 mt-0.5">
              {stats?.totalSkills} Core Competencies
            </span>
          </motion.div>

          {/* PLANET / SKILL NODES */}
          {positionedSkills.map((skill) => (
            <SkillNode
              key={skill._id}
              skill={skill}
              isMatch={filteredSet.has(skill._id)}
              searchQuery={searchQuery}
              isSelected={selectedSkill?._id === skill._id}
              isHovered={hoveredSkill?._id === skill._id}
              onSelect={() => onSelectSkill(skill)}
              onHoverStart={() => onHoverSkill(skill)}
              onHoverEnd={() => onHoverSkill(null)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
