import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User,
  Home,
  AppleIcon,
} from "lucide-react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../store/slice/authSlice";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import NotificationDropdown from "./notification/NotificationDropdown";
import { Helmet } from "react-helmet-async";
import api from "../utils/api";
const socket = io(import.meta.env.VITE_MYWA_API_URL.replace("/api",""), {
  withCredentials: true,
});

const DashboardLayout = ({ menuItems }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user?._id) return;

    const setupRooms = () => {
      socket.emit("join_user_room", user._id);
      if (user.branch) {
        socket.emit("join_branch", user.branch.trim().toLowerCase());
      }
    };

    if (socket.connected) setupRooms();
    socket.on("connect", setupRooms);

    return () => socket.off("connect", setupRooms);
  }, [user]);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) setIsSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // dropDown hide functionality
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".action-dropdown")) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleLogOut = async () => {
    try {
      await api.post("/auth/logout");
      toast.success("logout successful");
    } catch (error) {
      console.error("logout failed", error);
    } finally {
      dispatch(clearUser());
      navigate("/login", { replace: true });
      setIsProfileOpen(false);
    }
  };

  return (
    <div className="flex  h-screen bg-zinc-950 text-white overflow-hidden">
      <Helmet>
        <title>
          {user?.role ? `${user.role} Dashboard | MYWA` : "MYWA Dashboard"}
        </title>
      </Helmet>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>
      <motion.aside
        initial={false}
        animate={{ x: isDesktop ? 0 : isSidebarOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed lg:static top-0 left-0 h-full lg:w-64 bg-zinc-950/80 backdrop-blur-2xl border-r border-white/10 z-50 flex flex-col">
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
          <div className="text-2xl font-bold tracking-tight">
            <img
              fetchPriority="high"
              className="w-32 object-contain"
              src="https://ik.imagekit.io/fmkamttxp/MYWA/logo.png"
              alt="logo"
            />
            <span className="text-[10px] font-mono text-zinc-500 block uppercase tracking-widest mt-0.5">
              {user?.role === "admin" ? "Admin Panel" : "Student Panel"}
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-zinc-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path); // React Router se navigate
                  if (!isDesktop) setIsSidebarOpen(false);
                }}
                className={`w-full  flex items-center  gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                  ${
                    isActive
                      ? "bg-linear-to-r from-teal-500/10 to-transparent text-teal-400 border-l-2 border-teal-400"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent"
                  }
                `}>
                <item.icon
                  size={20}
                  className={` shrink-0
                    ${
                      isActive
                        ? "text-teal-400  "
                        : "text-zinc-500 group-hover:text-white"
                    }
                  `}
                />
                <span className="font-medium truncate">{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => handleLogOut()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors group">
            <LogOut size={20} className="group-hover:text-rose-400" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* 🟢 MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-500/5 blur-[150px] rounded-full pointer-events-none -z-10" />

        {/* TOP HEADER */}
        <header className="h-20 flex items-center justify-between px-4 lg:px-8 border-b border-white/10 bg-zinc-950/50  backdrop-blur-md z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-zinc-400 hover:text-white p-2">
              <Menu size={24} />
            </button>
            {/* Search Bar... */}
            {/* Branch */}
            <div className="flex flex-col  items-center ">
              <p className="text-sm font-medium text-zinc-400">Branch </p>
              <h1 className=" heading text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-teal-600 to-lime-600">
                {user?.branch || "Branch"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <NotificationDropdown socket={socket} />
            <div
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex action-dropdown relative items-center gap-3 pl-4 md:pl-6 border-l border-white/10 cursor-pointer">
              {user?.profile?.personal?.imageUrl ? (
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={user?.profile?.personal?.imageUrl}
                    alt={`${user?.userName}'s avatar`}
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-linear-to-tr from-teal-500 to-lime-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                  {user?.userName?.[0]?.toUpperCase()}
                </div>
              )}

              <ChevronDown
                size={14}
                className={`text-gray-400 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`}
              />
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className=" absolute right-0 top-15 w-56 bg-[#0a0a0c] border border-white/10 rounded-xl shadow-2xl backdrop-blur-3xl overflow-hidden ring-1 ring-white/5">
                    <div className="px-4 py-4 border-b border-white/5 bg-white/5">
                      <p className="text-sm text-white font-medium truncate">
                        {user?.userName}
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {user?.email}
                      </p>
                    </div>
                    <div className="p-1">
                      <Link
                        to="/"
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition">
                        <Home size={16} className="text-emerald-400" />
                        Home
                      </Link>
                      <Link
                        to={
                          user.role === "admin"
                            ? "/admin/profile"
                            : "/student/profile"
                        }
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition">
                        <User size={16} className="text-emerald-400" />
                        My Profile
                      </Link>
                      <button
                        onClick={() => handleLogOut()}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition text-left">
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* main content */}
        <main
          id="dashboard-scroll-container"
          className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
