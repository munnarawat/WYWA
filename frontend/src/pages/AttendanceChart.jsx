import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CalendarDays, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import api from "../utils/api";
import toast from "react-hot-toast";
const AttendanceChart = () => {
  const data = [
    { name: "Mon", attendance: 100 },
    { name: "Tue", attendance: 0 }, // Absent tha is din
    { name: "Wed", attendance: 100 },
    { name: "Thu", attendance: 100 },
    { name: "Fri", attendance: 100 },
    { name: "Sat", attendance: 50 }, // Half day
  ];
  const { user } = useSelector((state) => state.auth);
  const [chartData, setChartData] = useState([]);
  const [summary, setSummary] = useState({ percentage: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!user?._id) return;
      try {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const response = await api.get("/attendance/monthly", {
          params: {
            studentId: user._id,
            year: year,
            month: month,
          },
          withCredentials: true,
        });
        const { records, summary } = response.data;

        // data formatting for recharts
        const formattedData = records.map((record) => {
          const dateObj = new Date(record.date);
          const dayName = dateObj.toLocaleDateString("en-US", {
            weekday: "short",
          });
          const dayNum = dateObj.getDate();

          return {
            name: `${dayName} ${dayNum}`,
            attendance: record.status === "present" ? 100 : 0,
          };
        });

        const last7Days = formattedData.slice(-7);
        setChartData(last7Days);
        setSummary(summary);
      } catch (error) {
        console.error("Error fetching attendance:", error);
        toast.error("Failed to load attendance data");
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [user]);
  return (
    <div className="p-5 sm:p-6 bg-zinc-900/50 border border-white/5 rounded-2xl shadow-xl relative overflow-hidden group hover:border-white/10 transition-colors">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Header Section */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <div className="p-1.5 bg-teal-500/10 rounded-lg">
              <CalendarDays className="text-teal-400" size={18} />
            </div>
            Weekly Attendance
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Last 7 days performance
          </p>
        </div>
        <div className="text-right">
          {loading ? (
            <div className="h-8 w-16 bg-white/10 animate-pulse rounded-md" />
          ) : (
            <>
              <p className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-lime-400">
                {summary.percentage}%
              </p>
              <p className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest font-mono mt-0.5">
                Monthly Avg
              </p>
            </>
          )}
        </div>
      </div>

      {/* The Chart Area */}
      <div className="w-full min-h-[250px] relative z-10 mt-4 flex justify-center items-center">
        {loading ? (
          <Loader2 className="animate-spin text-teal-500" size={32} />
        ) : chartData.length === 0 ? (
          <p className="text-zinc-500 text-sm">
           "📭 No attendance yet — start your streak today!"
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient
                  id="colorAttendance"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#ffffff0a"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="#71717a"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="#71717a"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#09090b",
                  borderColor: "#27272a",
                  borderRadius: "12px",
                  color: "#fff",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
                }}
                itemStyle={{ color: "#14b8a6", fontWeight: "bold" }}
                cursor={{
                  stroke: "#14b8a6",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
              />
              <Area
                type="monotone"
                dataKey="attendance"
                stroke="#14b8a6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorAttendance)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default AttendanceChart;
