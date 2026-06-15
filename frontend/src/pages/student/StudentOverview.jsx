import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Calendar as CalIcon,
  Clock,
  Library,
  Rocket,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import toast from "react-hot-toast";
import StudentStats from "./StudentStats";
import IssuedBooks from "./IssuedBooks";
import DashboardSidebar from "./DashboardSidebar";
import { Helmet } from "react-helmet-async";
import NonMemberView from "./NonMemberView";
import ReactivateLibraryCard from "./ReActivateLibrary/ReactivateLibraryCard";

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
    if (!user?.isMywaFamilyMember) {
      setIsLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        setIsLoading(true);
        const apiCalls = [
          api.get("/notice/"),
          api.get("/achievements/student"),
          api.get("/ticket/my"),
        ];
        // if student are still library member to see this attendance and books section
        if (user.isLibraryMember) {
          apiCalls.push(api.get("/dashboard/student/attendance"));
          apiCalls.push(api.get("/library/issued"));
        }
        const responses = await Promise.all(apiCalls);

        if (responses[0].data.success) setNotices(responses[0].data.notices);
        if (responses[1].data.success)
          setAchievements(responses[1].data.achievements);
        if (responses[2].data.success) setTickets(responses[2].data.tickets);

        if (user.isLibraryMember) {
          if (responses[3]?.data.success) setStats(responses[3].data.stats);
          if (responses[4]?.data.success)
            setIssuedBooks(responses[4].data.records);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        toast.error("Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [user?._id, user?.isLibraryMember, user?.isMywaFamilyMember]);

  // Non-member view
  if (!user?.isMywaFamilyMember) return <NonMemberView />;

  const firstName = user?.fullName?.firstName || user?.userName || "Student";

  return (
    <div className="w-full min-h-screen text-white p-4 md:p-8 pb-24 overflow-y-auto">
      {/* helmet */}
      <Helmet>
        <title>Student DashBoard | MYWA</title>
      </Helmet>
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
          {user.isLibraryMember ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] font-bold">
              ✅ Library Member
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-lime-500/10 border border-lime-500/20 text-lime-400 text-[11px] font-bold">
              🤝 MYWA Family
            </span>
          )}
        </motion.div>
      </div>

      {/* ── LOADING ── */}
      {isLoading ? (
        <StudentSkeleton />
      ) : (
        <div className="flex flex-col gap-5">
          {user.isLibraryMember ? (
            <>
              <StudentStats stats={stats} />
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
                {/* LEFT COLUMN */}
                <div className="flex flex-col gap-5">
                  <RecentActivity records={stats.recentAttendance} />
                  <IssuedBooks issuedBooks={issuedBooks} />
                </div>

                {/* RIGHT COLUMN */}
                <DashboardSidebar
                  notices={notices}
                  achievements={achievements}
                  tickets={tickets}
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
                <div className="flex flex-col gap-5">
                  <ReactivateLibraryCard />
                </div>
                <DashboardSidebar
                  notices={notices}
                  achievements={achievements}
                  tickets={tickets}
                />
              </div>
            </>
          )}
          {/* Stats */}

          {/* Main layout */}
        </div>
      )}
    </div>
  );
};

export default StudentOverview;
