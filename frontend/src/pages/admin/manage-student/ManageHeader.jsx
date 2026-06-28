import { motion } from "framer-motion";
import { BellRing, Search } from "lucide-react";

const ManageHeader = ({
  currentUser,
  filteredCount,
  searchQuery,
  setSearchQuery,
  stats,
  showPendingOnly,
  setShowPendingOnly,
}) => {
  return (
    <div className="flex flex-col gap-5">
      {/* ── TITLE & SEARCH ROW ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-6 border-b border-white/5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] font-semibold tracking-widest uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            MYWA · Admin Panel
          </div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-extrabold bg-clip-text text-transparent mb-2 text-3xl md:text-4xl"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #f0fdf4 0%, #14b8a6 50%, #84cc16 100%)",
            }}>
            Manage Users
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[14px] text-slate-500">
            View, block, or promote users in{" "}
            <span className="text-slate-300 font-medium">
              {currentUser?.branch}
            </span>{" "}
            branch.
          </motion.p>
        </div>

        {/* SEARCH & COUNT & filter */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowPendingOnly(!showPendingOnly)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-[14px] text-[11px] font-bold uppercase tracking-wider transition-all border ${
              showPendingOnly
                ? "bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                : stats.pending > 0
                  ? "bg-amber-500/5 border-amber-500/20 text-amber-500/70 hover:bg-amber-500/10 hover:text-amber-400"
                  : "bg-white/5 border-white/10 text-slate-500 hover:bg-white/10 hover:text-slate-300"
            }`}>
            {stats.pending > 0 ? (
              <BellRing
                size={14}
                className={showPendingOnly ? "animate-bounce" : ""}
              />
            ) : (
              <span
                className={`w-1.5 h-1.5 rounded-full ${showPendingOnly ? "bg-amber-400" : "bg-slate-500"}`}
              />
            )}
            Pending Requests ({stats.pending || 0})
          </button>
          {/* user count badge */}
          <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-2 rounded-lg text-slate-500 whitespace-nowrap bg-white/5 border border-white/10">
            {filteredCount} Users
          </span>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-64">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search username or email…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/3 border border-white/[0.07] rounded-[14px] py-2.5 pl-9 pr-4 text-[13px] text-slate-100 placeholder:text-slate-700 outline-none transition-all focus:border-teal-500/40 focus:bg-teal-500/2"
            />
          </motion.div>
        </div>
      </div>

      {/* ── STATS PILLS ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-3 flex-wrap">
        {[
          { dot: "#14b8a6", value: stats.total, label: "Total" },
          { dot: "#34d399", value: stats.active, label: "Active" },
          { dot: "#fb7185", value: stats.blocked, label: "Blocked" },
          { dot: "#34d399", value: stats.library, label: "Library Members" },
        ].map(({ dot, value, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] text-slate-400 bg-white/5 border border-white/10">
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: dot }}
            />
            <strong className="text-slate-200">{value}</strong> {label}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default ManageHeader;
