import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  Clock,
  Trophy,
  Activity,
  Bell,
  BookDown,
  Loader2,
} from "lucide-react";
import api from "../../utils/api";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

// 🌟 SKELETON LOADER
const DashboardSkeleton = () => (
  <div className="space-y-6">
    {/* 4 Stat Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 h-32 animate-pulse flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="h-4 w-24 bg-white/10 rounded"></div>
            <div className="h-10 w-10 bg-white/10 rounded-xl"></div>
          </div>
          <div className="h-8 w-16 bg-white/20 rounded-lg mt-4"></div>
        </div>
      ))}
    </div>

    {/* Bottom Section: 2/3 Table, 1/3 List */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 h-80 animate-pulse">
        <div className="h-6 w-48 bg-white/10 rounded mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-white/5 rounded-lg w-full"></div>
          ))}
        </div>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-80 animate-pulse">
        <div className="h-6 w-32 bg-white/10 rounded mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-white/5 rounded-lg w-full"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
const DashboardOverview = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/dashboard/overview");
        setData(response.data);
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
        toast.error(err.response?.data?.message || "Failed to load dashboard data")
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  if (isLoading || !data) {
    return (
      <div className="w-full min-h-screen bg-zinc-950 p-4 md:p-8 overflow-y-auto pb-24">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-white p-4 md:p-8 overflow-hidden pb-24 relative">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-lime-500/10 blur-[120px] rounded-full -z-10 pointer-events-none" />

      {/* 🟢 HEADER */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl md:text-4xl font-bold text-white mb-2">
          Welcome back,{" "}
          <span className="bg-clip-text text-transparent bg-linear-to-r from-teal-400 to-lime-400 capitalize">
            {currentUser?.fullName?.firstName || currentUser?.userName}
          </span>{" "}
          👋
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-zinc-400">
          Here is what's happening in your{" "}
          <span className="text-white font-medium">{currentUser?.branch}</span>{" "}
          branch today.
        </motion.p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6">
        {/* 🟢 STAT CARDS (Top Row) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Students */}
          <motion.div
            variants={itemVariants}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-zinc-400 text-sm font-medium mb-1">
                  Total Students
                </p>
                <h3 className="text-3xl font-black text-white">
                  {data?.stats?.totalStudents || 0}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                <Users size={24} />
              </div>
            </div>
          </motion.div>

          {/* Card 2: Books */}
          <motion.div
            variants={itemVariants}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-teal-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-zinc-400 text-sm font-medium mb-1">
                  Library Books
                </p>
                <h3 className="text-3xl font-black text-white">
                  {data?.stats?.totalBooks || 0}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400">
                <BookOpen size={24} />
              </div>
            </div>
          </motion.div>

          {/* Card 3: Active Issues */}
          <motion.div
            variants={itemVariants}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-rose-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-zinc-400 text-sm font-medium mb-1">
                  Active Issues
                </p>
                <h3 className="text-3xl font-black text-white">
                  {data?.stats?.activeIssues || 0}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400">
                <Clock size={24} />
              </div>
            </div>
          </motion.div>

          {/* Card 4: Achievements */}
          <motion.div
            variants={itemVariants}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-amber-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-zinc-400 text-sm font-medium mb-1">
                  Wall of Fame
                </p>
                <h3 className="text-3xl font-black text-white">
                  {data?.stats?.totalAchievements || 0}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                <Trophy size={24} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* 🟢 BOTTOM SECTION (Split Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side: Recent Book Issues (Takes 2 columns) */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                <Activity className="text-teal-400" size={20} /> Recent Book
                Issues
              </h2>
            </div>

            {data?.recentActivity?.recentIssues?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="text-zinc-500 border-b border-white/5">
                    <tr>
                      <th className="pb-3 font-medium">Student</th>
                      <th className="pb-3 font-medium">Book Title</th>
                      <th className="pb-3 font-medium text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {data.recentActivity.recentIssues.map((issue) => (
                      <tr
                        key={issue._id}
                        className="hover:bg-white/5 transition-colors">
                        <td className="py-3 pr-4">
                          <p className="font-semibold text-white capitalize">
                            {issue.student?.userName || "Unknown"}
                          </p>
                        </td>
                        <td
                          className="py-3 px-4 text-zinc-300 max-w-[150px] truncate"
                          title={issue.book?.title}>
                          {issue.book?.title || "Deleted Book"}
                        </td>
                        <td className="py-3 pl-4 text-right text-zinc-500">
                          {new Date(
                            issue.issuedAt || issue.createdAt,
                          ).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 py-8">
                <BookDown size={32} className="mb-2 opacity-50" />
                <p>No books issued recently.</p>
              </div>
            )}
          </motion.div>

          {/* Right Side: Recent Notices (Takes 1 column) */}
          <motion.div
            variants={itemVariants}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                <Bell className="text-lime-400" size={20} /> Latest Notices
              </h2>
            </div>

            {data?.recentActivity?.recentNotices?.length > 0 ? (
              <div className="space-y-4">
                {data.recentActivity.recentNotices.map((notice) => (
                  <div
                    key={notice._id}
                    className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-lime-500/30 transition-colors">
                    <h4
                      className="font-semibold text-white text-sm line-clamp-1"
                      title={notice.title}>
                      {notice.title}
                    </h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-lime-500/80 bg-lime-500/10 px-2 py-0.5 rounded">
                        Announcement
                      </span>
                      <span className="text-xs text-zinc-500">
                        {new Date(notice.createdAt).toLocaleDateString(
                          "en-IN",
                          { month: "short", day: "numeric" },
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 py-8">
                <Bell size={32} className="mb-2 opacity-50" />
                <p>No recent announcements.</p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;
