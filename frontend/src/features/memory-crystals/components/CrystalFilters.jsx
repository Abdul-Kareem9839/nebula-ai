import { motion } from "framer-motion";

const SCORE_BANDS = [
  { value: "all", label: "Any Score" },
  { value: "0-40", label: "0 – 40" },
  { value: "41-60", label: "41 – 60" },
  { value: "61-80", label: "61 – 80" },
  { value: "81-100", label: "81 – 100" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "highest", label: "Highest Score" },
];

function GhostSelect({ value, onChange, options, label }) {
  const isFiltered = value !== "all" && value !== "newest" && value !== "";

  return (
    <div className="flex flex-col gap-1 text-xs">
      <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-nebula-text/40 pl-1">
        {label}
        {isFiltered && (
          <span className="h-1.5 w-1.5 rounded-full bg-nebula-cyan shadow-[0_0_6px_rgba(103,232,249,0.8)]" />
        )}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full cursor-pointer appearance-none rounded-xl bg-white/[0.03] pl-2.5 pr-7 py-2 text-xs font-medium outline-none transition-all hover:bg-white/[0.06] focus:bg-white/[0.08] ${
            isFiltered ? "text-nebula-cyan" : "text-nebula-text/75"
          }`}
        >
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-nebula-surface text-nebula-text"
            >
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-nebula-text/30">
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}

export function CrystalFilters({
  search,
  onSearchChange,
  role,
  onRoleChange,
  roleOptions,
  type,
  onTypeChange,
  typeOptions,
  status,
  onStatusChange,
  statusOptions,
  scoreBand,
  onScoreBandChange,
  sort,
  onSortChange,
  view,
  onViewChange,
  resultCount,
  onReset,
}) {
  const isAnyFilterActive =
    search.trim() !== "" ||
    role !== "all" ||
    type !== "all" ||
    status !== "all" ||
    scoreBand !== "all" ||
    sort !== "newest";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mb-8 flex flex-col gap-4"
    >
      {/* Top Bar: Floating Search & View Toggle (No Outer Panel) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <svg
            className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-nebula-text/35"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by role, type, or feedback..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-8 text-xs text-nebula-text/90 outline-none transition-all placeholder:text-nebula-text/30 focus:border-nebula-cyan/40 focus:bg-white/[0.05]"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-nebula-text/40 hover:text-nebula-text"
            >
              ✕
            </button>
          )}
        </div>

        {/* View Switcher */}
        <div className="flex items-center rounded-xl border border-white/10 bg-white/[0.02] p-1">
          {["universe", "timeline"].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => onViewChange(v)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium capitalize transition-all ${
                view === v
                  ? "bg-nebula-cyan/20 text-nebula-cyan font-semibold shadow-sm"
                  : "text-nebula-text/40 hover:text-nebula-text/75"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Options Row */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        <GhostSelect
          label="Role"
          value={role}
          onChange={onRoleChange}
          options={roleOptions}
        />
        <GhostSelect
          label="Status"
          value={status}
          onChange={onStatusChange}
          options={statusOptions}
        />
        <GhostSelect
          label="Type"
          value={type}
          onChange={onTypeChange}
          options={typeOptions}
        />
        <GhostSelect
          label="Score"
          value={scoreBand}
          onChange={onScoreBandChange}
          options={SCORE_BANDS}
        />
        <GhostSelect
          label="Sort"
          value={sort}
          onChange={onSortChange}
          options={SORT_OPTIONS}
        />
      </div>

      {/* Footer Info Line */}
      <div className="flex items-center justify-between text-[11px] text-nebula-text/40">
        <span>
          Showing{" "}
          <span className="font-semibold text-nebula-text/80">
            {resultCount}
          </span>{" "}
          {resultCount === 1 ? "memory" : "memories"}
        </span>

        {isAnyFilterActive && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-nebula-cyan transition-opacity hover:opacity-80"
          >
            <span>↺</span>
            <span>Reset filters</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
