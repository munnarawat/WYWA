import { motion } from "framer-motion";

const STATS_CONFIG = [
  {
    key: "total",
    label: "Total Tickets",
    emoji: "🎫",
    cardGradient:
      "linear-gradient(135deg, rgba(20,184,166,0.28), rgba(255,255,255,0.04), rgba(132,204,22,0.12))",
    iconClass: "bg-teal-500/10 border-teal-500/20",
    numGradient: "linear-gradient(135deg, #14b8a6, #84cc16)",
  },
  {
    key: "pending",
    label: "Pending",
    emoji: "⏳",
    cardGradient:
      "linear-gradient(135deg, rgba(251,191,36,0.25), rgba(255,255,255,0.04), rgba(245,158,11,0.1))",
    iconClass: "bg-amber-400/10 border-amber-400/20",
    numColor: "#fbbf24",
  },
  {
    key: "resolved",
    label: "Resolved",
    emoji: "✅",
    cardGradient:
      "linear-gradient(135deg, rgba(52,211,153,0.25), rgba(255,255,255,0.04), rgba(20,184,166,0.1))",
    iconClass: "bg-emerald-400/10 border-emerald-400/20",
    numColor: "#34d399",
  },
];

const TicketStatsGrid = ({ tickets = [] }) => {
  const counts = {
    total: tickets.length,
    pending: tickets.filter((t) => t.status?.toLowerCase() === "pending")
      .length,
    resolved: tickets.filter((t) =>
      ["resolved", "completed"].includes(t.status?.toLowerCase()),
    ).length,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {STATS_CONFIG.map(
        (
          { key, label, emoji, cardGradient, iconClass, numGradient, numColor },
          i,
        ) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, type: "spring", stiffness: 280 }}
            whileHover={{ y: -4 }}
            className="relative rounded-[20px] p-px"
            style={{ background: cardGradient }}>
            <div className="bg-[#0d1117] rounded-[19px] p-5 flex items-center gap-4 relative overflow-hidden">
              {/* Watermark */}
              <div className="absolute -right-2 -top-2 text-[64px] leading-none opacity-[0.04] pointer-events-none select-none">
                {emoji}
              </div>

              {/* Mesh */}
              <div
                className="absolute bottom-0 right-0 w-20 h-20 pointer-events-none rounded-br-[19px]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
                  backgroundSize: "10px 10px",
                }}
              />

              {/* Icon */}
              <div
                className={`w-11 h-11 rounded-[13px] flex items-center justify-center text-lg border shrink-0 ${iconClass}`}>
                {emoji}
              </div>

              {/* Text */}
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-slate-600 mb-1">
                  {label}
                </p>
                <p
                  className="font-extrabold text-[30px] leading-none"
                  style={
                    numGradient
                      ? {
                          backgroundImage: numGradient,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }
                      : { color: numColor }
                  }>
                  {counts[key]}
                </p>
              </div>
            </div>
          </motion.div>
        ),
      )}
    </div>
  );
};

export default TicketStatsGrid;
