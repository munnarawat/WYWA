import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ban,
  BookOpen,
  MoreVertical,
  ShieldAlert,
  ShieldCheck,
  UserCog,
  HeartHandshake,
} from "lucide-react";

// ── CONFIGS ──
export const ROLE_CONFIG = {
  admin: {
    label: "Admin",
    icon: ShieldCheck,
    className: "bg-teal-500/[0.08] border-teal-500/20 text-teal-400",
  },
  thinkTank: {
    label: "Think-Tank",
    icon: UserCog,
    className: "bg-lime-500/[0.08] border-lime-500/20 text-lime-400",
  },
  student: {
    label: "Student",
    icon: UserCog,
    className: "bg-white/[0.04] border-white/10 text-slate-500",
  },
};

export const AVATAR_CLASS = {
  admin: "bg-teal-500/15 border-teal-500/30 text-teal-400",
  thinkTank: "bg-lime-500/15 border-lime-500/30 text-lime-400",
  student: "bg-white/[0.06] border-white/[0.12] text-slate-400",
};

// ── PILLS & BADGES ──
export const RolePill = ({ role }) => {
  const conf = ROLE_CONFIG[role] || ROLE_CONFIG.student;
  const Icon = conf.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold tracking-wider uppercase ${conf.className}`}>
      <Icon size={10} /> {conf.label}
    </span>
  );
};

export const StatusPill = ({ isActive }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold tracking-wider uppercase ${isActive ? "bg-emerald-400/8 border-emerald-400/20 text-emerald-400" : "bg-rose-400/8 border-rose-400/20 text-rose-400"}`}>
    <span className="w-1.25 h-1.25 rounded-full bg-current" />
    {isActive ? "Active" : "Blocked"}
  </span>
);

export const LibraryBadge = () => (
  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[5px] bg-emerald-400/10 border border-emerald-400/20 text-[9px] font-extrabold text-emerald-400 tracking-wider uppercase">
    📚 Library
  </span>
);

export const YouBadge = () => (
  <span className="inline-flex items-center px-1.5 py-0.5 rounded-[5px] bg-teal-400/10 border border-teal-400/20 text-[9px] font-extrabold text-teal-400 tracking-wider uppercase">
    You
  </span>
);
export const MywaBadge = () => (
  <span className="px-1.5 py-0.5 rounded-sm bg-lime-500/10 border border-lime-500/20 text-lime-400 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
    <HeartHandshake size={10} /> MYWA
  </span>
);
// ── ACTION BUTTONS ──
export const LibraryBtn = ({ isLibraryMember, onClick, fullWidth = false }) => (
  <motion.button
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.96 }}
    onClick={onClick}
    className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-[9px] border text-[10px] font-bold tracking-wider uppercase transition-colors ${fullWidth ? "flex-1" : ""} ${isLibraryMember ? "bg-rose-400/8 border-rose-400/20 text-rose-400 hover:bg-rose-400/15" : "bg-emerald-400/8 border-emerald-400/20 text-emerald-400 hover:bg-emerald-400/15"}`}>
    <BookOpen size={11} />{" "}
    {isLibraryMember  ? "Remove Library " : "Grant Library"}
  </motion.button>
);
export const MywaBtn = ({ isMywaMember, isPending, onClick }) => (
  <button
    onClick={onClick}
    className={`p-1.5 rounded-lg transition-colors border ${
      isMywaMember
        ? "bg-lime-500/10 text-lime-400 border-lime-500/20 hover:bg-lime-500/20"
        : "bg-white/5 text-slate-500 border-white/5 hover:bg-white/10 hover:text-white"
    }${
      isPending && !isMywaMember
        ? "border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)] bg-amber-500/5"
        : ""
    }`}
    title={isMywaMember ? "Remove from MYWA Family" : "Add to MYWA Family"}>
    {/* 🚀 PENDING NOTIFICATION DOT (Pinging Animation) */}
    {isPending && !isMywaMember && (
      <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
      </span>
    )}
    <HeartHandshake size={16} />
  </button>
);
export const BlockBtn = ({ isActive, onClick, fullWidth = false }) => (
  <motion.button
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.96 }}
    onClick={onClick}
    className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-[9px] border text-[10px] font-bold tracking-wider uppercase transition-colors ${fullWidth ? "flex-1" : ""} ${isActive ? "bg-rose-400/8 border-rose-400/20 text-rose-400 hover:bg-rose-400/15" : "bg-emerald-400/8 border-emerald-400/20 text-emerald-400 hover:bg-emerald-400/15"}`}>
    <Ban size={11} /> {isActive ? "Block" : "Unblock"}
  </motion.button>
);

export const PromoteDropdown = ({
  user,
  isOpen,
  onToggle,
  onConfirmAdmin,
  onConfirmThinkTank,
}) => (
  <div className="relative action-dropdown">
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onToggle}
      className="w-8 h-8 rounded-lg bg-white/4 border border-white/8 flex items-center justify-center text-slate-500 hover:bg-white/8 hover:text-slate-200 transition-all">
      <MoreVertical size={14} />
    </motion.button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -8 }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
          className="absolute right-0 z-99999 -top-25 md:right-0 mt-2 w-52 rounded-[14px]  overflow-hidden  bg-[#0d1117] border border-white/8 shadow-[0_16px_40px_rgba(0,0,0,0.6)]">
          <button
            onClick={onConfirmAdmin}
            className="w-full flex items-center gap-2.5 px-4 py-3 text-[12px] text-slate-400 hover:bg-teal-500/10 hover:text-teal-400 transition-colors border-b border-white/5">
            <ShieldAlert size={13} /> Promote to Admin
          </button>
          {user.role !== "thinkTank" && (
            <button
              onClick={onConfirmThinkTank}
              className="w-full flex items-center gap-2.5 px-4 py-3 text-[12px] text-slate-400 hover:bg-lime-500/10 hover:text-lime-400 transition-colors">
              <UserCog size={13} /> Make Think-Tank
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
