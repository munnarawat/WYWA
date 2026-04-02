import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Menu, Mountain, User, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../utils/api";
import { clearUser } from "../../store/slice/authSlice";
import toast from "react-hot-toast";
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { isAuthenticate, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  // public navLink
  const NavLinks = [
    { title: "Home", path: "/" },
    { title: "About", path: "/about" },
    { title: "Achievements", path: "/achievements" },
    { title: "Contact", path: "/contact" },
  ];
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //  close menu on routes change
  useEffect(() => {
    setIsProfileOpen(false);
    setIsMobileOpen(false);
  }, [location]);

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
  // logOut function
  const handleLogOut = async () => {
    try {
      await api.post("/auth/logout");
      toast.success("logout successful");
    } catch (error) {
      console.error("logout failed", error);
    } finally {
      dispatch(clearUser());
      navigate("/login");
      setIsProfileOpen(false);
    }
  };
  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed w-full left-0 z-99 text-white top-0    transition-all duration-300 ${
          isScrolled
            ? "bg-[rgba(255, 255, 255, 0.24)]  backdrop-blur-sm border-b border-white/10 shadow-lg py-3"
            : "bg-transparent py-4 md:py-6"
        }`}>
        {/* desktop nav-bar*/}
        <div className="max-w-7xl  px-4 sm:px-6  lg:px-8 flex items-center justify-between ">
          {/* logo-section */}
          <div className="flex items-center  ">
            <Link to="/" className="flex items-center gap-2 z-50">
              <div className=" transition-all">
                <img
                  fetchPriority="high"
                  className="w-40"
                  src="https://ik.imagekit.io/fmkamttxp/MYWA/logo.png"
                  alt="logo"
                />
              </div>
            </Link>
          </div>
          {/* links */}
          <div className="rounded-lg bg-linear-to-l from-white/30 via-transparent  to-white/30 p-[.5px]">
            <div className="hidden py-4 rounded-lg px-8 md:flex gap-10 bg-linear-to-b from-[#0000009d] to-[#0000007c] tracking-wide  lg:text-[1.12rem] text-white/70">
              {NavLinks.map((item, index) => (
                <Link
                  to={item.path}
                  key={index}
                  className={`relative group h-5 text-sm font-medium overflow-hidden text-gray-300/80 hover:text-white transition-colors ${location.pathname == item.path ? "text-white" : "text-gray-300/80"}`}>
                  <motion.div
                    className="flex flex-col"
                    initial={{ y: 0 }}
                    whileHover={{ y: "-50%" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}>
                    <motion.h2 className=" flex items-center">
                      {item.title}
                    </motion.h2>
                    <motion.h2 className=" text-emerald-500 flex items-center">
                      {item.title}
                    </motion.h2>
                  </motion.div>
                </Link>
              ))}
              {isAuthenticate && (
                <Link
                  to={
                    user?.role === "admin"
                      ? "/admin/dashboard"
                      : user?.role === "thinkTank"
                        ? "/thinkTank/dashboard"
                        : "/student/dashboard"
                  }
                  className={`relative group h-5 text-sm font-medium overflow-hidden text-gray-300/80 hover:text-white transition-colors ${location.pathname.includes("dashboard") ? "text-white" : "text-gray-300/80"}`}>
                  <motion.div
                    className="flex flex-col"
                    initial={{ y: 0 }}
                    whileHover={{ y: "-50%" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}>
                    <motion.h2 className=" flex items-center">
                      Dashboard
                    </motion.h2>
                    <motion.h2 className=" text-emerald-500 flex items-center">
                      Dashboard
                    </motion.h2>
                  </motion.div>
                </Link>
              )}
            </div>
          </div>
          {/* auth-  profile and login-register */}
          <div className="hidden  md:flex items-center gap-4">
            {!isAuthenticate ? (
              <>
                <Link
                  to="/login"
                  className=" text-gray-300/80 hover:text-white transition ">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-semibold hover:bg-teal-700/60 bg-teal-700   rounded-full transition-all shadow-lg shadow-white/10 hover:shadow-teal-700/40 ">
                  Register
                </Link>
              </>
            ) : (
              // profile when user login
              <div className=" relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex action-dropdown items-center gap-2 p-1 pr-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition">
                  <div className="w-8 h-8 rounded-full bg-linear-to-tr from-teal-500 to-lime-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                    {user?.userName?.[0]?.toUpperCase()}
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-gray-400 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            )}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-5 mt-56 w-56 bg-[#0a0a0c] border border-white/10 rounded-xl shadow-2xl backdrop-blur-3xl overflow-hidden ring-1 ring-white/5">
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
                      to={
                        user.role === "admin"
                          ? "/admin/profile"
                          : user.role == "thinkTank"
                            ? "/thinkTank/profile"
                            : "/student/profile"
                      }
                      className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition">
                      <User size={16} className="text-emerald-400" /> My Profile
                    </Link>
                    <button
                      onClick={handleLogOut}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition text-left">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* mobile toggle button*/}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition">
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* mobile view  */}
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
                <div className="w-12 h-12 rounded-full bg-linear-to-tr from-teal-500 to-lime-500 flex items-center justify-center text-lg font-bold text-white shadow-lg">
                  {user?.userName?.[0]?.toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-white font-bold truncate">
                    {user?.userName}
                  </h3>
                  <p className="text-white/50 text-sm truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            )}

            {/* links without login */}
            <div className=" flex flex-col gap-4 items-center ">
              {NavLinks.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`relative text-3xl h-8  group  font-medium overflow-hidden text-gray-300/80 hover:text-white transition-colors ${location.pathname == item.path ? "text-white" : "text-gray-300/80"}`}>
                  <motion.div
                    initial={{ y: 0 }}
                    whileHover={{ y: "-50%" }}
                    className="flex flex-col ">
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
                  className={`relative text-3xl h-8  group  font-medium overflow-hidden text-gray-300/80 hover:text-white transition-colors ${location.pathname.includes("dashboard") ? "text-white" : "text-gray-300/80"}`}>
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
    </>
  );
};

export default Navbar;
