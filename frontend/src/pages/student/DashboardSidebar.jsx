import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const BADGE_ICONS = {
  first_step: { icon: "⭐", style: "bg-amber-400/10 border-amber-400/20" },
  "7_days": { icon: "🔥", style: "bg-rose-400/10 border-rose-400/20" },
  "15_days": { icon: "👑", style: "bg-violet-400/10 border-violet-400/20" },
  monthly_champ: { icon: "🏆", style: "bg-teal-400/10 border-teal-400/20" },
};

const DashboardSidebar = ({
  notices = [],
  achievements = [],
  tickets = [],
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      {/* ── REPORT BUTTON ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.18,
          type: "spring",
          stiffness: 280,
        }}
        className=" relative rounded-[20px] p-px"
        style={{
          background:
            "linear-gradient(135deg, rgba(20,184,166,0.28), rgba(255,255,255,0.05), rgba(132,204,22,0.15))",
        }}>
        <div className="bg-[#0d1117] rounded-[19px] p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-slate-100 flex items-center gap-2">
              🎫 Support Tickets
            </h3>
            {tickets.length > 0 && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-white/5 text-slate-500">
                {tickets.length} open tickets
              </span>
            )}
          </div>
          {/* tickets  */}
          {tickets.length === 0 ? (
            <p className="text-slate-600 text-sm py-3">no open tickets</p>
          ) : (
            <div className="space-y-2">
              {tickets.map((ticket, i) => (
                <motion.div
                  key={ticket._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                  whileHover={{ x: 4 }}
                  onClick={() => navigate("/student/helpdesk")}
                  className="flex items-start gap-3 p-3 rounded-[13px] border border-white/5 bg-white/2 hover:bg-teal-500/5 hover:border-teal-500/20 transition-all cursor-pointer">
                  <span className="w-2 h-2 rounded-full bg-teal-400/40 border border-teal-400/60 shrink-0 mt-1.25" />
                  <div>
                    <p className="text-[12px] font-semibold text-slate-200 leading-snug mb-1">
                      {ticket.title}
                    </p>
                    <p className="text-[10px] text-slate-600">
                      {new Date(
                        ticket.issuedAt || ticket.createdAt,
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* ── NOTICE BOARD ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, type: "spring", stiffness: 280 }}
        className="relative rounded-[20px] p-px"
        style={{
          background:
            "linear-gradient(135deg, rgba(20,184,166,0.28), rgba(255,255,255,0.05), rgba(132,204,22,0.15))",
        }}>
        <div className="bg-[#0d1117] rounded-[19px] p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-slate-100 flex items-center gap-2">
              🔔 Notice Board
            </h3>
            {notices.length > 0 && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-white/5 text-slate-500">
                {notices.length} New
              </span>
            )}
          </div>

          {/* Notice items */}
          {notices.length === 0 ? (
            <p className="text-slate-600 text-sm py-3">No new notices.</p>
          ) : (
            <div className="space-y-2">
              {notices.map((notice, i) => (
                <motion.div
                  key={notice._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                  whileHover={{ x: 4 }}
                  onClick={() => navigate("/student/noticeboard")}
                  className="flex items-start gap-3 p-3 rounded-[13px] border border-white/5 bg-white/2 hover:bg-teal-500/5 hover:border-teal-500/20 transition-all cursor-pointer">
                  <span className="w-2 h-2 rounded-full bg-teal-400/40 border border-teal-400/60 shrink-0 mt-1.25" />
                  <div>
                    <p className="text-[12px] font-semibold text-slate-200 leading-snug mb-1">
                      {notice.title}
                    </p>
                    <p className="text-[10px] text-slate-600">
                      {new Date(
                        notice.issuedAt || notice.createdAt,
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* ── ACHIEVEMENTS ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.26, type: "spring", stiffness: 280 }}
        className="relative rounded-[20px] p-px"
        style={{
          background:
            "linear-gradient(135deg, rgba(20,184,166,0.28), rgba(255,255,255,0.05), rgba(132,204,22,0.15))",
        }}>
        <div className="bg-[#0d1117] rounded-[19px] p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-slate-100 flex items-center gap-2">
              ⚡ Achievements
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-teal-400/8 border border-teal-400/20 text-teal-400">
              {achievements.length} / 4
            </span>
          </div>

          {achievements.length === 0 ? (
            <p className="text-slate-600 text-sm py-3">
              Keep studying to earn badges! 📚
            </p>
          ) : (
            <div className="space-y-2">
              {achievements.map((badge, i) => {
                const badgeMeta = BADGE_ICONS[badge.badgeId] || {
                  icon: "🏅",
                  style: "bg-white/5 border-white/10",
                };
                return (
                  <motion.div
                    key={badge._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.28 + i * 0.06 }}
                    whileHover={{ x: 4 }}
                    onClick={() => navigate("/student/achievement")}
                    className="flex items-center cursor-pointer gap-3 p-3 rounded-[13px] bg-teal-500/4 border border-teal-500/15 transition-all">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 border ${badgeMeta.style}`}>
                      {badgeMeta.icon}
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-slate-200">
                        {badge.title}
                      </p>
                      <p className="text-[10px] text-slate-600">
                        {badge.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>

      {/* ── MODAL ── */}
    </div>
  );
};

export default DashboardSidebar;
