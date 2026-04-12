import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const ThinkTankDashboard = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [stats, setStats] = useState({
    totalStudents: 0,
    libraryMember: 0,
    totalBooks: 0,
    issueBooks: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);

      const res = await api.get(
        `/thinkTankDashboard/stats?branch=${selectedBranch}`,
      );
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error("fetch stats error", error);

      toast.error("Error fetch stats");
    }
  };
  useEffect(() => {
    fetchDashboardStats();
  }, [selectedBranch]);
  // today date
  const todayDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  // first name
  const firstName =
    currentUser?.fullName?.firstName || currentUser?.userName || "Admin";
  return (
    <div className="w-full min-h-screen text-white p-4 md:p-8 pb-24 overflow-y-auto flex flex-col gap-6">
      {/* Helmet */}
      <Helmet>
        <title>ThinkTank Dashboard | MYWA</title>
      </Helmet>
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] font-semibold tracking-widest uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            MYWA · ThinkTank Dashboard
          </div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-extrabold bg-clip-text text-transparent mb-2"
            style={{
              fontSize: "clamp(24px, 3.5vw, 38px)",
              backgroundImage:
                "linear-gradient(135deg, #f0fdf4 0%, #14b8a6 50%, #84cc16 100%)",
            }}>
            Welcome back, {firstName} 👋
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[14px] text-slate-500">
            Here's what's happening in{" "}
            <span className="text-slate-300 font-medium">All branch</span>{" "}
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
        {/* Dropdown */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-3 bg-zinc-900/50 p-2 rounded-[13px]"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}>
          <label className="text-sm text-slate-400 font-medium pl-2">
            Branch:
          </label>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="bg-zinc-800/30 w-full text-slate-200 text-sm rounded-lg px-3 py-1.5 border border-white/5 focus:outline-none focus:ring-1 focus:ring-teal-500/60 cursor-pointer">
            <option className="bg-black" value="all">All Branches</option>
            <option className="bg-black" value="dehradun">Dehradun Only</option>
            <option className="bg-black" value="haldwani">Haldwani Only</option>
          </select>
        </motion.div>
      </div>
      {/* stats cards */}
      
    </div>
  );
};

export default ThinkTankDashboard;
