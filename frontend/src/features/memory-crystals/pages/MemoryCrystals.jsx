import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../../shared/api/client.js";
import { StarBackground } from "../../universe/StarBackground.jsx";
import { CrystalUniverse } from "../components/CrystalUniverse.jsx";
import { CrystalTimeline } from "../components/CrystalTimeline.jsx";
import { CrystalDetail } from "../components/CrystalDetail.jsx";
import { CrystalFilters } from "../components/CrystalFilters.jsx";

const DEFAULT_FILTERS = {
  search: "",
  role: "all",
  type: "all",
  status: "all",
  scoreBand: "all",
  sort: "newest",
};

function scoreInBand(score, band) {
  if (band === "all") return true;
  const hasScore = typeof score === "number" && score > 0;
  if (!hasScore) return false;
  const [min, max] = band.split("-").map(Number);
  return score >= min && score <= max;
}

export function MemoryCrystals() {
  const [crystals, setCrystals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [view, setView] = useState("universe");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [comparisonSelection, setComparisonSelection] = useState([]);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let active = true;

    api
      .get("/interviews")
      .then(({ data }) => {
        if (!active) return;
        setCrystals(data.interviews ?? []);
      })
      .catch(() => {
        if (active) setLoadError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const roleOptions = useMemo(() => {
    const roles = [
      ...new Set(crystals.map((c) => c.role).filter(Boolean)),
    ].sort();
    return [
      { value: "all", label: "All Roles" },
      ...roles.map((r) => ({ value: r, label: r })),
    ];
  }, [crystals]);

  const typeOptions = useMemo(() => {
    const types = [
      ...new Set(crystals.map((c) => c.type).filter(Boolean)),
    ].sort();
    return [
      { value: "all", label: "All Types" },
      ...types.map((t) => ({
        value: t,
        label: t.charAt(0).toUpperCase() + t.slice(1),
      })),
    ];
  }, [crystals]);

  const statusOptions = useMemo(() => {
    const statuses = [
      ...new Set(crystals.map((c) => c.status).filter(Boolean)),
    ].sort();
    return [
      { value: "all", label: "All Status" },
      ...statuses.map((status) => ({
        value: status,
        label: status
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase()),
      })),
    ];
  }, [crystals]);

  const summaryStats = useMemo(() => {
    const scored = crystals.filter(
      (crystal) =>
        typeof crystal.overallScore === "number" && crystal.overallScore > 0,
    );
    const total = crystals.length;
    const completed = crystals.filter(
      (crystal) =>
        (crystal.status || "completed").toLowerCase() === "completed",
    ).length;
    const averageScore = scored.length
      ? scored.reduce((sum, crystal) => sum + crystal.overallScore, 0) /
        scored.length
      : null;
    const bestCrystal = scored.reduce((best, crystal) => {
      if (!best) return crystal;
      return crystal.overallScore > best.overallScore ? crystal : best;
    }, null);

    return {
      total,
      completed,
      averageScore,
      bestCrystal,
    };
  }, [crystals]);

  const filteredCrystals = useMemo(() => {
    const q = filters.search.trim().toLowerCase();

    const filtered = crystals.filter((c) => {
      if (filters.role !== "all" && c.role !== filters.role) return false;
      if (filters.type !== "all" && c.type !== filters.type) return false;
      if (
        filters.status !== "all" &&
        (c.status || "completed") !== filters.status
      )
        return false;
      if (!scoreInBand(c.overallScore, filters.scoreBand)) return false;
      if (q) {
        const haystack = [
          c.role,
          c.type,
          c.skillLevel,
          c.summary?.overallFeedback,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    filtered.sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      if (filters.sort === "highest") {
        const scoreA = typeof a.overallScore === "number" ? a.overallScore : -1;
        const scoreB = typeof b.overallScore === "number" ? b.overallScore : -1;
        return scoreB - scoreA || db - da;
      }
      return filters.sort === "newest" ? db - da : da - db;
    });

    return filtered;
  }, [crystals, filters]);

  const setFilter = (key) => (value) =>
    setFilters((f) => ({ ...f, [key]: value }));

  function handleSelectForComparison(crystal) {
    setComparisonSelection((current) => {
      if (current.some((item) => item._id === crystal._id)) {
        return current.filter((item) => item._id !== crystal._id);
      }
      if (current.length >= 2) {
        return [current[1], crystal];
      }
      return [...current, crystal];
    });
  }

  async function handleOpenCrystal(crystal) {
    setSelected(crystal);

    const hasDetails = Boolean(
      crystal?.turns?.length ||
      crystal?.summary?.overallFeedback ||
      crystal?.skills?.length,
    );

    if (hasDetails) return;

    setDetailLoading(true);
    try {
      const { data } = await api.get(`/interviews/${crystal._id}`);
      setSelected(data.interview ?? data.data ?? crystal);
    } catch {
      setSelected(crystal);
    } finally {
      setDetailLoading(false);
    }
  }

  async function handleDeleteCrystal(crystal) {
    if (!crystal?._id) return;
    const confirmed = window.confirm(
      "Delete this interview memory? This action cannot be undone.",
    );
    if (!confirmed) return;

    setDeleteLoadingId(crystal._id);
    try {
      await api.delete(`/interviews/${crystal._id}`);
      setCrystals((current) =>
        current.filter((item) => item._id !== crystal._id),
      );
      setComparisonSelection((current) =>
        current.filter((item) => item._id !== crystal._id),
      );
      if (selected?._id === crystal._id) {
        setSelected(null);
      }
      setToast({
        type: "success",
        message: "Interview removed from your memory universe.",
      });
    } catch {
      setToast({
        type: "error",
        message: "Unable to delete this interview right now.",
      });
    } finally {
      setDeleteLoadingId(null);
    }
  }

  return (
    <div className="relative min-h-screen">
      <StarBackground />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* HEADER TITLE */}
        <motion.div
          className="mx-auto mb-8 max-w-3xl text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="text-xs uppercase tracking-[0.32em] text-nebula-cyan/70 font-semibold">
            Memory Vault
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-nebula-text sm:text-4xl">
            Your Saved Practice Sessions
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-nebula-text/55">
            Every session analyzed, rated, and saved to help you master your
            next interview.
          </p>
        </motion.div>

        {/* FLOATING TOAST NOTIFICATION */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.95 }}
              className={`fixed right-6 top-6 z-[60] max-w-sm rounded-2xl border px-4 py-3 text-xs font-medium shadow-2xl backdrop-blur-xl ${
                toast.type === "error"
                  ? "border-rose-500/30 bg-rose-950/80 text-rose-200"
                  : "border-cyan-500/30 bg-slate-900/90 text-cyan-200"
              }`}
            >
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* LOADING SKELETON */}
        {loading ? (
          <div className="grid gap-4 py-12 grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-24 animate-pulse rounded-2xl border border-white/5 bg-white/[0.02]"
              />
            ))}
          </div>
        ) : loadError ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-white/10 bg-white/[0.04] px-8 py-12 text-center backdrop-blur-xl"
          >
            <p className="font-display text-lg text-nebula-text">
              We hit a snag loading your memories.
            </p>
            <p className="mt-2 text-xs text-nebula-text/55">
              Refresh the page or try again in a moment.
            </p>
            <button
              type="button"
              onClick={() => {
                setLoadError(false);
                setLoading(true);
                api
                  .get("/interviews")
                  .then(({ data }) => setCrystals(data.interviews ?? []))
                  .catch(() => setLoadError(true))
                  .finally(() => setLoading(false));
              }}
              className="mt-5 rounded-full border border-nebula-cyan/30 bg-nebula-cyan/10 px-5 py-2 text-xs font-medium text-nebula-cyan hover:bg-nebula-cyan/20 transition-colors"
            >
              Retry Connection
            </button>
          </motion.div>
        ) : crystals.length === 0 ? (
          <motion.div
            className="mx-auto flex max-w-2xl flex-col items-center rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-20 text-center backdrop-blur-xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-display text-lg text-nebula-text/90">
              No interviews yet.
            </p>
            <p className="mt-2 max-w-sm text-xs text-nebula-text/50">
              Start your first interview to create your first memory crystal.
            </p>
            <a
              href="/start-interview"
              className="mt-5 rounded-full border border-nebula-cyan/30 bg-nebula-cyan/10 px-5 py-2 text-xs font-medium text-nebula-cyan hover:bg-nebula-cyan/20 transition-colors"
            >
              Start Interview
            </a>
          </motion.div>
        ) : (
          <>
            {/* STATS OVERVIEW */}
            <motion.div
              className="mb-6 grid gap-3 grid-cols-2 xl:grid-cols-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-nebula-text/40">
                  Total Interviews
                </p>
                <p className="mt-2 font-display text-2xl font-bold text-nebula-text">
                  {summaryStats.total}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-nebula-text/40">
                  Average Score
                </p>
                <p className="mt-2 font-display text-2xl font-bold text-nebula-cyan">
                  {summaryStats.averageScore
                    ? `${Math.round(summaryStats.averageScore)}%`
                    : "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-nebula-text/40">
                  Best Crystal
                </p>
                {summaryStats.bestCrystal ? (
                  <>
                    <p className="mt-1 font-display text-sm font-semibold text-nebula-glow truncate">
                      {summaryStats.bestCrystal.role}
                    </p>
                    <p className="mt-0.5 text-xs text-nebula-cyan font-medium">
                      {Math.round(summaryStats.bestCrystal.overallScore)}%
                    </p>
                  </>
                ) : (
                  <p className="mt-2 text-xs text-nebula-text/50">
                    Pending Evaluation
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-nebula-text/40">
                  Completed
                </p>
                <p className="mt-2 font-display text-2xl font-bold text-nebula-text">
                  {summaryStats.completed}
                </p>
              </div>
            </motion.div>

            {/* FILTER TOOLBAR */}
            <CrystalFilters
              search={filters.search}
              onSearchChange={setFilter("search")}
              role={filters.role}
              onRoleChange={setFilter("role")}
              roleOptions={roleOptions}
              type={filters.type}
              onTypeChange={setFilter("type")}
              typeOptions={typeOptions}
              status={filters.status}
              onStatusChange={setFilter("status")}
              statusOptions={statusOptions}
              scoreBand={filters.scoreBand}
              onScoreBandChange={setFilter("scoreBand")}
              sort={filters.sort}
              onSortChange={setFilter("sort")}
              view={view}
              onViewChange={setView}
              resultCount={filteredCrystals.length}
              onReset={() => setFilters(DEFAULT_FILTERS)}
            />

            {/* MAIN VIEWS CONTAINER */}
            {filteredCrystals.length === 0 ? (
              <motion.div
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center backdrop-blur-xl"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="font-display text-lg text-nebula-text">
                  No memories match these filters.
                </p>
                <p className="mt-1 text-xs text-nebula-text/50">
                  Try changing the filters or resetting search to view your
                  collection.
                </p>
              </motion.div>
            ) : view === "universe" ? (
              <CrystalUniverse
                crystals={filteredCrystals}
                onOpenCrystal={handleOpenCrystal}
                onDeleteCrystal={handleDeleteCrystal}
                deletingId={deleteLoadingId}
              />
            ) : (
              <CrystalTimeline
                crystals={filteredCrystals}
                onOpenCrystal={handleOpenCrystal}
              />
            )}
          </>
        )}

        {/* SELECTED CRYSTAL MODAL / DETAIL DRAWER */}
        <AnimatePresence>
          {selected && (
            <CrystalDetail
              crystal={selected}
              onClose={() => setSelected(null)}
              onSelectForComparison={handleSelectForComparison}
              isSelectedForComparison={comparisonSelection.some(
                (item) => item._id === selected._id,
              )}
              comparisonCount={comparisonSelection.length}
              isLoading={detailLoading}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
