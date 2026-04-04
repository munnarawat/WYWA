import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import IssueStatusBadge, { getIssueStatus } from "./IssueStatusBadge";

// Card border color based on status
const CARD_GRADIENT = {
  active:
    "linear-gradient(135deg, rgba(251,191,36,0.2), rgba(255,255,255,0.04), rgba(20,184,166,0.1))",
  overdue:
    "linear-gradient(135deg, rgba(251,113,133,0.2), rgba(255,255,255,0.04), rgba(249,115,22,0.1))",
  returned:
    "linear-gradient(135deg, rgba(52,211,153,0.15), rgba(255,255,255,0.04), rgba(20,184,166,0.08))",
};

const BOOK_ROW_STYLE = {
  active: { bg: "rgba(255,255,255,0.02)", border: "rgba(255,255,255,0.05)" },
  overdue: { bg: "rgba(251,113,133,0.04)", border: "rgba(251,113,133,0.1)" },
  returned: { bg: "rgba(52,211,153,0.03)", border: "rgba(52,211,153,0.1)" },
};

const IssueCard = ({ issue, index, onConfirmReturn }) => {
  const statusKey = getIssueStatus(issue);
  const isReturned = statusKey === "returned";

  const studentName = issue.student?.fullName?.firstName
    ? `${issue.student.fullName.firstName} ${issue.student.fullName.lastName || ""}`.trim()
    : issue.student?.userName || "Unknown";

  const initial = (
    issue.student?.fullName?.firstName?.charAt(0) ||
    issue.student?.userName?.charAt(0) ||
    "U"
  ).toUpperCase();
  const bookStyle = BOOK_ROW_STYLE[statusKey];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 280 }}
      whileHover={!isReturned ? { y: -3 } : {}}
      className={`relative rounded-2xl p-px ${isReturned ? "opacity-70" : ""}`}
      style={{ background: CARD_GRADIENT[statusKey] }}>
      <div className="bg-[#0d1117] rounded-[15px] p-4 relative overflow-hidden">
        {/* Mesh */}
        <div
          className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none rounded-br-[15px]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "9px 9px",
          }}
        />

        {/* Top — student + status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-9 h-9 rounded-full bg-white/6 border border-white/12 flex items-center justify-center text-[13px] font-extrabold text-slate-400 shrink-0">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-[14px] font-bold text-slate-200 capitalize truncate">
                {studentName}
              </p>
              <p className="text-[11px] text-slate-600 truncate">
                {issue.student?.email}
              </p>
            </div>
          </div>
          <IssueStatusBadge issue={issue} />
        </div>

        {/* Book row */}
        <div
          className="flex items-start gap-3 p-3 rounded-[11px] border mb-3"
          style={{ background: bookStyle.bg, borderColor: bookStyle.border }}>
          <div
            className="w-8 h-8 rounded-[9px] flex items-center justify-center text-sm shrink-0 border"
            style={{
              background:
                statusKey === "overdue"
                  ? "rgba(251,113,133,0.1)"
                  : "rgba(20,184,166,0.1)",
              borderColor:
                statusKey === "overdue"
                  ? "rgba(251,113,133,0.2)"
                  : "rgba(20,184,166,0.2)",
            }}>
            📖
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-bold text-slate-200 truncate">
              {issue.book?.title || "Deleted Book"}
            </p>
            <p className="text-[10px] text-slate-600">
              By {issue.book?.author}
            </p>
          </div>
        </div>

        {/* Footer — date + action */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/5">
          <div className="text-[11px] text-slate-600">
            📅 Issued:{" "}
            <strong className="text-slate-400">
              {new Date(issue.issuedAt || issue.createdAt).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                },
              )}
            </strong>
          </div>

          {!isReturned ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onConfirmReturn(issue._id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] border text-[11px] font-bold shrink-0 transition-colors"
              style={
                statusKey === "overdue"
                  ? {
                      background: "rgba(251,113,133,0.08)",
                      borderColor: "rgba(251,113,133,0.2)",
                      color: "#fb7185",
                    }
                  : {
                      background: "rgba(20,184,166,0.08)",
                      borderColor: "rgba(20,184,166,0.2)",
                      color: "#2dd4bf",
                    }
              }>
              <RefreshCw size={11} /> Return
            </motion.button>
          ) : (
            <span className="text-[11px] text-slate-600 italic">
              ✅ Processed
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default IssueCard;
