import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import api from "../../utils/api";
import toast from "react-hot-toast";

// Sub-components Import
import AttendanceSkeleton from "./AttendanceSkeleton";
import MiniStat from "./MiniStat";
import DayDot from "./DayDot";
import CustomTooltip from "./CustomTooltip";
import NonMemberView from "../student/NonMemberView";

const AttendanceChart = () => {
  const { user } = useSelector((state) => state.auth);
  const [chartData, setChartData] = useState([]);
  const [dotData, setDotData] = useState([]);
  const [summary, setSummary] = useState({
    percentage: 0,
    presentDays: 0,
    absentDays: 0,
    currentStreak: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const monthName = new Date().toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
  const todayStr = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
  });

  useEffect(() => {
    if (!user?._id) return;
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const currentDate = new Date();
        const response = await api.get("/attendance/monthly", {
          params: {
            studentId: user._id,
            year: currentDate.getFullYear(),
            month: currentDate.getMonth() + 1,
          },
        });

        const { records, summary: apiSummary } = response.data;

        const formatted = records.map((record) => {
          const dateObj = new Date(record.date);
          const dayName = dateObj.toLocaleDateString("en-US", {
            weekday: "short",
          });
          const dayNum = dateObj.getDate();
          return {
            name: `${dayName} ${dayNum}`,
            shortName: `${dayName.slice(0, 3)} ${dayNum}`,
            attendance: record.status === "present" ? 100 : 0,
            isPresent: record.status === "present",
          };
        });

        const last7 = formatted.slice(-7);
        setChartData(last7);
        setDotData(last7);
        setSummary(
          apiSummary || {
            percentage: 0,
            presentDays: 0,
            absentDays: 0,
            currentStreak: 0,
          },
        );
      } catch (err) {
        console.error("Attendance fetch error:", err);
        toast.error("Failed to load attendance data.");
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [user?._id]);
  if (loading) return <AttendanceSkeleton />;

  if (error) {
    return (
      <div
        className="rounded-[20px] p-px"
        style={{
          background:
            "linear-gradient(135deg, rgba(251,113,133,0.25), rgba(255,255,255,0.04))",
        }}>
        <div className="bg-[#0d1117] rounded-[19px] p-8 text-center">
          <p className="text-3xl mb-3">📡</p>
          <p className="text-slate-400 text-sm">
            Failed to load attendance data.
          </p>
          <p className="text-slate-600 text-xs mt-1">
            Please refresh the page.
          </p>
        </div>
      </div>
    );
  }

  const safePercentage = isNaN(summary.percentage)
    ? 0
    : Math.min(summary.percentage, 100);
      // Non-member view
  if (!user?.isLibraryMember) return <NonMemberView />;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260 }}
      className="relative rounded-[20px] p-px"
      style={{
        background:
          "linear-gradient(135deg, rgba(20,184,166,0.3), rgba(255,255,255,0.05), rgba(132,204,22,0.15))",
      }}>
      <div className="bg-[#0d1117] rounded-[19px] p-6 sm:p-7 relative overflow-hidden">
        {/* Background Details */}
        <div
          className="absolute -top-20 -right-20 w-60 h-60 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(20,184,166,0.1), transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-15 -left-15 w-48 h-48 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(132,204,22,0.07), transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-36 h-36 pointer-events-none rounded-br-[19px]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        />
        {/* Eyebrow */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] font-semibold tracking-widest uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            MYWA · Student Achievement
          </div>
        </div>
        {/* ── HEADER ── */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-5 mb-6">
          <div>
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-lg mb-3">
              📅
            </div>
            <h2
              className="font-extrabold text-[20px] bg-clip-text text-transparent mb-1"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #f0fdf4 0%, #14b8a6 50%, #84cc16 100%)",
              }}>
              Weekly Attendance
            </h2>
            <p className="text-[12px] text-slate-500">
              Last 7 days · {monthName}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <MiniStat
              value={`${safePercentage}%`}
              label="Monthly"
              gradient="linear-gradient(135deg, #14b8a6, #84cc16)"
            />
            <MiniStat
              value={summary.presentDays ?? 0}
              label="Present"
              color="#34d399"
            />
            <MiniStat
              value={summary.absentDays ?? 0}
              label="Absent"
              color="#fb7185"
            />
          </div>
        </div>

        {/* ── STREAK & MONTH ROW ── */}
        <div className="relative z-10 flex items-center gap-3 flex-wrap mb-5">
          {summary.currentStreak > 0 && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12px] font-bold text-rose-400"
              style={{
                background: "rgba(251,113,133,0.08)",
                border: "1px solid rgba(251,113,133,0.2)",
              }}>
              <span className="animate-bounce">🔥</span> {summary.currentStreak}{" "}
              Day Streak
            </motion.div>
          )}
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12px] text-slate-500"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}>
            📆 {monthName}
          </div>
        </div>

        {/* ── DAY DOTS ── */}
        <div className="relative z-10 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-600 whitespace-nowrap">
              Last 7 days
            </span>
            <div className="flex-1 h-px bg-white/5" />
          </div>
          {dotData.length === 0 ? (
            <p className="text-slate-600 text-sm py-2">
              📭 No records yet — start your streak today!
            </p>
          ) : (
            <div className="flex gap-2">
              {dotData.map((d, i) => (
                <DayDot
                  key={i}
                  day={d.shortName}
                  isPresent={d.isPresent}
                  isToday={d.shortName === todayStr}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── AREA CHART ── */}
        {chartData.length > 0 && (
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-600 whitespace-nowrap">
                Attendance trend
              </span>
              <div className="flex-1 h-px bg-white/5" />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 4, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="attGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#475569"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dy={8}
                />
                <YAxis
                  stroke="#475569"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => (v === 100 ? "P" : v === 0 ? "A" : "")}
                  ticks={[0, 100]}
                  domain={[-10, 120]}
                />
                <RechartsTooltip
                  content={<CustomTooltip />}
                  cursor={{
                    stroke: "rgba(20,184,166,0.3)",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="attendance"
                  stroke="#14b8a6"
                  strokeWidth={2.5}
                  fill="url(#attGradient)"
                  fillOpacity={1}
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    const isPresent = payload.attendance === 100;
                    return (
                      <circle
                        key={cx}
                        cx={cx}
                        cy={cy}
                        r={5}
                        fill={isPresent ? "#34d399" : "#fb7185"}
                        stroke="#0d1117"
                        strokeWidth={2}
                      />
                    );
                  }}
                  activeDot={{
                    r: 8,
                    fill: "#14b8a6",
                    stroke: "#0d1117",
                    strokeWidth: 2,
                  }}
                  animationDuration={1400}
                  animationEasing="ease-in-out"
                />
              </AreaChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="flex gap-4 mt-3 flex-wrap">
              {[
                {
                  color: "#34d399",
                  shadow: "rgba(52,211,153,0.5)",
                  label: "Present",
                },
                {
                  color: "#fb7185",
                  shadow: "rgba(251,113,133,0.5)",
                  label: "Absent",
                },
              ].map(({ color, shadow, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      background: color,
                      boxShadow: `0 0 6px ${shadow}`,
                    }}
                  />{" "}
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MONTHLY PROGRESS BAR ── */}
        <div className="relative z-10 mt-6 pt-5 border-t border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-600">
              Monthly Progress
            </span>
            <span className="text-[12px] font-bold text-teal-400">
              {safePercentage}% · Target 75%
            </span>
          </div>
          <div className="w-full h-1.5 bg-white/6 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${safePercentage}%` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #14b8a6, #84cc16)" }}
            />
          </div>
          <div className="relative mt-1">
            <div
              className="absolute top-0 w-px h-2 bg-amber-400/60"
              style={{ left: "75%" }}
            />
            <span
              className="absolute text-[9px] font-bold text-amber-500/80"
              style={{
                left: "75%",
                transform: "translateX(-50%)",
                top: "4px",
              }}>
              75%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AttendanceChart;
