import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Trophy,
  Calendar,
  ArrowRight,
  Quote,
  CalendarDays,
} from "lucide-react";
import api from "../../utils/api";
import toast from "react-hot-toast";

// 🪄 Spotlight Hover Effect Component (The Magic Card)
const SpotlightCard = ({ children, className = "" }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 transition-all duration-500 hover:-translate-y-2 hover:border-teal-500/20 group ${className}`}>
      {/* Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(45,212,191,0.15), transparent 40%)`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

// skelton ui
const AchievementSkelton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((item, index) => {
        return (
          <div
            key={index}
            className="relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 transition-all duration-500 group">
            <div className="p-6 h-full bg-white/5 rounded-2xl flex flex-col justify-between animate-pulse">
              <div className="flex justify-between items-start mb-6">
                <div className="relative overflow-hidden rounded-2xl w-20 h-20 bg-slate-800 border border-white/10 shrink-0" />
                <div className=" rounded-3xl bg-slate-800 h-6 w-24" />
              </div>
              <div className="space-y-3 grow">
                <div className="w-1/2 h-6 rounded-lg animate-pulse bg-slate-800" />
                <div className="w-2/6 h-6 rounded-lg animate-pulse bg-slate-800" />
                <div className="w-3/4 h-6 rounded-lg animate-pulse bg-slate-800" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// 🏆 Main Achievement Section
const Achievement = () => {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await api.get("/public/all-achievement");
        if (res.data.success) {
          setAchievements(res.data.achievements);
        }
      } catch (error) {
        console.error("Error fetching achievements:", error);
        toast.error("Failed to load achievements.");
      }
    };
    fetchAchievements();
  }, []);

  return (
    <section className="w-full py-24 px-4 md:px-8  overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16">
          <span className="text-teal-400 font-bold tracking-widest uppercase text-sm bg-teal-500/10 px-4 py-1.5 rounded-full border border-teal-500/20 inline-flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4" /> Wall of Fame
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            Our Top
            <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-blue-500">
              Achievers
            </span>
          </h2>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto text-lg">
            Celebrating the brilliant minds who cracked top exams and placements
            through sheer dedication and hard work.
          </p>
        </motion.div>

        {/* Bento Grid */}
        {achievements.length === 0 ? (
          <AchievementSkelton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {achievements.map((item, index) => {
              return (
                <SpotlightCard key={item._id} className=" col-span-1">
                  <div className="p-6 min-h-85 flex relative flex-col justify-between">
                    {/* Top Section: Photo & Badge */}
                    <div className="flex relative justify-between items-start mb-6">
                      <div className="relative overflow-hidden rounded-2xl w-24 h-24 border border-white/10 group-hover:border-teal-500/30 group-hover:shadow-[0_0_20px_rgba(20,184,166,.2)]  shrink-0">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.studentName}
                            className="w-full h-full object-cover lg:grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-1  transition-all duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-800 flex items-center justify-center uppercase text-2xl font-bold text-slate-500">
                            {item.studentName.charAt(0)}
                          </div>
                        )}
                      </div>
                      {/* year */}
                      <div className=" w-fit bg-black/5 backdrop-blur-md px-6 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5 text-[13px] font-bold text-slate-200">
                        <CalendarDays size={12} className="text-teal-400" />
                        {item.year}
                      </div>
                      {/* 
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border ${
                          item.branch === "dehradun"
                            ? "bg-teal-500/10 text-teal-400 border-teal-500/20"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        }`}>
                        <MapPin className="w-3 h-3" />
                        {item.branch.charAt(0).toUpperCase() +
                          item.branch.slice(1)}
                      </div> */}
                    </div>
                    {/* Bottom Section: Details */}
                    <div className="space-y-3 grow">
                      <div>
                        <p className="inline-flex gap-4 items-center rounded-full border line-clamp-2 leading-none border-teal-500/20 bg-teal-500/10 px-3 py-1 text-sm font-medium mb-4 text-teal-300">
                          {item.examName}
                        </p>
                        <h3 className="text-2xl font-bold text-white mb-1 capitalize leading-tight group-hover:text-teal-300 transition-colors">
                          {item.studentName}
                        </h3>
                        <div className="mt-3 mb-4 h-px w-32 bg-linear-to-r from-teal-400 to-transparent" />
                      </div>
                    </div>
                    {/* Footer */}
                    <div className="mt-auto pt-5  border-t border-white/5 flex items-center justify-between">
                      <span className="text-xs  font-black uppercase tracking-[0.2em] text-slate-500">
                        🏆 Achievement
                      </span>

                      <ArrowRight className="w-4 h-4 text-teal-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    {/* Background Pattern */}
                    <div
                      className="absolute inset-0 opacity-[0.03] pointer-events-none"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                        backgroundSize: "18px 18px",
                      }}
                    />
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Achievement;
