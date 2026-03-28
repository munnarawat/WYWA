import { motion } from "framer-motion";
import { TrendingUp, UserCheck, UserX } from "lucide-react";

const STAT_CARDS = [
  {
    key: "percentage",
    label: "Monthly Attendance",
    icon: TrendingUp,
    iconClass: "bg-teal-500/10 border-teal-500/20 text-teal-400",
    gradientBorder: "linear-gradient(135deg, rgba(20,184,166,.35), rgba(255,255,255,.04), rgba(132,204,22,.2))",
    numGradient: "linear-gradient(135deg, #14b8a6, #84cc16)",
    suffix: "%",
    sub: "Keep it above 75%",
    showProgress: true,
  },
  {
    key: "totalPresent",
    label: "Days Present",
    icon: UserCheck,
    iconClass: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    gradientBorder: "linear-gradient(135deg, rgba(52,211,153,.3), rgba(255,255,255,.04), rgba(20,184,166,.15))",
    numGradient: "linear-gradient(135deg, #34d399, #14b8a6)",
    suffix: "",
    sub: "Days this month 🟢",
    showProgress: false,
  },
  {
    key: "totalAbsent",
    label: "Days Absent",
    icon: UserX,
    iconClass: "bg-rose-500/10 border-rose-500/20 text-rose-400",
    gradientBorder: "linear-gradient(135deg, rgba(251,113,133,.3), rgba(255,255,255,.04), rgba(249,115,22,.15))",
    numGradient: "linear-gradient(135deg, #fb7185, #f97316)",
    suffix: "",
    sub: "Try to minimize this",
    showProgress: false,
  },
];

const StudentStats = ({ stats = {} }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {STAT_CARDS.map((card, i) => {
        const Icon = card.icon;
        const value = stats[card.key] ?? 0;
        const safeValue = isNaN(value) ? 0 : value;

        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, type: "spring", stiffness: 280 }}
            whileHover={{ y: -5 }}
            className="relative rounded-[20px] p-px cursor-default"
            style={{ background: card.gradientBorder }}
          >
            <div className="bg-[#0d1117] rounded-[19px] p-6 relative overflow-hidden min-h-[160px]">

              {/* Watermark icon */}
              <div className="absolute -right-4 -top-4 opacity-[0.04] pointer-events-none">
                <Icon size={88} />
              </div>

              {/* Dot mesh */}
              <div
                className="absolute bottom-0 right-0 w-28 h-28 pointer-events-none rounded-br-[19px]"
                style={{
                  backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
                  backgroundSize: "14px 14px",
                }}
              />

              {/* Icon */}
              <div className={`w-11 h-11 rounded-[13px] flex items-center justify-center border mb-4 ${card.iconClass}`}>
                <Icon size={20} />
              </div>

              {/* Label */}
              <p className="text-[11px] font-bold tracking-widest uppercase text-slate-500 mb-1.5">
                {card.label}
              </p>

              {/* Number */}
              <p
                className="text-5xl font-extrabold bg-clip-text text-transparent"
                style={{
                  backgroundImage: card.numGradient,
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                {safeValue}{card.suffix}
              </p>

              {/* Progress bar (only for percentage) */}
              {card.showProgress && (
                <div className="w-full h-1 bg-white/6 rounded-full mt-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(safeValue, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #14b8a6, #84cc16)" }}
                  />
                </div>
              )}

              <p className="text-[12px] text-slate-500 mt-2">{card.sub}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StudentStats;