import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Trophy, UserCheck } from "lucide-react";
import api from "../../../utils/api";
import { useSelector } from "react-redux";
import MarkAttendanceTab from "./MarkAttendanceTab";
import MonthlyReportTab from "./MonthlyReportTab";
import LeaderboardTab from "./LeaderboardTab";
import toast from "react-hot-toast";

const ManageAttendance = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("mark");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("/admin/users");
        setStudents(
          res.data.users.filter((u) => u.role === "student" && u.isActive),
        );
      } catch (error) {
        toast.error("Failed to load students");
        console.error(error);
      }
    };
    fetchStudents();
  }, []);

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-white p-4 md:p-8 overflow-y-auto pb-24">
      {/* 🟢 HEADER */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-teal-400 to-lime-400">
          Attendance System
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-zinc-400 mt-1">
          Manage daily attendance, view monthly reports, and check leaderboards
          for {currentUser?.branch}.
        </motion.p>
      </div>

      {/* 🟢 TABS NAVIGATION */}
      <div className="flex flex-wrap gap-2 mb-8 bg-white/5 p-1.5 rounded-2xl w-fit border border-white/10">
        <button
          onClick={() => setActiveTab("mark")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${activeTab === "mark" ? "bg-linear-to-r from-teal-500 to-lime-500 text-zinc-950 shadow-lg" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}>
          <UserCheck size={18} /> Mark Daily
        </button>
        <button
          onClick={() => setActiveTab("view")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${activeTab === "view" ? "bg-linear-to-r from-teal-500 to-lime-500 text-zinc-950 shadow-lg" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}>
          <Calendar size={18} /> Monthly Record
        </button>
        <button
          onClick={() => setActiveTab("leaderboard")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${activeTab === "leaderboard" ? "bg-linear-to-r from-teal-500 to-lime-500 text-zinc-950 shadow-lg" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}>
          <Trophy size={18} /> Leaderboard
        </button>
      </div>

      {/* 🟢 TAB CONTENT AREA */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[100px] rounded-full -z-10 pointer-events-none" />

        <AnimatePresence mode="wait">
          {activeTab === "mark" && (
            <motion.div
              key="mark"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}>
              <MarkAttendanceTab students={students} />
            </motion.div>
          )}
          {activeTab === "view" && (
            <motion.div
              key="view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}>
              <MonthlyReportTab students={students} />
            </motion.div>
          )}
          {activeTab === "leaderboard" && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}>
              <LeaderboardTab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ManageAttendance;
