import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import {
  Bell,
  BookOpen,
  ChartColumnIncreasing,
  ChartNoAxesCombined,
  LayoutDashboard,
  NotebookIcon,
  Settings,
  ShieldAlert,
  Trophy,
  Users,
  UserStar,
} from "lucide-react";

// ─────────────────────────────────────────
//  SYNC IMPORTS (Layouts & Core Components - Do NOT lazy load these)
// ─────────────────────────────────────────
import ProtectedRoute from "./ProtectedRoute";
import PublicLayout from "../components/PublicLayout";
import DashboardLayout from "../pages/DashboardLayout";
import ScrollTop from "../animation/ScrollTop";
const UserProfilePage = lazy(
  () => import("../components/user-details/UserProfilePage"),
);

const ThinkTankDashboard = lazy(
  () => import("../pages/think-tank/ThinkTankDashboard"),
);

// ─────────────────────────────────────────
// 🚀 ASYNC IMPORTS (Lazy Loaded Pages)
// ─────────────────────────────────────────
// Public Pages
const Home = lazy(() => import("../pages/Home"));
const Register = lazy(() => import("../pages/auth/Register"));
const Login = lazy(() => import("../pages/auth/Login"));
const ForgotPassword = lazy(
  () => import("../components/profile-updates/ForgotPassword"),
);
const ResetPassword = lazy(
  () => import("../components/profile-updates/ResetPassword"),
);

// Shared Profile
const Profile = lazy(() => import("../components/profile-updates/Profile"));

// Admin Pages
const DashboardOverview = lazy(
  () => import("../pages/admin/AdminDashboard/DashboardOverview"),
);
const ManageStudent = lazy(
  () => import("../pages/admin/manage-student/ManageStudent"),
);
const LibraryInventory = lazy(
  () => import("../pages/admin/Library-Inventory/LibraryInventory"),
);
const ManageIssues = lazy(
  () => import("../pages/admin/ManageIssues/ManageIssues"),
);
const ManageNoticeBoard = lazy(
  () => import("../pages/admin/ManageNoticeBoard"),
);
const ManageAttendance = lazy(
  () => import("../pages/admin/Attendance/ManageAttendance"),
);
const ManageAchievements = lazy(
  () => import("../pages/admin/ManageAchievements"),
);
const ManageThinkTank = lazy(
  () => import("../pages/admin/ThinkTank/ManageThinkTank"),
);
const ManageStudentIssues = lazy(
  () => import("../pages/admin/ManageStudentIssues"),
);

// Student Pages
const StudentOverview = lazy(() => import("../pages/student/StudentOverview"));
const AttendanceChart = lazy(
  () => import("../pages/attendance/AttendanceChart"),
);
const MyAchievements = lazy(
  () => import("../pages/student/My-Achievements/MyAchievements"),
);
const NoticeBoard = lazy(() => import("../pages/student/NoticeBoard"));
const StudentLibrary = lazy(
  () => import("../pages/student/library/StudentLibrary"),
);
const HelpDesk = lazy(() => import("../pages/student/helpdesk/HelpDesk"));

// ─────────────────────────────────────────
// 💎 PREMIUM LOADER (Fallback UI)
// ─────────────────────────────────────────
const PageLoader = () => (
  <div className="min-h-screen bg-black w-full flex flex-col items-center justify-center ">
    <div className="w-10 h-10 border-4 border-white/5 border-t-teal-500 rounded-full animate-spin"></div>
    <p className="mt-4 text-[11px] font-bold tracking-widest text-slate-500 uppercase animate-pulse">
      Loading Workspace...
    </p>
  </div>
);

// ─────────────────────────────────────────
// MAIN ROUTER
// ─────────────────────────────────────────
const MainRouter = () => {
  // Admin Sidebar
  const adminMenuItems = [
    { name: "Overview", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "Manage Students", icon: Users, path: "/admin/students" },
    {
      name: "Manage Attendance",
      icon: ChartNoAxesCombined,
      path: "/admin/attendance",
    },
    { name: "Library Inventory", icon: BookOpen, path: "/admin/library" },
    { name: "Books issue", icon: BookOpen, path: "/admin/issue" },
    { name: "ManageNoticeBoard", icon: Bell, path: "/admin/noticeboard" },

    { name: "Achievements", icon: Trophy, path: "/admin/achievements" },
    { name: "ManageThinkTank", icon: UserStar, path: "/admin/thinkTank" },
    { name: "Students Issue", icon: ShieldAlert, path: "/admin/studentIssue" },
    { name: "Profile", icon: Settings, path: "/admin/profile" },
  ];

  // Student Sidebar
  const studentMenuItems = [
    { name: "My Dashboard", icon: LayoutDashboard, path: "/student/dashboard" },
    {
      name: "My Attendance-Chart",
      icon: ChartColumnIncreasing,
      path: "/student/attendance",
    },
    { name: "My Achievement", icon: Trophy, path: "/student/achievement" },
    { name: "Notice Board", icon: NotebookIcon, path: "/student/noticeboard" },
    { name: "Library", icon: BookOpen, path: "/student/library" },
    { name: "HelpDesk", icon: ShieldAlert, path: "/student/helpdesk" },
    { name: "Profile", icon: Settings, path: "/student/profile" },
  ];

  // Think-Tank Sidebar
  const thinkTankMenuItems = [
    {
      name: "My Dashboard",
      icon: LayoutDashboard,
      path: "/thinkTank/dashboard",
    },
    { name: "Profile", icon: Settings, path: "/thinkTank/profile" },
  ];

  return (
    <>
      <ScrollTop />
      {/* 🟢 SUSPENSE WRAPPER ADDED HERE */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Route>

          {/* Admin Dashboard */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DashboardLayout menuItems={adminMenuItems} />
              </ProtectedRoute>
            }>
            <Route path="/admin/dashboard" element={<DashboardOverview />} />
            <Route path="/admin/students" element={<ManageStudent />} />
            <Route path="/admin/noticeboard" element={<ManageNoticeBoard />} />
            <Route path="/admin/library" element={<LibraryInventory />} />
            <Route path="/admin/issue" element={<ManageIssues />} />
            <Route path="/admin/attendance" element={<ManageAttendance />} />
            <Route
              path="/admin/achievements"
              element={<ManageAchievements />}
            />
            <Route path="/admin/thinkTank" element={<ManageThinkTank />} />
            <Route
              path="/admin/studentIssue"
              element={<ManageStudentIssues />}
            />
            <Route path="/admin/profile" element={<Profile />} />
            <Route
              path="/admin/user-profile/:id"
              element={<UserProfilePage />}
            />
          </Route>

          {/* Student Dashboard */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <DashboardLayout menuItems={studentMenuItems} />
              </ProtectedRoute>
            }>
            <Route path="/student/dashboard" element={<StudentOverview />} />
            <Route path="/student/attendance" element={<AttendanceChart />} />
            <Route path="/student/achievement" element={<MyAchievements />} />
            <Route path="/student/noticeboard" element={<NoticeBoard />} />
            <Route path="/student/library" element={<StudentLibrary />} />
            <Route path="/student/helpdesk" element={<HelpDesk />} />
            <Route path="/student/profile" element={<Profile />} />
          </Route>

          {/* Think-Tank Dashboard */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["thinkTank"]}>
                <DashboardLayout menuItems={thinkTankMenuItems} />
              </ProtectedRoute>
            }>
            <Route
              path="/thinkTank/dashboard"
              element={<ThinkTankDashboard />}
            />
            <Route path="/thinkTank/profile" element={<Profile />} />
            <Route
              path="/thinkTank/user-profile/:id"
              element={<UserProfilePage />}
            />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

export default MainRouter;
