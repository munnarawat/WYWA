import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

// Status config
const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    emoji: "⏳",
    className: "bg-amber-400/[0.08] border-amber-400/20 text-amber-400",
    glow: "rgba(251,191,36,0.08)",
    Icon: Clock,
  },
  "in-progress": {
    label: "In Progress",
    emoji: "🔄",
    className: "bg-indigo-400/[0.08] border-indigo-400/20 text-indigo-400",
    glow: "rgba(99,102,241,0.08)",
    Icon: AlertCircle,
  },
  resolved: {
    label: "Resolved",
    emoji: "✅",
    className: "bg-emerald-400/[0.08] border-emerald-400/20 text-emerald-400",
    glow: "rgba(52,211,153,0.08)",
    Icon: CheckCircle,
  },
  completed: {
    label: "Resolved",
    emoji: "✅",
    className: "bg-emerald-400/[0.08] border-emerald-400/20 text-emerald-400",
    glow: "rgba(52,211,153,0.08)",
    Icon: CheckCircle,
  },
};

const getStatus = (status) =>
  STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.pending;

const TicketCard = ({ ticket, index }) => {
  const { label, emoji, className, glow, Icon } = getStatus(ticket.status);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: -20 },
        show: {
          opacity: 1,
          x: 0,
          transition: { type: "spring", stiffness: 260, delay: index * 0.06 },
        },
      }}
      whileHover={{ x: 5 }}
      className="relative rounded-[18px] p-px"
      style={{
        background:
          "linear-gradient(135deg, rgba(20,184,166,0.2), rgba(255,255,255,0.04), rgba(132,204,22,0.1))",
      }}>
      <div className="bg-[#0d1117] rounded-[17px] px-5 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        {/* Hover glow */}
        <div
          className="absolute -top-10 -right-10 w-28 h-28 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: `radial-gradient(circle, ${glow}, transparent 70%)`,
          }}
        />

        {/* Mesh */}
        <div
          className="absolute bottom-0 right-0 w-20 h-20 pointer-events-none rounded-br-[17px]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "10px 10px",
          }}
        />

        {/* Left content */}
        <div className="flex-1 min-w-0 relative z-10">
          {/* Meta row */}
          <div className="flex items-center gap-2.5 mb-2 flex-wrap">
            <span className="text-[9px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-[7px] bg-teal-500/10 border border-teal-500/20 text-teal-400">
              Ticket #{ticket._id?.slice(-6).toUpperCase()}
            </span>
            <span className="text-[11px] text-slate-600">
              {new Date(ticket.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-[16px] text-slate-100 mb-1.5 line-clamp-1">
            {ticket.title}
          </h3>

          {/* Description */}
          <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-2">
            {ticket.description}
          </p>
        </div>

        {/* Status badge */}
        <div
          className={`relative z-10 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[10px] font-extrabold tracking-wider uppercase shrink-0 ${className}`}>
          <Icon size={13} />
          {label}
        </div>
      </div>
    </motion.div>
  );
};

export default TicketCard;
