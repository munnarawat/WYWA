import React from "react";
import { Route,  Routes } from "react-router-dom";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import Home from "../pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import PublicLayout from "../components/PublicLayout";
import ScrollTop from "../animation/ScrollTop";
import {
  Bell,
  BookOpen,
  ImageIcon,
  LayoutDashboard,
  Library,
  Settings,
  Users,
} from "lucide-react";
import DashboardLayout from "../pages/DashboardLayout";
import DashboardOverview from "../pages/admin/DashboardOverview";
import StudentOverview from "../pages/student/StudentOverview";
import ManageStudents from "../pages/admin/ManageStudent";
const MainRouter = () => {
  // Admin ke sidebar menus
  const adminMenuItems = [
    { name: "Overview", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "Manage Students", icon: Users, path: "/admin/students" },
    { name: "Library Inventory", icon: BookOpen, path: "/admin/library" },
    { name: "Mange NoticeBoard", icon: Bell, path: "/admin/noticeboard" },
    { name: "Gallery", icon: ImageIcon, path: "/admin/gallery" },
    { name: "Settings", icon: Settings, path: "/admin/settings" },
  ];
  // student sidebar menus
  const studentMenuItems = [
    { name: "My Dashboard", icon: LayoutDashboard, path: "/student/dashboard" },
    { name: "My Books", icon: Library, path: "/student/books" },
    { name: "Profile", icon: Users, path: "/student/profile" },
  ];
  return (
    <>
      <ScrollTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardLayout menuItems={adminMenuItems} />
            </ProtectedRoute>
          }>
          <Route path="/admin/dashboard" element={<DashboardOverview />} />
          <Route path="/admin/students" element={<ManageStudents />} />
        </Route>

        <Route
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <DashboardLayout menuItems={studentMenuItems} />
            </ProtectedRoute>
          }>
          <Route path="/student/dashboard" element={<StudentOverview />} />
          {/* <Route path="/student/books" element={<StudentBooks />} /> */}
        </Route>
      </Routes>
    </>
  );
};

export default MainRouter;
