import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, UserCheck, UserX } from "lucide-react";

const StudentStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Percentage Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute -right-6 -top-6 text-white/5"><TrendingUp size={100} /></div>
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-teal-500/20 text-teal-400 rounded-xl"><TrendingUp size={24} /></div>
          <h3 className="text-zinc-400 font-medium">Monthly %</h3>
        </div>
        <p className="text-4xl font-bold text-white">{stats.percentage}%</p>
        <div className="w-full bg-white/10 h-2 rounded-full mt-4">
          <div className="bg-teal-400 h-2 rounded-full" style={{ width: `${stats.percentage}%` }} />
        </div>
      </motion.div>

      {/* Present Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl"><UserCheck size={24} /></div>
          <h3 className="text-zinc-400 font-medium">Present</h3>
        </div>
        <p className="text-4xl font-bold text-emerald-400">{stats.totalPresent}</p>
        <p className="text-sm text-zinc-500 mt-2">Days this month</p>
      </motion.div>

      {/* Absent Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl"><UserX size={24} /></div>
          <h3 className="text-zinc-400 font-medium">Absent</h3>
        </div>
        <p className="text-4xl font-bold text-rose-400">{stats.totalAbsent}</p>
        <p className="text-sm text-zinc-500 mt-2">Try to minimize this</p>
      </motion.div>
    </div>
  );
};

export default StudentStats;