import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Bell, Search, ChevronDown, LogOut } from "lucide-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../store/slice/authSlice";

const DashboardLayout = ({ menuItems }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) setIsSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    dispatch(clearUser());
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden font-sans">
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                  ${
                    isActive
                      ? "bg-linear-to-r from-teal-500/10 to-transparent text-teal-400 border-l-2 border-teal-400"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent"
                  }
                `}>
                <item.icon
                  size={20}
                  className={
                    isActive
                      ? "text-teal-400"
                      : "text-zinc-500 group-hover:text-white"
                  }
                />
                <span className="font-medium">{item.name}</span>
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
        <header className="h-20 flex items-center justify-between px-4 lg:px-8 border-b border-white/10 bg-zinc-950/50 backdrop-blur-md z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-zinc-400 hover:text-white p-2">
              <Menu size={24} />
            </button>
            {/* Search Bar... */}
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <button className="relative text-zinc-400 hover:text-white p-2">
              <Bell size={20} />
            </button>
            <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-white/10 cursor-pointer">
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
