import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Loader2,
  AlertCircle,
} from "lucide-react";
import api from "../../utils/api"; // Tumhara axios instance

const DashboardOverview = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalStudents: 0,
      totalBooks: 0,
      activeIssues: 0,
      todayAttendance: 0,
    },
    recentActivities: [],
  });

  // Backend se data fetch karne ka logic
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/admin/users");
        console.log(response.data.users);
        
        // setDashboardData({
        //   stats: response.data.stats,
        //   recentActivities: response.data.recentActivities,
        // });
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // UI styling configurations for cards
  const statConfig = [
    {
      title: "Total Students",
      key: "totalStudents",
      icon: Users,
      color: "text-teal-400",
      bgGlow: "bg-teal-500/20",
      border: "group-hover:border-teal-500/50",
    },
    {
      title: "Total Books",
      key: "totalBooks",
      icon: BookOpen,
      color: "text-lime-400",
      bgGlow: "bg-lime-500/20",
      border: "group-hover:border-lime-500/50",
    },
    {
      title: "Today's Attendance",
      key: "todayAttendance",
      icon: CheckCircle,
      color: "text-amber-400",
      bgGlow: "bg-amber-500/20",
      border: "group-hover:border-amber-500/50",
    },
    {
      title: "Active Book Issues",
      key: "activeIssues",
      icon: Clock,
      color: "text-rose-400",
      bgGlow: "bg-rose-500/20",
      border: "group-hover:border-rose-500/50",
    },
  ];

  // Animations
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  // 1. Loading State UI
  if (isLoading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center text-zinc-400 bg-zinc-950">
        <Loader2 size={40} className="animate-spin text-teal-400 mb-4" />
        <p className="font-medium tracking-wide">Syncing MYWA Dashboard...</p>
      </div>
    );
  }

  // 2. Error State UI
  if (error) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center text-red-400 bg-zinc-950">
        <AlertCircle size={48} className="mb-4 text-red-500/80" />
        <p className="font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white transition">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-white p-4 md:p-8 overflow-y-auto pb-24">
      {/* Page Header */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-teal-400 to-lime-400">
          Overview
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-zinc-400 mt-1">
          Track your library and student metrics in real-time.
        </motion.p>
      </div>

      {/* 🟢 STATS GRID */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statConfig.map((stat, index) => (
          <motion.div
            variants={item}
            key={index}
            className={`relative group bg-white/5 border border-white/10 rounded-2xl p-6 overflow-hidden transition-all duration-300 ${stat.border}`}>
            {/* Ambient Background Glow */}
            <div
              className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${stat.bgGlow} -z-10`}
            />

            <div className="flex justify-between items-start">
              <div>
                <p className="text-zinc-400 text-sm font-medium mb-1">
                  {stat.title}
                </p>
                {/* Dynamically matching key with backend data */}
                <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                  {dashboardData.stats[stat.key] || 0}
                </h3>
              </div>
              <div
                className={`p-3 rounded-xl bg-white/5 border border-white/10 ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={22} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 🟢 RECENT ACTIVITY TABLE (Book Issues & Returns) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
          <h2 className="text-lg font-semibold text-white">
            Recent Library Transactions
          </h2>
          <button className="text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          {dashboardData.recentActivities.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">
              No recent activities found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-zinc-900/50 text-zinc-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Student Name</th>
                  <th className="px-6 py-4 font-medium">Book Details</th>
                  <th className="px-6 py-4 font-medium">Action Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">More</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-sm">
                {dashboardData.recentActivities.map((activity, index) => (
                  <tr
                    key={index}
                    className="hover:bg-white/5 transition-colors group">
                    {/* Student Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-teal-500/20 to-lime-500/20 border border-white/10 flex items-center justify-center text-teal-400 font-bold text-xs uppercase">
                          {activity.studentName?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-medium text-white capitalize">
                            {activity.studentName}
                          </p>
                          {/* Yahan branch ya ID dikha sakte ho */}
                          <p className="text-xs text-zinc-500">
                            {activity.branch || "MYWA Center"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Book Details */}
                    <td className="px-6 py-4">
                      <p className="text-zinc-300 font-medium truncate max-w-[200px]">
                        {activity.bookName}
                      </p>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-zinc-500 text-xs">
                      {new Date(activity.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Status Pill */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                        ${activity.status === "Issued" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : ""}
                        ${activity.status === "Returned" ? "bg-teal-500/10 text-teal-400 border-teal-500/20" : ""}
                        ${activity.status === "Overdue" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : ""}
                      `}>
                        {activity.status}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="px-6 py-4 text-right">
                      <button className="text-zinc-500 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;
