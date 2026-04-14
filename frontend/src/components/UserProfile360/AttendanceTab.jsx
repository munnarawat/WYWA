import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import CircularProgress from "./shared/CircularProgress";
import { formatShortDate, meshStyle } from "./shared/helpers";

const AttendanceTab = ({ attendanceStats }) => (
  <div>
    {/* Title */}
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 rounded-[11px] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-base">
        📊
      </div>
      <h3 className="text-[17px] font-bold text-slate-100">
        Attendance Overview
      </h3>
    </div>

    <div className="flex items-center gap-3 mb-5">
      <span className="text-[10px] font-bold tracking-widest uppercase text-slate-600 whitespace-nowrap">
        Current month stats
      </span>
      <div className="flex-1 h-px bg-white/5" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-4">
      {/* Circular progress */}
      <CircularProgress
        percentage={attendanceStats.percentage}
        totalDays={attendanceStats.totalDays}
      />

      {/* Right side */}
      <div className="flex flex-col gap-3">
        {/* Mini stat cards */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              label: "Present Days",
              value: attendanceStats.presentDays,
              gradient:
                "linear-gradient(135deg,rgba(52,211,153,.2),rgba(255,255,255,.04))",
              color: "#34d399",
            },
            {
              label: "Absent Days",
              value: attendanceStats.absentDays,
              gradient:
                "linear-gradient(135deg,rgba(251,113,133,.2),rgba(255,255,255,.04))",
              color: "#fb7185",
            },
          ].map(({ label, value, gradient, color }) => (
            <div
              key={label}
              className="relative rounded-[14px] p-px"
              style={{ background: gradient }}>
              <div className="bg-[#0d1117] rounded-[13px] p-4 relative overflow-hidden">
                <div
                  className="absolute bottom-0 right-0 w-10 h-10 pointer-events-none rounded-br-[13px]"
                  style={meshStyle("8px")}
                />
                <p className="text-[10px] font-bold tracking-widest uppercase text-slate-600 mb-1">
                  {label}
                </p>
                <p className="text-[24px] font-extrabold" style={{ color }}>
                  {value ?? 0}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent records table */}
        <div
          className="relative rounded-2xl p-px"
          style={{
            background:
              "linear-gradient(135deg,rgba(20,184,166,.14),rgba(255,255,255,.04))",
          }}>
          <div className="bg-[#0d1117] rounded-[15px] overflow-hidden">
            <div className="px-4 py-3 bg-white/2 border-b border-white/5 text-[12px] font-bold text-slate-200">
              🕐 Recent Records (Last 7 Days)
            </div>

            {attendanceStats.recentRecords?.length > 0 ? (
              attendanceStats.recentRecords.map((rec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between px-4 py-3 border-b border-white/[0.035] last:border-none hover:bg-white/2 transition-colors">
                  <span className="text-[12px] text-slate-400">
                    {formatShortDate(rec.date)}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[7px] border text-[10px] font-bold uppercase
                      ${
                        rec.status === "present"
                          ? "bg-emerald-400/8 border-emerald-400/20 text-emerald-400"
                          : "bg-rose-400/8 border-rose-400/20 text-rose-400"
                      }`}>
                    {rec.status === "present" ? (
                      <>
                        <CheckCircle size={10} /> Present
                      </>
                    ) : (
                      <>
                        <XCircle size={10} /> Absent
                      </>
                    )}
                  </span>
                </motion.div>
              ))
            ) : (
              <p className="px-4 py-6 text-[13px] text-slate-600 text-center">
                No recent records found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AttendanceTab;
