import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

function getPerformanceStyle(overallScore) {
  const hasScore = overallScore != null && overallScore > 0;

  if (!hasScore) {
    return {
      // Cosmic Deep Indigo -> Vibrant Cyan Accent (Unrated / Pending)
      gradient:
        "linear-gradient(135deg, #312e81 0%, #1e1b4b 45%, #06b6d4 100%)",
      glow: "rgba(6, 182, 212, 0.5)",
      shadow: "0 0 12px rgba(6, 182, 212, 0.35)",
      label: "Unrated",
    };
  }
  if (overallScore >= 81) {
    return {
      // Radiant Gold / Amber
      gradient:
        "linear-gradient(135deg, #fef3c7 0%, #f59e0b 50%, #d97706 100%)",
      glow: "rgba(245, 158, 11, 0.6)",
      shadow: "0 0 16px rgba(245, 158, 11, 0.45)",
      label: "Golden",
    };
  }
  if (overallScore >= 61) {
    return {
      // Deep Purple / Violet
      gradient:
        "linear-gradient(135deg, #c084fc 0%, #9333ea 50%, #4c1d95 100%)",
      glow: "rgba(147, 51, 234, 0.55)",
      shadow: "0 0 14px rgba(147, 51, 234, 0.4)",
      label: "Purple",
    };
  }
  return {
    // Sapphire Blue / Sky
    gradient: "linear-gradient(135deg, #38bdf8 0%, #0284c7 50%, #0f172a 100%)",
    glow: "rgba(56, 189, 248, 0.5)",
    shadow: "0 0 12px rgba(56, 189, 248, 0.35)",
    label: "Blue",
  };
}

function formatDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function CrystalCard({
  crystal,
  onOpen,
  onDelete,
  isDeleting = false,
  variant = "grid",
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const hasScore = crystal?.overallScore != null && crystal?.overallScore > 0;
  const perf = getPerformanceStyle(crystal?.overallScore);
  const dateLabel = formatDate(crystal?.createdAt);
  const questionCount = Array.isArray(crystal?.turns)
    ? crystal.turns.length
    : 0;
  const statusLabel = (crystal?.status || "completed").replace(/_/g, " ");
  const rarityLabel = hasScore ? `${perf.label} Crystal` : "Unrated Crystal";

  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  if (variant === "grid") {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.995 }}
        onClick={() => onOpen?.(crystal)}
        className="group relative flex w-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-5 text-left transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04]"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pr-6">
          <div>
            <p className="font-display text-lg font-semibold text-nebula-text group-hover:text-nebula-cyan transition-colors">
              {crystal?.role || "Interview"}
            </p>
            <p className="mt-0.5 text-xs text-nebula-text/40 capitalize">
              {[crystal?.type, crystal?.skillLevel]
                .filter(Boolean)
                .join(" • ") || "Practice session"}
            </p>
          </div>

          {/* Polygon Crystal Accent with Dual Ambient Glow */}
          <div className="relative shrink-0 flex items-center justify-center">
            {/* Background Ambient Glow */}
            <div
              className="absolute inset-0 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ background: perf.glow }}
            />

            {/* Polygon Crystal Shape */}
            <div
              className="relative h-10 w-10 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
              style={{
                background: perf.gradient,
                boxShadow: perf.shadow,
                clipPath:
                  "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
              }}
            />
          </div>
        </div>

        {/* Middle Score / Status Section */}
        <div className="mt-6 flex items-end justify-between border-t border-white/5 pt-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-nebula-text/35">
              Overall
            </p>
            {hasScore ? (
              <p className="mt-1 font-display text-2xl font-bold text-nebula-cyan">
                {Math.round(crystal.overallScore)}
                <span className="text-xs font-normal text-nebula-text/40">
                  %
                </span>
              </p>
            ) : (
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-amber-300/80">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Pending Evaluation</span>
              </div>
            )}
          </div>

          <div className="text-right">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-nebula-text/35">
              Rarity
            </p>
            <p className="mt-1 text-xs font-medium text-nebula-glow">
              {rarityLabel}
            </p>
          </div>
        </div>

        {/* Meta Information Row */}
        <div className="mt-4 flex items-center justify-between text-xs text-nebula-text/40">
          <span className="capitalize">{statusLabel}</span>
          <span>•</span>
          <span>{dateLabel || "New memory"}</span>
          <span>•</span>
          <span>{questionCount} Qs</span>
        </div>

        {/* Bottom Action Line */}
        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-xs">
          <span className="text-nebula-text/35">View details</span>
          <span className="font-medium text-nebula-cyan group-hover:translate-x-0.5 transition-transform">
            View Memory →
          </span>
        </div>

        {/* Action Menu Toggle (Isolated Container) */}
        <div ref={menuRef} className="absolute right-3 top-3 z-10">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setMenuOpen((value) => !value);
            }}
            className="p-1.5 rounded-lg text-xs text-nebula-text/40 hover:text-nebula-text hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all"
            aria-label="Open memory actions"
          >
            ⋯
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                className="absolute right-0 top-7 z-20 min-w-[8.5rem] rounded-xl border border-white/10 bg-nebula-surface/95 p-1 shadow-xl backdrop-blur-xl"
              >
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setMenuOpen(false);
                    onOpen?.(crystal);
                  }}
                  className="w-full rounded-lg px-3 py-1.5 text-left text-xs text-nebula-text/80 hover:bg-white/[0.06] transition-colors"
                >
                  Open Memory
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setMenuOpen(false);
                    onDelete?.(crystal);
                  }}
                  disabled={isDeleting}
                  className="w-full rounded-lg px-3 py-1.5 text-left text-xs text-red-300 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? "Deleting…" : "Delete Memory"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  return null;
}
