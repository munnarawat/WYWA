import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Trophy, HelpCircle } from "lucide-react";
import ReportIssueModal from "./ReportIssueModal";

const DashboardSidebar = ({ notices, achievements }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="space-y-8">
      {/* Help Desk Action */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}>
        <button onClick={()=>setIsModalOpen(true)} className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white p-4 rounded-2xl transition-all font-semibold">
          <HelpCircle size={20} className="text-rose-400" /> Report an Issue
        </button>
      </motion.div>

      {/* Notice Board */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Bell size={18} className="text-amber-400" /> Notice Board
        </h3>
        <div className="space-y-3">
          {notices.length === 0 ? (
            <p className="text-zinc-500 text-sm">No new notices.</p>
          ) : (
            notices.map((notice) => (
              <div
                key={notice._id}
                className="p-3 bg-black/40 rounded-lg border border-white/5">
                <p className="text-sm font-medium text-zinc-200">
                  {notice.title}
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  {new Date(
                    notice.issuedAt || notice.createdAt,
                  ).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Trophy size={18} className="text-lime-400" /> My Achievements
        </h3>
        <div className="space-y-3">
          {achievements.length === 0 ? (
            <p className="text-zinc-500 text-sm">
              Keep studying to earn badges!
            </p>
          ) : (
            achievements.map((badge) => (
              <div
                key={badge._id}
                className="flex items-start gap-3 p-3 bg-black/40 rounded-lg border border-white/5">
                <div className="p-2 bg-lime-500/10 text-lime-400 rounded-md">
                  <Trophy size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-200">
                    {badge.title}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">{badge.desc}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
      {/*  MODAL COMPONENT (Hidden by default) */}
      <ReportIssueModal isOpen={isModalOpen}  onClose={()=>setIsModalOpen(false)}/>
    </div>
  );
};

export default DashboardSidebar;
