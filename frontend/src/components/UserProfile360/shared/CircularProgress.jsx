import { motion } from "framer-motion";

const CircularProgress = ({ percentage = 0, totalDays = 0 }) => {
  const safe = isNaN(percentage) ? 0 : Math.min(percentage, 100);
  const r = 56;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (circumference * safe) / 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative rounded-[18px] p-px"
      style={{
        background:
          "linear-gradient(135deg, rgba(20,184,166,0.3), rgba(255,255,255,0.04), rgba(132,204,22,0.15))",
      }}>
      <div className="bg-[#0d1117] rounded-[17px] p-6 flex flex-col items-center text-center relative overflow-hidden">
        {/* Corner glow */}
        <div
          className="absolute -top-10 -right-10 w-28 h-28 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(20,184,166,0.12), transparent 70%)",
          }}
        />

        {/* SVG ring */}
        <div className="relative w-32 h-32 mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 130 130">
            <circle
              cx="65"
              cy="65"
              r={r}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="8"
              fill="transparent"
            />
            <motion.circle
              cx="65"
              cy="65"
              r={r}
              stroke="url(#attGrad)"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="attGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#84cc16" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span
              className="text-[28px] font-extrabold leading-none bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #14b8a6, #84cc16)",
              }}>
              {safe}%
            </span>
            <span className="text-[10px] text-slate-600 font-bold mt-0.5">
              attendance
            </span>
          </div>
        </div>

        <p className="text-[14px] font-bold text-slate-100 mb-1">
          Overall Attendance
        </p>
        <p className="text-[11px] text-slate-600">
          Based on {totalDays} working days
        </p>
      </div>
    </motion.div>
  );
};

export default CircularProgress;
