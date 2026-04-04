import { motion } from "framer-motion";
import { Search } from "lucide-react";

const InventoryHeader = ({
  currentUser,
  searchQuery,
  setSearchQuery,
  openCreateModal,
  stats,
}) => {
  const availableCount = stats.filter((b) => b.available > 0).length;
  const outOfStockCount = stats.filter((b) => b.available == 0).length;

  return (
    <div className="flex flex-col pb-4 gap-5">
      {/* title - add book button  */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-6 border-b border-white/5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] font-semibold tracking-widest uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            MYWA · Admin Library Inventory
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
            Manage books, stock, and availability for{" "}
            <span className="text-slate-300 font-medium">
              {currentUser?.branch}
            </span>{" "}
            branch.
          </motion.p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full sm:w-64">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/3 border border-white/[0.07] rounded-[14px] py-2.5 pl-9 pr-4 text-[13px] text-slate-100 placeholder:text-slate-700 outline-none transition-all focus:border-teal-500/40 focus:bg-teal-500/2"
            />
          </motion.div> */}

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 bg-linear-to-r from-teal-500/90 hover:-translate-y-2  duration-300 to-lime-500/90 text-zinc-950 font-bold px-5 py-2.5 rounded-xl hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all whitespace-nowrap">
            📚 Add Book
          </motion.button>
        </div>
      </div>
      {/* count books- and search */}
      {/* ── STATS PILLS ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-3 flex-wrap">
        {[
          { dot: "#14b8a6", value: stats.length, label: "Total" },
          { dot: "#34d399", value: availableCount, label: "Available" },
          { dot: "#fb7185", value: outOfStockCount, label: "Out of Stock" },
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
      {/* input search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full sm:w-90">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/3 border border-white/[0.07] rounded-[14px] py-2.5 pl-10 pr-4 text-[13px] text-slate-100 placeholder:text-slate-700 outline-none transition-all focus:border-teal-500/40 focus:bg-teal-500/2"
        />
      </motion.div>
    </div>
  );
};

export default InventoryHeader;
