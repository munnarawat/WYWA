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
} from "lucide-react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../store/slice/authSlice";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const socket = io("http://localhost:3000", {
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
  // notification state
  const [notifications, setNotifications] = useState([]);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // socket io
  useEffect(() => {
    if (!user?._id) return;

    const setupRooms = () => {
      // console.log("✅ Socket Connected! Joining rooms...");
      socket.emit("join_user_room", user._id);

      if (user.branch) {
        const cleanBranch = user.branch.trim().toLowerCase();
        // console.log(`✅ Joining Branch: '${cleanBranch}'`);
        socket.emit("join_branch", cleanBranch);
      }
    };
    if (socket.connected) {
      setupRooms();
    }
    socket.on("connect", setupRooms);

    const handleNotification = (data) => {
      // 🟢 Yeh log aana sabse zaroori hai!
      console.log("🚀 BINGO! Notification Received:", data);

      toast.success(data.message, {
        icon: "🔥",
        duration: 6000,
        style: {
          borderRadius: "10px",
          background: "#18181b",
          color: "#fff",
          border: "1px solid #14b8a6",
        },
      });

      const newNotify = {
        id: Date.now(),
        title: data.title || "Notification",
        message: data.message,
        time: new Date(),
      };

      setNotifications((prev) => [newNotify, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("receive_notification", handleNotification);

    return () => {
      socket.off("connect", setupRooms);
      socket.off("receive_notification", handleNotification);
    };
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

      if (!event.target.closest(".notify-dropdown")) {
        setIsNotifyOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleLogout = () => {
    dispatch(clearUser());
    navigate("/login");
  };

  return (
    <div className="flex  h-screen bg-zinc-950 text-white overflow-hidden font-sans">
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
        className="fixed lg:static top-0 left-0 h-full w-64 bg-zinc-950/80 backdrop-blur-2xl border-r border-white/10 z-50 flex flex-col">
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
            onClick={handleLogout}
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
            <div className=" relative notify-dropdown">
              <button
                onClick={() => {
                  setIsNotifyOpen(!isNotifyOpen);
                  if (!isNotifyOpen) setUnreadCount(0);
                }}
                className="relative text-zinc-400 hover:text-white p-2 transition-colors">
                <Bell size={20} />
                {/* Unread Badge */}
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white border-2 border-zinc-950 animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>
              {/* Notification Dropdown */}
              <AnimatePresence>
                {isNotifyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="fixed mono top-20 left-4 right-4 sm:absolute sm:top-14 sm:left-auto sm:right-0 sm:w-88 bg-zinc-900/95 border border-white/10 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] backdrop-blur-3xl overflow-hidden ring-1 ring-white/5 z-50 origin-top sm:origin-top-right">
                    {/* 🟢 Dropdown Header (Sleek Look) */}
                    <div className="px-5 py-4 border-b border-white/10 bg-zinc-950/50 flex justify-between items-center backdrop-blur-xl">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2.5">
                        <div className="p-1.5 bg-teal-500/20 rounded-lg">
                          <Bell size={14} className="text-teal-400" />
                        </div>
                        Notifications
                        {notifications.length > 0 && (
                          <span className="bg-white/10 text-zinc-300 text-[10px] px-2 py-0.5 rounded-full font-mono">
                            {notifications.length}
                          </span>
                        )}
                      </h3>
                      {notifications.length > 0 && (
                        <button
                          onClick={() => {
                            setNotifications([]);
                            setUnreadCount(0);
                          }}
                          className="text-xs font-medium text-zinc-500 hover:text-rose-400 transition-colors">
                          Clear All
                        </button>
                      )}
                    </div>

                    {/* 🟢 Notification List */}
                    <div className="max-h-[60vh] sm:max-h-88 overflow-y-auto custom-scrollbar p-2">
                      {notifications.length === 0 ? (
                        // 🌟 Premium Empty State
                        <div className="py-12 px-6 text-center flex flex-col items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/5 shadow-inner">
                            <Bell size={24} className="text-zinc-600" />
                          </div>
                          <p className="text-sm font-medium text-zinc-300">
                            You're all caught up!
                          </p>
                          <p className="text-xs text-zinc-500 mt-1">
                            No new announcements right now.
                          </p>
                        </div>
                      ) : (
                        // 🌟 Premium Notification Cards
                        <div className="space-y-1">
                          {notifications.map((notify, index) => (
                            <div
                              key={notify.id}
                              className="group relative p-4 bg-transparent hover:bg-white/4 rounded-xl transition-all duration-200 cursor-pointer flex gap-3.5">
                              {/* Icon Indicator */}
                              <div className="shrink-0 mt-0.5">
                                <div className="w-8 h-8 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-teal-500/20 transition-all duration-300">
                                  {notify.title.includes("Announcement") ||
                                  notify.title.includes("Notice") ? (
                                    <span className="text-sm">📢</span>
                                  ) : notify.title.includes("Streak") ? (
                                    <span className="text-sm">🔥</span>
                                  ) : (
                                    <Bell size={14} className="text-teal-400" />
                                  )}
                                </div>
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-2 mb-1">
                                  <h4 className="text-sm font-bold text-zinc-100 truncate pr-2 group-hover:text-teal-400 transition-colors">
                                    {notify.title}
                                  </h4>
                                  <p className="shrink-0 text-[10px] font-medium text-zinc-500 mt-0.5 whitespace-nowrap">
                                    {notify.time.toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                </div>
                                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                                  {notify.message}
                                </p>
                              </div>
                              {index < unreadCount && (
                                <div className="absolute top-1/2 -translate-y-1/2 left-1 w-1.5 h-1.5 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 🟢 Optional Footer (View All) */}
                    {notifications.length > 5 && (
                      <div className="p-2 border-t border-white/10 bg-zinc-950/30">
                        <button className="w-full py-2 text-xs font-medium text-teal-400 hover:text-teal-300 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                          View all history
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex action-dropdown relative items-center gap-3 pl-4 md:pl-6 border-l border-white/10 cursor-pointer">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-white capitalize">
                  {user?.userName || "User"}
                </p>
                <p className="text-xs text-zinc-500 capitalize">
                  {user?.role || "Member"}
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-teal-500 to-lime-500 p-0.5">
                <img
                  src="https://i.pravatar.cc/150"
                  alt="Avatar"
                  className="w-full h-full rounded-full border-2 border-zinc-950 object-cover"
                />
              </div>
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
                        to="/profile"
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition">
                        <User size={16} className="text-emerald-400" />
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
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
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
