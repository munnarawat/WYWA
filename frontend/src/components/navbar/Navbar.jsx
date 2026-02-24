import { motion } from "motion/react";
import React, { useEffect, useState } from "react";
import logo from "../../../public/image/logo.png";
import { Link } from "react-router-dom";
import { Mountain } from "lucide-react";
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const NavLinks = [
    { title: "Home", path: "/" },
    { title: "About", path: "/" },
    { title: "Contact", path: "/" },
    { title: "Achievements", path: "/" },
  ];
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full left-0 z-99  text-white top-0    transition-all duration-300 ${
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
              <img className="w-40" src={logo} alt="" />
            </div>
          </Link>
        </div>

        {/* links */}
        <div className="rounded-lg bg-linear-to-l from-white/30 via-transparent  to-white/30 p-[.5px]">
          <div className="hidden py-4 rounded-lg px-8 md:flex gap-10 bg-linear-to-b from-[#171212] to-[#100B0B] tracking-wide  lg:text-[1.12rem] text-white/70">
            {NavLinks.map((item, index) => (
              <Link
                to={item.path}
                key={index}
                className="relative group text-sm font-medium overflow-hidden text-gray-300/60 hover:text-white transition-colors">
                <motion.div whileHover={{y:-30}} transition={{duration:0.5}} className=" ">
                 <h1>{item.title}</h1>
                 
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* profile and login-register */}
        <div className=""></div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
