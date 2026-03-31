import { motion } from "framer-motion";
import { BookOpen, LibraryBig } from "lucide-react";

const LibraryHeader = ({ activeTab, onTabChange, allBooks = [], issuedBooks = [] }) => {
  const availableCount = allBooks.filter((b) => b.available > 0).length;
  const activeIssues   = issuedBooks.filter((b) => b.status !== "returned").length;

  return (
    <div className="flex flex-col gap-5">

      {/* Eyebrow */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] font-semibold tracking-widest uppercase mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          MYWA · Library Hub
        </div>
      </div>

      {/* Title row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-6 border-b border-white/[0.05]">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-extrabold bg-clip-text text-transparent mb-2"
            style={{
              fontSize: "clamp(26px, 3.5vw, 40px)",
              backgroundImage: "linear-gradient(135deg, #f0fdf4 0%, #14b8a6 50%, #84cc16 100%)",
              fontFamily: "'Syne', sans-serif",
            }}
          >
            Library Hub
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[14px] text-slate-500"
          >
            Explore your branch catalog and track your reading.
          </motion.p>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1.5 p-1.5 rounded-2xl flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {[
            { id: "browse",   label: "Browse Books", emoji: "📚", activeColor: "rgba(20,184,166,0.1)",  borderColor: "rgba(20,184,166,0.2)",  textColor: "#2dd4bf" },
            { id: "my-books", label: "My Books",     emoji: "🔖", activeColor: "rgba(132,204,22,0.1)", borderColor: "rgba(132,204,22,0.2)", textColor: "#a3e635" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative flex items-center gap-2 px-5 py-2.5 rounded-[12px] text-[13px] font-semibold transition-all whitespace-nowrap"
                style={isActive
                  ? { background: tab.activeColor, border: `1px solid ${tab.borderColor}`, color: tab.textColor }
                  : { color: "#64748b" }
                }
              >
                <span>{tab.emoji}</span>
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats pills */}
      <div className="flex gap-3 flex-wrap">
        {[
          { dot: "#14b8a6", value: allBooks.length, label: "Total Books" },
          { dot: "#84cc16", value: availableCount,  label: "Available" },
          { dot: "#fb7185", value: activeIssues,    label: "My Active Issues" },
        ].map(({ dot, value, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] text-slate-400"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: dot }} />
            <strong className="text-slate-200">{value}</strong> {label}
          </div>
        ))}
      </div>

    </div>
  );
};

export default LibraryHeader;