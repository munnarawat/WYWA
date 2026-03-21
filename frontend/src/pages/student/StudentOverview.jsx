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
} from "lucide-react";
import api from "../../utils/api";
import toast from "react-hot-toast";

const StudentSkelton = () => {
  return (
    <div className="space-y-6 ">
      <div className="grid grid-cols-1  md:grid-cols-3 gap-6 mb-8 ">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1 space-y-4 py-1">
            <div className="h-36 w-72 bg-white/5 rounded-2xl"></div>
          </div>
        ))}
      </div>
      <div className="w-full  p-2 px-6 h-80 flex flex-col justify-around gap-6 bg-white/5 rounded-md ">
        <div className="w-1/2 bg-white/5 h-10 rounded-md mt-2 "></div>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-full h-10 animate-pulse bg-white/4 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
};
const StudentOverview = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalPresent: 0,
    totalAbsent: 0,
    percentage: 0,
    recentAttendance: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  useEffect(() => {
    const fetchMyStats = async () => {
      if (!user?.isLibraryMember) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // 1. Attendance Stats Fetch
        const [attendanceRes, booksRes] = await Promise.all([
          api.get("/dashboard/student/attendance"),
          api.get("/library/issued"),
        ]);
        if (attendanceRes.data.success) {
          setStats(attendanceRes.data.stats);
        }
        if (booksRes.data.success) {
          setIssuedBooks(booksRes.data.records);
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

  // 🔴 VIEW 1: if there are not member of library(Motivation UI)
  if (!user?.isLibraryMember) {
    return (
      <div className="w-full min-h-screen bg-zinc-950 p-4 md:p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
          {/* Background Glow */}
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
            <Rocket size={20} />
            Apply for Library Membership
            <ArrowRight size={20} />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // 🟢 VIEW 2: AGAR LIBRARY MEMBER HAI (Normal Dashboard UI)
  return (
    <div className="w-full min-h-screen bg-zinc-950 text-white p-4 md:p-8 overflow-y-auto pb-24">
      {/* Header */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold text-white capitalize">
          Welcome back, {user?.fullName?.firstName || user?.userName}! 👋
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-zinc-400 mt-1">
          Here is your daily progress and attendance overview.
        </motion.p>
      </div>
      {isLoading ? (
        <StudentSkelton />
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Card 1: Attendance Percentage */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute -right-6 -top-6 text-white/5">
                <TrendingUp size={100} />
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-teal-500/20 text-teal-400 rounded-xl">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-zinc-400 font-medium">
                  Monthly Attendance
                </h3>
              </div>
              <p className="text-4xl font-bold text-white">
                {stats.percentage}%
              </p>
              <p className="text-sm text-zinc-500 mt-2">
                Keep it above 80% for best results!
              </p>
              <div className="w-full bg-white/10 h-2 rounded-full mt-3">
                <div
                  className="bg-teal-400 h-2 rounded-full"
                  style={{ width: `${stats.percentage}%` }}
                />
              </div>
            </motion.div>

            {/* Card 2: Total Present */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
                  <UserCheck size={24} />
                </div>
                <h3 className="text-zinc-400 font-medium">Days Present</h3>
              </div>
              <p className="text-4xl font-bold text-emerald-400">
                {stats.totalPresent}
              </p>
              <p className="text-sm text-zinc-500 mt-2">This month</p>
            </motion.div>

            {/* Card 3: Total Absent */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl">
                  <UserX size={24} />
                </div>
                <h3 className="text-zinc-400 font-medium">Days Absent</h3>
              </div>
              <p className="text-4xl font-bold text-rose-400">
                {stats.totalAbsent}
              </p>
              <p className="text-sm text-zinc-500 mt-2">Try to minimize this</p>
            </motion.div>
          </div>
          {/* Recent Activity Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock size={20} className="text-teal-400" />
                Recent Activity
              </h3>
            </div>

            <div className="space-y-4">
              {stats.recentAttendance.length === 0 ? (
                <p className="text-zinc-500 text-sm">
                  No recent attendance records found.
                </p>
              ) : (
                stats.recentAttendance.map((record, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white/5 rounded-lg text-zinc-400">
                        <CalIcon size={18} />
                      </div>
                      <span className="font-medium text-zinc-300">
                        {new Date(record.date).toLocaleDateString("en-GB", {
                          weekday: "long",
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-bold uppercase rounded-md border
                      ${record.status === "present" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"}
                    `}>
                      {record.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
          {/* SECTION: My Issued Books */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 mt-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen size={20} className="text-indigo-400" />
                My Library Books
              </h3>
            </div>
            <div className="space-y-4">
              {issuedBooks?.length === 0 ? (
                <div className="text-center py-6 bg-black/40 rounded-xl border border-white/5">
                  <BookOpen size={32} className="mx-auto text-zinc-600 mb-2" />
                  <p className="text-zinc-500 text-sm">
                    You haven't issued any books yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {issuedBooks?.map((record) => (
                    <div
                      key={record._id}
                      className="p-4 bg-black/40 rounded-xl border border-white/5 flex flex-col gap-3">
                      <div>
                        <h4 className="font-bold text-white text-lg">
                          {record.book?.title || "Unknown Book"}
                        </h4>
                        <p className="text-xs text-zinc-400">
                          By {record.book?.author || "Unknown Book"}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                            Issued On
                          </span>
                          <span className="text-xs text-zinc-300">
                            {new Date(
                              record.issuedAt || record.createdAt,
                            ).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`px-3 py-1 text-xs font-bold uppercase rounded-md border
                          ${
                            record.status === "returned"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }
                        `}>
                          {record.status === "returned" ? "Returned" : "Issued"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default StudentOverview;
