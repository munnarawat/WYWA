import { CheckCircle, Clock, AlertCircle } from "lucide-react";

const STATUS_CONFIG = {
  returned: {
    label: "Returned",
    icon: CheckCircle,
    className: "bg-emerald-400/[0.08] border-emerald-400/20 text-emerald-400",
  },
  overdue: {
    label: "Overdue",
    icon: AlertCircle,
    className: "bg-rose-400/[0.08] border-rose-400/20 text-rose-400",
  },
  active: {
    label: "Active",
    icon: Clock,
    className: "bg-amber-400/[0.08] border-amber-400/20 text-amber-400",
  },
};

export const getIssueStatus = (issue) => {
  if (issue.status === "returned") return "returned";
  if (issue.dueDate && new Date(issue.dueDate) < new Date()) return "overdue";
  return "active";
};

const IssueStatusBadge = ({ issue }) => {
  const statusKey = getIssueStatus(issue);
  const { label, icon: Icon, className } = STATUS_CONFIG[statusKey];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold tracking-wider uppercase ${className}`}>
      <span className="w-1.25 h-1.25 rounded-full bg-current" />
      {label}
    </span>
  );
};

export default IssueStatusBadge;