import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { User } from "lucide-react";
import { meshStyle } from "./shared/helpers";

import ProfileHeader from "./ProfileHeader";
import QuickStatsRow from "./QuickStatsRow";
import ProfileTabs from "./ProfileTabs";
import OverviewTab from "./OverviewTab";
import AttendanceTab from "./AttendanceTab";
import LibraryTab from "./LibraryTab";

// ─────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────
const ProfileSkeleton = () => (
  <div className="animate-pulse flex flex-col gap-5 max-w-[860px] mx-auto p-4">
    <div className="h-40 rounded-[22px] bg-white/4" />
    <div className="grid grid-cols-3 gap-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-20 rounded-2xl bg-white/4" />
      ))}
    </div>
    <div className="h-12 w-72 rounded-2xl bg-white/4" />
    <div className="h-80 rounded-[20px] bg-white/4" />
  </div>
);

// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────
const UserProfile360 = ({ profileData, isLoading }) => {
  const [activeTab, setActiveTab] = useState("overview");

  
  if (isLoading) return <ProfileSkeleton />;

  if (!profileData?.personalDetails) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
        <User size={40} className="opacity-40" />
        <p className="text-[15px]">User data not found or access denied.</p>
      </div>
    );
  }

  const { personalDetails, attendanceStats, libraryStats, staffStats } =
    profileData;
  const isStudent = personalDetails.role === "student";

  // Build tabs dynamically
  const TABS = [
    { id: "overview", label: "Overview", emoji: "👤" },
    ...(isStudent && attendanceStats
      ? [{ id: "attendance", label: "Attendance", emoji: "📊" }]
      : []),
    ...(isStudent && libraryStats
      ? [{ id: "library", label: "Library", emoji: "📚" }]
      : []),
  ];

  return (
    <div className="w-full mx-auto p-4 md:p-6 flex flex-col gap-5">
      {/* Header */}
      <ProfileHeader personalDetails={personalDetails} />

      {/* Quick stats — only for students */}
      {isStudent && attendanceStats && (
        <QuickStatsRow
          attendanceStats={attendanceStats}
          libraryStats={libraryStats}
        />
      )}

      {/* Tabs */}
      <ProfileTabs
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Content card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative rounded-[20px] p-px"
        style={{
          background:
            "linear-gradient(135deg, rgba(20,184,166,0.2), rgba(255,255,255,0.04), rgba(132,204,22,0.08))",
        }}>
        <div className="bg-[#0d1117] rounded-[19px] p-6 sm:p-8 relative overflow-hidden">
          <div
            className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none rounded-br-[19px]"
            style={meshStyle()}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}>
              {activeTab === "overview" && (
                <OverviewTab
                  personalDetails={personalDetails}
                  staffStats={staffStats}
                />
              )}
              {activeTab === "attendance" && attendanceStats && (
                <AttendanceTab attendanceStats={attendanceStats} />
              )}
              {activeTab === "library" && libraryStats && (
                <LibraryTab libraryStats={libraryStats} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile360;
