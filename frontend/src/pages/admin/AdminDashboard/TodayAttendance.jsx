import { motion } from "framer-motion";

const TodayAttendance = ({ present = 0, absent = 0 }) => {
  const total = present + absent;
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, type: "spring", stiffness: 260 }}
      className="relative rounded-[20px] p-px"
      style={{
        background: "linear-gradient(135deg, rgba(20,184,166,0.22), rgba(255,255,255,0.04), rgba(132,204,22,0.1))",
      }}
    >
      <div className="bg-[#0d1117] rounded-[19px] p-5 relative overflow-hidden">
        {/* Mesh */}
        <div
          className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none rounded-br-[19px]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "12px 12px",
          }}
        />

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-[15px] font-bold text-slate-100 flex items-center gap-2"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            📊 Today's Attendance
          </h3>
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border"
            style={{ background: "rgba(20,184,166,0.08)", borderColor: "rgba(20,184,166,0.2)", color: "#2dd4bf" }}
          >
            Live
          </span>
        </div>

        {/* Pills */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: "Present", value: present, bg: "rgba(52,211,153,0.06)", border: "rgba(52,211,153,0.2)", color: "#34d399" },
            { label: "Absent",  value: absent,  bg: "rgba(251,113,133,0.06)", border: "rgba(251,113,133,0.2)", color: "#fb7185" },
          ].map(({ label, value, bg, border, color }) => (
            <div key={label} className="text-center py-3.5 px-4 rounded-[13px] border" style={{ background: bg, borderColor: border }}>
              <p className="font-extrabold text-[28px] leading-none" style={{ color, fontFamily: "'Syne', sans-serif" }}>{value}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="flex justify-between text-[11px] text-slate-600 mb-1.5">
          <span>{percentage}% attendance today</span>
          <span>{total} total students</span>
        </div>
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #34d399, #14b8a6)" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default TodayAttendance;