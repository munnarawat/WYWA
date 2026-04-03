import { motion } from "framer-motion";

const MEDALS = ["🥇", "🥈", "🥉"];
const RANK_COLORS = ["#fbbf24", "#94a3b8", "#d97706"];

const TopStreakers = ({ streakers = [] }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2, type: "spring", stiffness: 260 }}
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

      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[15px] font-bold text-slate-100 flex items-center gap-2" style={{ fontFamily: "'Syne', sans-serif" }}>
          🔥 Top Streakers
        </h3>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/5 border border-white/[0.07] text-slate-500">
          This Month
        </span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span className="text-[10px] font-bold tracking-widest uppercase text-slate-600 whitespace-nowrap">Highest streaks</span>
        <div className="flex-1 h-px bg-white/5" />
      </div>

      {streakers.length === 0 ? (
        <p className="text-sm text-slate-600 text-center py-6">No streak data yet.</p>
      ) : (
        <div className="space-y-2">
          {streakers.map((s, i) => (
            <motion.div
              key={s.studentId || i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.06 }}
              whileHover={{ x: 4 }}
              className="flex items-center justify-between px-3.5 py-3 rounded-[13px] border border-white/5 bg-white/2 hover:bg-teal-500/4 hover:border-teal-500/15 transition-all"
            >
              <div className="flex items-center gap-3">
                <span
                  className="font-extrabold text-[13px] w-6 text-center shrink-0"
                  style={{ color: RANK_COLORS[i] || "#475569", fontFamily: "'Syne', sans-serif" }}
                >
                  {i + 1}
                </span>
                <span className="text-[13px] font-semibold text-slate-200">
                  {s.userName} {MEDALS[i] || ""}
                </span>
              </div>
              <div
                className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border"
                style={{ background: "rgba(251,113,133,0.08)", borderColor: "rgba(251,113,133,0.2)", color: "#fb7185" }}
              >
                🔥 {s.streak} days
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  </motion.div>
);

export default TopStreakers;