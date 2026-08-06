import { AnimatePresence, motion } from "framer-motion";
import { LogOut, User } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const MobileNav = ({ isMobileOpen, NavLinks, handleLogOut, setIsMobileOpen }) => {
  const { isAuthenticate, user } = useSelector((state) => state.auth);
  const path = location.pathname;
  return (
    <AnimatePresence>
      {isMobileOpen && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ damping: 25, type: "spring", stiffness: 200 }}
          className="fixed  z-50 inset-0 w-full  min-h-screen bg-black/95 backdrop-blur-xl md:hidden pt-24 px-6 flex-col">
          {/* when user login- email and userName show */}
          {isAuthenticate && user && (
            <div className="flex items-center justify-center gap-4 bg-white/5 border border-white/10 p-4 rounded-xl mb-8">
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
              <div className="overflow-hidden">
                <h3 className="text-white font-bold truncate">
                  {user?.userName}
                </h3>
                <p className="text-white/50 text-sm truncate">{user?.email}</p>
              </div>
            </div>
          )}

          {/* links without login */}
          <div className=" flex flex-col gap-4 items-center ">
            {NavLinks.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`relative text-3xl h-8  group  font-medium overflow-hidden text-gray-300/80 hover:text-white transition-colors ${path == item.path ? "text-white" : "text-gray-300/80"}`}>
                <motion.div initial={{ y: 0 }} className="flex flex-col ">
                  <h2 className="flex items-center">{item.title}</h2>
                  <h2 className="flex items-center text-emerald-500">
                    {item.title}
                  </h2>
                </motion.div>
              </Link>
            ))}
            {isAuthenticate && (
              <Link
                to={
                  user.role === "admin"
                    ? "/admin/dashboard"
                    : "/student/dashboard"
                }
                className={`relative text-3xl h-8  group  font-medium overflow-hidden text-gray-300/80 hover:text-white transition-colors ${path.includes("dashboard") ? "text-white" : "text-gray-300/80"}`}>
                <motion.div
                  initial={{ y: 0 }}
                  whileHover={{ y: "-50%" }}
                  className="flex flex-col ">
                  <h2 className="flex items-center">Dashboard</h2>
                  <h2 className="flex items-center text-emerald-500">
                    Dashboard
                  </h2>
                </motion.div>
              </Link>
            )}
          </div>
          {/* line */}
          <div className="h-px bg-white/10 my-4" />

          {!isAuthenticate ? (
            // auth- login logout - register
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/login"
                className="py-3 text-center rounded-xl bg-white/5 text-white hover:bg-white/10 border border-white/10 transition">
                Login
              </Link>
              <Link
                to="/register"
                className="py-3 text-center rounded-xl bg-teal-500 text-white font-bold hover:bg-teal-600 transition">
                Register
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                to={
                  user.role === "admin"
                    ? "/admin/profile"
                    : user.role == "thinkTank"
                      ? "/thinkTank/profile"
                      : "/student/profile"
                }
                onClick={() => setIsMobileOpen(false)}
                className="py-3 w-full rounded-xl bg-white/5 text-white hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 transition">
                <User size={18} /> View Profile
              </Link>
              <button
                onClick={() => handleLogOut()}
                className="py-3 w-full rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white flex items-center justify-center gap-2 transition">
                <LogOut size={18} /> Logout
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;
