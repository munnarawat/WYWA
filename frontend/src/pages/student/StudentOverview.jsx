import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  BookOpen,
  Rocket,
  ArrowRight,
  Calendar as CalIcon,
  TrendingUp,
  UserCheck,
  UserX,
  Clock,
  Bell,
  Trophy,
  HelpCircle,
} from "lucide-react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import StudentStats from "./StudentStats";
import IssuedBooks from "./IssuedBooks";
import DashboardSidebar from "./DashboardSidebar";

const StudentSkelton = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1 space-y-4 py-1">
            <div className="h-36 w-full bg-white/5 rounded-2xl"></div>
          </div>
        ))}
      </div>
      <div className="w-full p-2 px-6 h-80 flex flex-col justify-around gap-6 bg-white/5 rounded-md">
        <div className="w-1/2 bg-white/5 h-10 rounded-md mt-2"></div>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-full h-10 animate-pulse bg-white/5 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
};

const StudentOverview = () => {
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  // States
  const [stats, setStats] = useState({
    totalPresent: 0,
    totalAbsent: 0,
    percentage: 0,
    recentAttendance: [],
  });
  const [issuedBooks, setIssuedBooks] = useState([]);

  const [notices, setNotices] = useState([]);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const fetchMyStats = async () => {
      if (!user?.isLibraryMember) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // API Calls
        const [attendanceRes, booksRes, noticeRes, achievementRes] =
          await Promise.all([
            api.get("/dashboard/student/attendance"),
            api.get("/library/issued"),
            api.get("/notice/"),
            api.get("/achievements/student"),
          ]);

        if (attendanceRes.data.success) {
          setStats(attendanceRes.data.stats);
        }
        if (booksRes.data.success) {
          setIssuedBooks(booksRes.data.records);
        }
        if (noticeRes.data.success) {
          setNotices(noticeRes.data.notices);
        }
        if (achievementRes.data.success) {
          setAchievements(achievementRes.data.achievements);
        }
      } catch (error) {
        console.error("Error fetching dashboard data", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyStats();
  }, [user]);

  // 🔴 VIEW 1: Motivation UI (Non-Library Member)
  if (!user?.isLibraryMember) {
    return (
      <div className="w-full min-h-screen bg-zinc-950 p-4 md:p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-teal-500/20 blur-[100px] -z-10"></div>
          <div className="w-20 h-20 bg-linear-to-tr from-teal-500 to-lime-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-500/20 transform rotate-12">
            <BookOpen size={40} className="text-zinc-950 -rotate-12" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Take Your Preparation to the{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-lime-400">
              Next Level
            </span>
          </h2>
          <p className="text-zinc-400 text-base md:text-lg mb-8 max-w-lg mx-auto leading-relaxed">
            MYWA Library provides the perfect silent environment, high-speed
            Wi-Fi, and a community of focused students. Stop studying in
            distractions!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 bg-white text-black font-bold px-8 py-4 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all">
            <Rocket size={20} /> Apply for Library Membership{" "}
            <ArrowRight size={20} />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-white p-4 md:p-8 overflow-y-auto pb-24">
      {/* 1. HERO SECTION */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl md:text-4xl font-bold text-white mb-2">
            Welcome back,{" "}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-teal-400 to-lime-400 capitalize">
              {user?.fullName?.firstName || user?.userName}
            </span>
            👋
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 mt-1">
            {user?.branch} Branch | Here is your daily progress overview.
          </motion.p>
        </div>
      </div>

      {isLoading ? (
        <StudentSkelton />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-8">
            <StudentStats stats={stats} />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                <Clock size={20} className="text-teal-400" /> Recent Activity
              </h3>
              <div className="space-y-4">
                {stats.recentAttendance.map((record, i) => (
                  <div
                    key={i}
                    className="flex justify-between p-4 bg-black/40 rounded-xl border border-white/5">
                    <div className="flex gap-4">
                      <CalIcon size={18} className="text-zinc-400" />{" "}
                      {new Date(record.date).toLocaleDateString()}
                    </div>
                    <span
                      className={`uppercase text-xs font-bold ${record.status === "present" ? "text-emerald-400" : "text-rose-400"}`}>
                      {record.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <IssuedBooks issuedBooks={issuedBooks} />
          </div>
          {/* RIGHT COLUMN (SIDEBAR) */}
          <div className="lg:col-span-4">
            <DashboardSidebar notices={notices} achievements={achievements} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentOverview;
