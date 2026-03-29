import React from "react";
import { motion } from "framer-motion";

const DayDot = ({ day, isPresent, isToday }) => (
  <motion.div
    whileHover={{ y: -4 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="flex flex-col items-center gap-1.5 flex-1 min-w-[36px]">
    <div
      className={`w-full h-9 rounded-[10px] flex items-center justify-center
        text-[10px] font-extrabold tracking-wider uppercase border transition-all
        ${
          isPresent
            ? "bg-emerald-400/10 border-emerald-400/25 text-emerald-400"
            : "bg-rose-400/8 border-rose-400/20 text-rose-400"
        }
        ${isToday ? "ring-1 ring-teal-400/40 shadow-[0_0_12px_rgba(20,184,166,0.25)]" : ""}
      `}>
      {isPresent ? "P" : "A"}
    </div>
    <span
      className={`text-[9px] font-semibold ${isToday ? "text-teal-400" : "text-slate-600"}`}>
      {day}
    </span>
  </motion.div>
);

export default DayDot;