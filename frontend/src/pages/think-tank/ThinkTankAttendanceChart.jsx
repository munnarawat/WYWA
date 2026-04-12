import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../utils/api";
import { useEffect, useState } from "react";
import AttendanceSkeleton from "../attendance/AttendanceSkeleton";
import MiniStat from "../attendance/MiniStat";

// custom tooltip for think-tank
const AggregateTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const count = payload[0].value;
  return (
    <div
      className="px-4 py-3 rounded-[13px] border text-sm shadow-xl"
      style={{
        background: "#0d1117",
        borderColor: "rgba(20,184,166,0.3)", // Teal border
      }}>
      <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="font-bold text-teal-400">👥 {count} Students Present</p>
    </div>
  );
};
const ThinkTankAttendanceChart = ({ selectedBranch }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    avg: 0,
    peak: 0,
    total: 0,
  });
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const res = await api.get(
          `/thinkTankDashboard/chart?branch=${selectedBranch}`,
        );
        if (res.data.success) {
          let rawData = Array.isArray(res.data)
            ? res.data
            : (res.data?.data) || [];

          if (!Array.isArray(rawData)) {
            console.error("Data is still not an array!", rawData);
            setLoading(false);
            return;
          }
          let totalPresent = 0;
          let maxPresent = 0;

          const formattedData = rawData.map((item) => {
            const dateStr = item._id;
            const count = item.presentCount||0;
            // Format date string to short day (e.g., "Mon 12")
            const dateObj = new Date(dateStr);
            const shortDay = isNaN(dateObj.getTime())
              ? dateStr // If dummy data "Mon", use as is
              : `${dateObj.toLocaleDateString("en-US", { weekday: "short" })} ${dateObj.getDate()}`;

            totalPresent += count;
            if (count > maxPresent) maxPresent = count;

            return {
              name: shortDay,
              count: count,
            };
          });
          setChartData(formattedData);
          setSummary({
            total: totalPresent,
            peak: maxPresent,
            avg:
              formattedData.length > 0
                ? Math.round(totalPresent / formattedData.length)
                : 0,
          });
        }
      } catch (error) {
        console.error("Chart fetch error:", error);
        toast.error("Failed to load chart data");
      } finally {
        setLoading(false);
      }
    };
    fetchChartData();
  }, [selectedBranch]);
  if (loading) <AttendanceSkeleton />;
  if (chartData.length === 0) {
    return (
      <div className="bg-[#0d1117] rounded-[19px] p-8 text-center border border-white/5 mt-6">
        <p className="text-3xl mb-3">📭</p>
        <p className="text-slate-400 text-sm">
          No attendance data for this period.
        </p>
      </div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260 }}
      className="relative rounded-[20px] p-px mt-6"
      style={{
        background:
          "linear-gradient(135deg, rgba(20,184,166,0.3), rgba(255,255,255,0.05), rgba(59,130,246,0.15))",
      }}>
      <div className="bg-[#0d1117] rounded-[19px] p-6 sm:p-7 relative overflow-hidden">
        {/* Background Mesh (Same as your beautiful design) */}
        <div
          className="absolute bottom-0 right-0 w-36 h-36 pointer-events-none rounded-br-[19px]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        />

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] font-semibold tracking-widest uppercase mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          MYWA · Platform Analytics
        </div>

        {/* ── HEADER & MINI STATS ── */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-5 mb-8">
          <div>
            <h2
              className="font-extrabold text-[20px] bg-clip-text text-transparent mb-1"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #f0fdf4 0%, #14b8a6 50%, #3b82f6 100%)",
              }}>
              Attendance Trends
            </h2>
            <p className="text-[12px] text-slate-500">
              Last 7 days active overview
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {/* Reusing your MiniStat component */}
            <MiniStat
              value={summary.avg}
              label="Avg/Day"
              gradient="linear-gradient(135deg, #14b8a6, #84cc16)"
            />
            <MiniStat value={summary.peak} label="Peak Day" color="#3b82f6" />
          </div>
        </div>

        {/* ── AREA CHART ── */}
        <div className="relative z-10">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient
                  id="thinkTankGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.01} />
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
                // Y-axis automatically adjusts to the max number of students
                allowDecimals={false}
              />

              <RechartsTooltip
                content={<AggregateTooltip />}
                cursor={{
                  stroke: "rgba(20,184,166,0.3)",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
              />

              <Area
                type="monotone"
                dataKey="count"
                stroke="#14b8a6"
                strokeWidth={3}
                fill="url(#thinkTankGradient)"
                activeDot={{
                  r: 6,
                  fill: "#14b8a6",
                  stroke: "#0d1117",
                  strokeWidth: 2,
                }}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default ThinkTankAttendanceChart;
