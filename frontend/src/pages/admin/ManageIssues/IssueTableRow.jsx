import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import IssueStatusBadge, { getIssueStatus } from "./IssueStatusBadge";

const IssueTableRow = ({ issue, onConfirmReturn }) => {
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

  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`border-b border-white/4 last:border-none transition-colors group
        ${isReturned ? "opacity-60 hover:opacity-80" : "hover:bg-white/2"}`}>
      {/* Student */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/6 border border-white/12 flex items-center justify-center text-[12px] font-extrabold text-slate-400 shrink-0 transition-transform group-hover:scale-105">
            {initial}
          </div>
          <div>
            <p className="text-[13px] font-semibold text-slate-200 capitalize">
              {studentName}
            </p>
            <p className="text-[11px] text-slate-600">{issue.student?.email}</p>
          </div>
        </div>
      </td>

      {/* Book */}
      <td className="px-5 py-3.5">
        <p
          className="text-[13px] font-semibold text-slate-200 max-w-[180px] truncate"
          title={issue.book?.title}>
          {issue.book?.title || "Deleted Book"}
        </p>
        <p className="text-[11px] text-slate-600 max-w-[180px] truncate">
          {issue.book?.author}
        </p>
      </td>

      {/* Issue Date */}
      <td className="px-5 py-3.5">
        <span className="text-[12px] text-slate-500">
          {new Date(issue.issuedAt || issue.createdAt).toLocaleDateString(
            "en-IN",
            {
              day: "numeric",
              month: "short",
              year: "numeric",
            },
          )}
        </span>
      </td>

      {/* Status */}
      <td className="px-5 py-3.5">
        <IssueStatusBadge issue={issue} />
      </td>

      {/* Action */}
      <td className="px-5 py-3.5 text-right">
        {!isReturned ? (
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onConfirmReturn(issue._id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[9px] bg-teal-500/8 border border-teal-500/20 text-teal-400 hover:bg-teal-500/15 text-[10px] font-bold tracking-wider uppercase transition-colors">
            <RefreshCw size={11} /> Mark Returned
          </motion.button>
        ) : (
          <span className="text-[11px] text-slate-600 italic">
            ✅ Processed
          </span>
        )}
      </td>
    </motion.tr>
  );
};

export default IssueTableRow;
