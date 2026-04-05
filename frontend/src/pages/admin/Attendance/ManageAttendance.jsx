import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Trophy, UserCheck } from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../../../utils/api";

import MarkAttendanceTab from "./MarkAttendanceTab";
import MonthlyReportTab from "./MonthlyReportTab";
import LeaderboardTab from "./LeaderboardTab";

const TABS = [
  { id: "mark", label: "Mark Daily", emoji: "✅", icon: UserCheck },
  { id: "view", label: "Monthly Report", emoji: "📅", icon: Calendar },
  { id: "leaderboard", label: "Leaderboard", emoji: "🏆", icon: Trophy },
];

const ManageAttendance = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("mark");
  const [students, setStudents] = useState([]);

  const fetchStudents = useCallback(async () => {
    try {
      const res = await api.get("/admin/user/getAccess");
      if (res.data.success) setStudents(res.data.students || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load students");
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return (
    <div className="w-full min-h-screen text-white p-4 md:p-8 pb-24 overflow-y-auto flex flex-col gap-5">
      {/* ── HEADER ── */}
      <div className="pb-6 border-b border-white/5">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] font-semibold tracking-widest uppercase mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          MYWA · Admin attendance panel
        </div>
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-extrabold bg-clip-text text-transparent mb-2"
          style={{
            fontSize: "clamp(22px, 3vw, 34px)",
            backgroundImage:
              "linear-gradient(135deg, #f0fdf4 0%, #14b8a6 50%, #84cc16 100%)",
          }}>
          Attendance System
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-[14px] text-slate-500">
          Manage daily attendance, view monthly reports, and check leaderboards
          for{" "}
          <span className="text-slate-300 font-medium">
            {currentUser?.branch}
          </span>
          .
        </motion.p>
      </div>

      {/* ── TABS ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-1.5 p-1.5 rounded-2xl w-fit flex-wrap"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileTap={{ scale: 0.96 }}
              className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all whitespace-nowrap"
              style={
                isActive
                  ? {
                      background: "linear-gradient(135deg, #14b8a6, #84cc16)",
                      color: "#080c10",
                    }
                  : { color: "#64748b" }
              }>
              <span>{tab.emoji}</span>
              {tab.label}
            </motion.button>
          );
        })}
      </motion.div>

      {/* ── CONTENT CARD ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="relative rounded-[20px] p-px"
        style={{
          background:
            "linear-gradient(135deg, rgba(20,184,166,0.22), rgba(255,255,255,0.04), rgba(132,204,22,0.1))",
        }}>
        <div className="bg-[#0d1117] rounded-[19px] p-6 sm:p-8 relative overflow-hidden min-h-[400px]">
          {/* Glow */}
          <div
            className="absolute top-[-80px] right-[-80px] w-64 h-64 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(20,184,166,0.08), transparent 70%)",
            }}
          />

          {/* Mesh */}
          <div
            className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none rounded-br-[19px]"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "14px 14px",
            }}
          />

          {/* Tab content */}
          <AnimatePresence mode="wait">
            {activeTab === "mark" && (
              <motion.div
                key="mark"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}>
                <MarkAttendanceTab students={students} />
              </motion.div>
            )}
            {activeTab === "view" && (
              <motion.div
                key="view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}>
                <MonthlyReportTab students={students} />
              </motion.div>
            )}
            {activeTab === "leaderboard" && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}>
                <LeaderboardTab />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ManageAttendance;
