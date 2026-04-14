import { motion } from "framer-motion";
import { meshStyle } from "./shared/helpers";

const STATS = (attendanceStats, libraryStats) => [
  {
    label: "Attendance",
    value: `${attendanceStats.percentage ?? 0}%`,
    gradient:
      "linear-gradient(135deg,rgba(20,184,166,.25),rgba(255,255,255,.04),rgba(132,204,22,.1))",
    color: "#2dd4bf",
  },
  {
    label: "Present Days",
    value: attendanceStats.presentDays ?? 0,
    gradient:
      "linear-gradient(135deg,rgba(52,211,153,.25),rgba(255,255,255,.04),rgba(20,184,166,.1))",
    color: "#34d399",
  },
  {
    label: "Books Issued",
    value:
      (libraryStats?.activeIssues?.length ?? 0) +
      (libraryStats?.returnHistory?.length ?? 0),
    gradient:
      "linear-gradient(135deg,rgba(251,113,133,.25),rgba(255,255,255,.04),rgba(249,115,22,.1))",
    color: "#fb7185",
  },
];

const QuickStatsRow = ({ attendanceStats, libraryStats }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="grid grid-cols-3 gap-3">
    {STATS(attendanceStats, libraryStats).map(
      ({ label, value, gradient, color }) => (
        <motion.div
          key={label}
          whileHover={{ y: -4 }}
          className="relative rounded-2xl p-px"
          style={{ background: gradient }}>
          <div className="bg-[#0d1117] rounded-[15px] py-4 px-3 text-center relative overflow-hidden">
            <div
              className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none rounded-br-[15px]"
              style={meshStyle("8px")}
            />
            <p className="text-[10px] font-bold tracking-widest uppercase text-slate-600 mb-1">
              {label}
            </p>
            <p
              className="text-[26px] font-extrabold leading-none"
              style={{ color }}>
              {value}
            </p>
          </div>
        </motion.div>
      ),
    )}
  </motion.div>
);

export default QuickStatsRow;
