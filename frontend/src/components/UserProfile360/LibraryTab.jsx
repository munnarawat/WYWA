import { motion } from "framer-motion";
import { BookOpen, Clock } from "lucide-react";
import { formatDate, meshStyle } from "./shared/helpers";

const LibraryTab = ({ libraryStats }) => (
  <div>
    {/* Title */}
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 rounded-[11px] bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-base">
        📚
      </div>
      <h3 className="text-[17px] font-bold text-slate-100">Library Activity</h3>
    </div>

    {/* ── Active Issues ── */}
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[10px] font-bold tracking-widest uppercase text-slate-600 whitespace-nowrap">
        Active issues
      </span>
      <div className="flex-1 h-px bg-white/5" />
    </div>

    {libraryStats.activeIssues?.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {libraryStats.activeIssues.map((issue, i) => (
          <motion.div
            key={issue._id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            className="relative rounded-2xl p-px"
            style={{
              background:
                "linear-gradient(135deg, rgba(20,184,166,0.25), rgba(255,255,255,0.04), rgba(132,204,22,0.12))",
            }}>
            <div
              className="bg-[#0d1117] rounded-[15px] p-4 relative overflow-hidden"
              style={{ borderLeft: "3px solid rgba(20,184,166,0.5)" }}>
              <div
                className="absolute bottom-0 right-0 w-14 h-14 pointer-events-none rounded-br-[15px]"
                style={meshStyle("8px")}
              />
              <div className="w-8 h-8 rounded-[9px] bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-sm mb-3">
                📖
              </div>
              <p className="text-[13px] font-bold text-slate-200 mb-1">
                {issue.book?.title || "Unknown Book"}
              </p>
              <p className="text-[11px] text-slate-600 flex items-center gap-1.5">
                <Clock size={10} /> Issued: {formatDate(issue.createdAt)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    ) : (
      <div className="flex flex-col items-center py-8 text-slate-600 border border-dashed border-white/8 rounded-2xl mb-6 gap-2">
        <BookOpen size={28} className="opacity-40" />
        <p className="text-[13px]">No active books issued currently.</p>
      </div>
    )}

    {/* ── Return History ── */}
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[10px] font-bold tracking-widest uppercase text-slate-600 whitespace-nowrap">
        Return history
      </span>
      <div className="flex-1 h-px bg-white/5" />
    </div>

    {libraryStats.returnHistory?.length > 0 ? (
      <div
        className="relative rounded-2xl p-px"
        style={{
          background:
            "linear-gradient(135deg,rgba(20,184,166,.14),rgba(255,255,255,.04))",
        }}>
        <div className="bg-[#0d1117] rounded-[15px] overflow-hidden">
          {libraryStats.returnHistory.map((h, i) => (
            <motion.div
              key={h._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ x: 4 }}
              className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.035] last:border-none hover:bg-white/2 transition-all gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[9px] bg-white/6 border border-white/10 flex items-center justify-center text-sm">
                  📖
                </div>
                <div>
                  <p className="text-[12px] font-bold text-slate-200">
                    {h.book?.title || "Unknown Book"}
                  </p>
                  <p className="text-[10px] text-slate-600">
                    Returned: {formatDate(h.updatedAt)}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[7px] border border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-400 text-[9px] font-extrabold uppercase tracking-wider">
                ✅ Returned
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    ) : (
      <p className="text-[13px] text-slate-600 italic">
        No history of returned books.
      </p>
    )}
  </div>
);

export default LibraryTab;
