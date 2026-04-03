import { motion } from "framer-motion";
import { BookDown } from "lucide-react";

const RecentIssuesTable = ({ issues = [] }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.15, type: "spring", stiffness: 260 }}
    className="relative rounded-[20px] p-px"
    style={{
      background: "linear-gradient(135deg, rgba(20,184,166,0.22), rgba(255,255,255,0.04), rgba(132,204,22,0.1))",
    }}
  >
    <div className="bg-[#0d1117] rounded-[19px] p-5 relative overflow-hidden">
      <div
        className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none rounded-br-[19px]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[15px] font-bold text-slate-100 flex items-center gap-2">
          📖 Recent Book Issues
        </h3>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/5 border border-white/[0.07] text-slate-500">
          Last 5
        </span>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[10px] font-bold tracking-widest uppercase text-slate-600 whitespace-nowrap">Issued this week</span>
        <div className="flex-1 h-px bg-white/5" />
      </div>

      {issues.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-slate-600">
          <BookDown size={32} className="mb-2 opacity-40" />
          <p className="text-sm">No books issued recently.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                {["Student", "Book Title", "Date"].map((h) => (
                  <th key={h} className="pb-3 text-[10px] font-bold tracking-widest uppercase text-slate-600 border-b border-white/5 last:text-right">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {issues.map((issue, i) => {
                const name = issue.student?.userName || "Unknown";
                return (
                  <motion.tr
                    key={issue._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className="border-b border-white/4 last:border-none hover:bg-white/2 transition-colors"
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2.5">
                        {/* Avatar */}
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-extrabold shrink-0 border"
                          style={{
                            background: "linear-gradient(135deg, rgba(20,184,166,0.3), rgba(132,204,22,0.2))",
                            borderColor: "rgba(20,184,166,0.2)",
                            color: "#2dd4bf",
                          }}
                        >
                          {name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[13px] font-semibold text-slate-200 capitalize">{name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[12px] text-slate-400 line-clamp-1 max-w-35 block" title={issue.book?.title}>
                        {issue.book?.title || "Deleted Book"}
                      </span>
                    </td>
                    <td className="py-3 pl-3 text-right text-[11px] text-slate-600">
                      {new Date(issue.issuedAt || issue.createdAt).toLocaleDateString("en-IN", {
                        month: "short", day: "numeric",
                      })}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </motion.div>
);

export default RecentIssuesTable;