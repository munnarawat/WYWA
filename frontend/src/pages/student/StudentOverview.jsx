import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Calendar as CalIcon,
  Clock,
  Rocket,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import toast from "react-hot-toast";
import StudentStats from "./StudentStats";
import IssuedBooks from "./IssuedBooks";
import DashboardSidebar from "./DashboardSidebar";

// ─────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────
const StudentSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {/* Stats skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-40 rounded-[20px] bg-white/[0.04]" />
      ))}
    </div>

    {/* Main grid skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
      <div className="flex flex-col gap-5">
        <div className="h-64 rounded-[20px] bg-white/4" />
        <div className="h-72 rounded-[20px] bg-white/4" />
      </div>
      <div className="flex flex-col gap-4">
        <div className="h-16 rounded-[18px] bg-white/4" />
        <div className="h-52 rounded-[20px] bg-white/4" />
        <div className="h-44 rounded-[20px] bg-white/4" />
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────
// NON-MEMBER MOTIVATION VIEW
// ─────────────────────────────────────────
const NonMemberView = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260 }}
        className="relative w-full max-w-[580px] rounded-3xl p-px"
        style={{
          background:
            "linear-gradient(135deg, rgba(20,184,166,0.35), rgba(255,255,255,0.05), rgba(132,204,22,0.2))",
        }}>
        <div className="bg-[#0d1117] rounded-[23px] px-10 py-12 text-center relative overflow-hidden">
          {/* Top ambient glow */}
          <div
            className="absolute -top-15 left-1/2 -translate-x-1/2 w-72 h-48 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(20,184,166,0.12), transparent 70%)",
            }}
          />

          {/* Icon */}
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 6, -4, 6, 0] }}
            transition={{ delay: 0.5, duration: 1.2 }}
            className="w-20 h-20 rounded-[22px] flex items-center justify-center mx-auto mb-6 text-4xl"
            style={{ background: "linear-gradient(135deg, #14b8a6, #84cc16)" }}>
            📚
          </motion.div>

          <h2 className="text-3xl font-extrabold text-slate-100 mb-4 leading-tight">
            Take Your Preparation to the{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #14b8a6, #84cc16)",
              }}>
              Next Level
            </span>
          </h2>

          <p className="text-slate-500 text-[15px] leading-relaxed mb-8 max-w-md mx-auto">
            MYWA Library provides the perfect silent environment, high-speed
            Wi-Fi, and a community of focused students. Stop studying in
            distractions!
          </p>

          <motion.button
            whileHover={{ y: -3, boxShadow: "0 0 40px rgba(255,255,255,0.3)" }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/apply-membership")}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white text-[#080c10] font-extrabold text-[14px] transition-all"
            style={{
              boxShadow: "0 0 24px rgba(255,255,255,0.15)",
            }}>
            <Rocket size={18} />
            Apply for Library Membership
            <ArrowRight size={18} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

// ─────────────────────────────────────────
// RECENT ACTIVITY CARD
// ─────────────────────────────────────────
const RecentActivity = ({ records = [] }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2, type: "spring", stiffness: 260 }}
    className="relative rounded-[20px] p-px"
    style={{
      background:
        "linear-gradient(135deg, rgba(20,184,166,0.28), rgba(255,255,255,0.05), rgba(132,204,22,0.15))",
    }}>
    <div className="bg-[#0d1117] rounded-[19px] p-6 relative overflow-hidden">
      {/* Mesh */}
      <div
        className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none rounded-br-[19px]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[16px] font-bold text-slate-100 flex items-center gap-2">
          🕐 Recent Activity
        </h3>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/[0.05] text-slate-500">
          Last {records.length} Days
        </span>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[10px] font-bold tracking-widest uppercase text-slate-600 whitespace-nowrap">
          Attendance log
        </span>
        <div className="flex-1 h-px bg-white/5" />
      </div>

      {/* Records */}
      {records.length === 0 ? (
        <p className="text-slate-600 text-sm py-4 text-center">
          No recent activity yet.
        </p>
      ) : (
        <div className="space-y-2">
          {records.map((record, i) => {
            const isPresent = record.status === "present";
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                whileHover={{ x: 4 }}
                className="flex items-center justify-between px-4 py-3 rounded-[13px] border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                <div className="flex items-center gap-3 text-[13px] text-slate-400">
                  {/* Glowing dot */}
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      background: isPresent ? "#34d399" : "#fb7185",
                      boxShadow: isPresent
                        ? "0 0 6px rgba(52,211,153,0.5)"
                        : "0 0 6px rgba(251,113,133,0.5)",
                    }}
                  />
                  <CalIcon size={14} className="text-slate-600" />
                  {new Date(record.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <span
                  className={`text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-md border
                    ${
                      isPresent
                        ? "bg-emerald-400/10 border-emerald-400/20 text-emerald-400"
                        : "bg-rose-400/10 border-rose-400/20 text-rose-400"
                    }`}>
                  {record.status}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  </motion.div>
);

// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────
const StudentOverview = () => {
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  const [stats, setStats] = useState({
    totalPresent: 0,
    totalAbsent: 0,
    percentage: 0,
    recentAttendance: [],
  });
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [notices, setNotices] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (!user?.isLibraryMember) {
      setIsLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        setIsLoading(true);
        const [attendanceRes, booksRes, noticeRes, achievementRes, ticketRes] =
          await Promise.all([
            api.get("/dashboard/student/attendance"),
            api.get("/library/issued"),
            api.get("/notice/"),
            api.get("/achievements/student"),
            api.get("/ticket/my")
          ]);

        if (attendanceRes.data.success) setStats(attendanceRes.data.stats);
        if (booksRes.data.success) setIssuedBooks(booksRes.data.records);
        if (noticeRes.data.success) setNotices(noticeRes.data.notices);
        if (achievementRes.data.success)
          setAchievements(achievementRes.data.achievements);
        if(ticketRes.data.success) setTickets(ticketRes.data.tickets);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        toast.error("Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [user?._id]);

  // Non-member view
  if (!user?.isLibraryMember) return <NonMemberView />;

  const firstName = user?.fullName?.firstName || user?.userName || "Student";

  return (
    <div className="w-full min-h-screen text-white p-4 md:p-8 pb-24 overflow-y-auto">
      {/* ── HERO ── */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] font-semibold tracking-widest uppercase mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          MYWA · Student Dashboard
        </div>

        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl md:text-4xl font-extrabold mb-2 bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #f0fdf4 0%, #14b8a6 50%, #84cc16 100%)",
          }}>
          Welcome back, {firstName} 👋
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2.5 flex-wrap">
          <span className="text-[14px] text-slate-500">
            {user?.branch} Branch
            <span className="mx-2 text-slate-700">·</span>
            Here's your daily progress overview.
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] font-bold">
            ✅ Library Member
          </span>
        </motion.div>
      </div>

      {/* ── LOADING ── */}
      {isLoading ? (
        <StudentSkeleton />
      ) : (
        <div className="flex flex-col gap-5">
          {/* Stats */}
          <StudentStats stats={stats} />

          {/* Main layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-5">
              <RecentActivity records={stats.recentAttendance} />
              <IssuedBooks issuedBooks={issuedBooks} />
            </div>

            {/* RIGHT COLUMN */}
            <DashboardSidebar notices={notices} achievements={achievements} tickets={tickets} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentOverview;
