import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../../../utils/api";

import AdminStatCards from "./AdminStatCards";
import QuickActions from "./QuickActions";
import TodayAttendance from "./TodayAttendance";
import RecentIssuesTable from "./RecentIssuesTable";
import TopStreakers from "./TopStreakers";
import PendingTicketsSidebar from "./PendingTicketsSidebar";
import NoticesSidebar from "./NoticesSidebar";

// ─────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────
const DashboardSkeleton = () => (
  <div className="flex flex-col gap-5 animate-pulse">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-36 rounded-[20px] bg-white/4" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
      <div className="flex flex-col gap-4">
        <div className="h-36 rounded-[20px] bg-white/4" />
        <div className="h-64 rounded-[20px] bg-white/4" />
        <div className="h-48 rounded-[20px] bg-white/4" />
      </div>
      <div className="flex flex-col gap-4">
        <div className="h-52 rounded-[20px] bg-white/4" />
        <div className="h-52 rounded-[20px] bg-white/4" />
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────
const DashboardOverview = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const todayDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/dashboard/overview");
        setData(res.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        toast.error(err.response?.data?.message || "Failed to load dashboard.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const firstName =
    currentUser?.fullName?.firstName || currentUser?.userName || "Admin";

  return (
    <div className="w-full min-h-screen text-white p-4 md:p-8 pb-24 overflow-y-auto flex flex-col gap-6">
      {/* ── HERO ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] font-semibold tracking-widest uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            MYWA · Admin Dashboard
          </div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-extrabold bg-clip-text text-transparent mb-2"
            style={{
              fontSize: "clamp(24px, 3.5vw, 38px)",
              backgroundImage:
                "linear-gradient(135deg, #f0fdf4 0%, #14b8a6 50%, #84cc16 100%)",
              fontFamily: "'Syne', sans-serif",
            }}>
            Welcome back, {firstName} 👋
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[14px] text-slate-500">
            Here's what's happening in{" "}
            <span className="text-slate-300 font-medium">
              {currentUser?.branch}
            </span>{" "}
            branch today.
          </motion.p>
        </div>

        {/* Date tag */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[13px] text-[12px] text-slate-500 shrink-0"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}>
          📅 <strong className="text-slate-300">{todayDate}</strong>
        </motion.div>
      </div>

      {/* ── QUICK ACTIONS ── */}
      <QuickActions />

      {/* ── LOADING ── */}
      {isLoading || !data ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* ── STAT CARDS ── */}
          <AdminStatCards stats={data.stats} />

          {/* ── MAIN GRID ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
            {/* LEFT */}
            <div className="flex flex-col gap-5">
              <TodayAttendance
                present={data.todayAttendance?.present ?? 0}
                absent={data.todayAttendance?.absent ?? 0}
              />
              <RecentIssuesTable
                issues={data.recentActivity?.recentIssues ?? []}
              />
              <TopStreakers streakers={data.topStreakers ?? []} />
            </div>

            {/* RIGHT */}
            <div className="flex flex-col gap-5">
              <PendingTicketsSidebar tickets={data.pendingTickets ?? []} />
              <NoticesSidebar
                notices={data.recentActivity?.recentNotices ?? []}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardOverview;
