import { motion } from "framer-motion";
import { BookOpen, Clock, Trophy, Users } from "lucide-react";

const STATS_CONFIG = [
  {
    key: "totalStudents",
    label: "Total Students",
    emoji: "👥",
    icon: Users,
    cardGradient: "linear-gradient(135deg, rgba(59,130,246,0.3), rgba(255,255,255,0.04), rgba(99,102,241,0.15))",
    iconClass: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    numGradient: "linear-gradient(135deg, #60a5fa, #818cf8)",
    deltaColor: "#34d399",
    deltaKey: "newStudents",
    deltaPrefix: "↑",
    deltaSuffix: "this month",
  },
  {
    key: "totalBooks",
    label: "Library Books",
    emoji: "📚",
    icon: BookOpen,
    cardGradient: "linear-gradient(135deg, rgba(20,184,166,0.3), rgba(255,255,255,0.04), rgba(132,204,22,0.15))",
    iconClass: "bg-teal-500/10 border-teal-500/20 text-teal-400",
    numGradient: "linear-gradient(135deg, #14b8a6, #84cc16)",
    deltaColor: "#34d399",
    deltaKey: "newBooks",
    deltaPrefix: "↑",
    deltaSuffix: "new books",
  },
  {
    key: "activeIssues",
    label: "Active Issues",
    emoji: "🎫",
    icon: Clock,
    cardGradient: "linear-gradient(135deg, rgba(251,113,133,0.3), rgba(255,255,255,0.04), rgba(249,115,22,0.15))",
    iconClass: "bg-rose-500/10 border-rose-500/20 text-rose-400",
    numGradient: "linear-gradient(135deg, #fb7185, #f97316)",
    deltaColor: "#fb7185",
    deltaKey: "urgentIssues",
    deltaPrefix: "↑",
    deltaSuffix: "pending urgent",
  },
  {
    key: "totalAchievements",
    label: "Wall of Fame",
    emoji: "🏆",
    icon: Trophy,
    cardGradient: "linear-gradient(135deg, rgba(251,191,36,0.3), rgba(255,255,255,0.04), rgba(245,158,11,0.15))",
    iconClass: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    numGradient: "linear-gradient(135deg, #fbbf24, #f97316)",
    deltaColor: "#34d399",
    deltaKey: "newBadges",
    deltaPrefix: "↑",
    deltaSuffix: "new badges",
  },
];

const AdminStatCards = ({ stats = {} }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {STATS_CONFIG.map(({ key, label, emoji, icon: Icon, cardGradient, iconClass, numGradient, deltaColor, deltaKey, deltaPrefix, deltaSuffix }, i) => (
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.07, type: "spring", stiffness: 280 }}
        whileHover={{ y: -5 }}
        className="relative rounded-[20px] p-px cursor-default"
        style={{ background: cardGradient }}
      >
        <div className="bg-[#0d1117] rounded-[19px] p-5 relative overflow-hidden min-h-35">

          {/* Watermark */}
          <div className="absolute -right-2 -top-2 text-[68px] leading-none opacity-[0.04] pointer-events-none select-none">
            {emoji}
          </div>

          {/* Mesh */}
          <div
            className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none rounded-br-[19px]"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "12px 12px",
            }}
          />

          {/* Icon */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border mb-3 ${iconClass}`}>
            <Icon size={18} />
          </div>

          {/* Label */}
          <p className="text-[10px] font-bold tracking-widest uppercase text-slate-600 mb-1">
            {label}
          </p>

          {/* Number */}
          <p
            className="font-extrabold text-[36px] leading-none mb-1.5"
            style={{
              backgroundImage: numGradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {stats[key] ?? 0}
          </p>

          {/* Delta */}
          {stats[deltaKey] != null && (
            <p className="text-[11px] font-semibold" style={{ color: deltaColor }}>
              {deltaPrefix} {stats[deltaKey]} {deltaSuffix}
            </p>
          )}
        </div>
      </motion.div>
    ))}
  </div>
);

export default AdminStatCards;