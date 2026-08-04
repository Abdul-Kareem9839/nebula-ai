import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { CrystalCard } from "./CrystalCard.jsx";

export function CrystalUniverse({
  crystals = [],
  onOpenCrystal,
  onDeleteCrystal,
  deletingId,
}) {
  if (!crystals || crystals.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex min-h-[280px] w-full flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.01] p-8 text-center backdrop-blur-sm"
      >
        <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="absolute inset-0 rounded-2xl bg-cyan-500/20 blur-md" />
          <Sparkles className="relative h-6 w-6 text-cyan-400" />
        </div>
        <h3 className="font-display text-lg font-medium text-slate-200">
          No memory crystals found
        </h3>
        <p className="mt-1 text-xs text-slate-400 max-w-sm">
          Complete an interview practice session to forge your first memory
          crystal.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      <motion.div
        layout
        className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 xl:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {crystals.map((crystal, index) => (
            <motion.div
              key={crystal._id ?? crystal.id ?? index}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{
                duration: 0.4,
                delay: Math.min(index, 8) * 0.04,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <CrystalCard
                crystal={crystal}
                onOpen={onOpenCrystal}
                onDelete={onDeleteCrystal}
                isDeleting={deletingId === (crystal._id ?? crystal.id)}
                variant="grid"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
