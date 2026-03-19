import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  ShieldCheck,
  Ban,
  CheckCircle,
  UserCog,
  MoreVertical,
  BookOpen,
} from "lucide-react";

const StudentTableRow = ({
  user,
  currentUser,
  openDropdownId,
  setOpenDropdownId,
  handleToggleLibrary,
  handleConfirmAdmin,
  handleConfirmThinkTank,
  handleToggleBlock,
}) => {
  return (
    <tr className="hover:bg-white/5 transition-colors">
      {/* 1. User Info with Library Badge */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm uppercase
            ${
              user.role === "admin"
                ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                : "bg-white/10 text-zinc-300 border border-white/20"
            }`}>
            {user.fullName?.firstName?.charAt(0) ||
              user.userName?.charAt(0) ||
              "U"}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-white capitalize">
                {user.fullName?.firstName
                  ? `${user.fullName.firstName} ${user.fullName.lastName}`
                  : user.userName}
              </p>
              {user.isLibraryMember && (
                <div
                  title="Library Member"
                  className="bg-emerald-500/20 text-emerald-400 p-1 rounded shadow-[0_0_10px_rgba(52,211,153,0.2)]">
                  <BookOpen size={14} />
                </div>
              )}
            </div>
            <p className="text-xs text-zinc-500">{user.email}</p>
          </div>
        </div>
      </td>

      {/* 2. Role */}
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
          ${
            user.role === "admin"
              ? "bg-teal-500/10 text-teal-400 border-teal-500/20"
              : "bg-zinc-800 text-zinc-400 border-white/10"
          }`}>
          {user.role === "admin" ? (
            <ShieldCheck size={14} />
          ) : (
            <UserCog size={14} />
          )}
          {user.role}
        </span>
      </td>

      {/* 3. Status (Active/Blocked) */}
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
          ${
            user.isActive
              ? "bg-lime-500/10 text-lime-400 border-lime-500/20"
              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
          }`}>
          {user.isActive ? <CheckCircle size={14} /> : <Ban size={14} />}
          {user.isActive ? "Active" : "Blocked"}
        </span>
      </td>

      {/* 4. Actions (Three Dots Dropdown) */}
      <td className="px-6 py-4 text-right relative action-dropdown">
        <button
          onClick={() =>
            setOpenDropdownId(openDropdownId === user._id ? null : user._id)
          }
          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white">
          <MoreVertical size={18} />
        </button>

        <AnimatePresence>
          {openDropdownId === user._id && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-8 top-10 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col text-left">
              {/* Toggle Library Button */}
              <button
                onClick={() => {
                  handleToggleLibrary(user._id);
                  setOpenDropdownId(null);
                }}
                className="w-full px-4 py-2.5 text-xs text-zinc-300 hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors border-b border-white/5">
                <BookOpen
                  size={14}
                  className={
                    user.isLibraryMember ? "text-rose-400" : "text-emerald-400"
                  }
                />
                {user.isLibraryMember
                  ? "Remove Library Access"
                  : "Grant Library Access"}
              </button>

              {/* Make Admin Button */}
              {user.role !== "admin" && (
                <button
                  onClick={() => {
                    handleConfirmAdmin(user._id, user.userName);
                    setOpenDropdownId(null);
                  }}
                  className="w-full px-4 py-2.5 text-xs text-zinc-300 hover:bg-teal-500/10 hover:text-teal-400 flex items-center gap-2 transition-colors">
                  <ShieldAlert size={14} /> Make Admin
                </button>
              )}

              {/* Make ThinkTank Button */}
              {user.role !== "admin" && user.role !== "thinkTank" && (
                <button
                  onClick={() => {
                    handleConfirmThinkTank(user._id, user.userName);
                    setOpenDropdownId(null);
                  }}
                  className="w-full px-4 py-2.5 text-xs text-zinc-300 hover:bg-lime-500/10 hover:text-lime-400 flex items-center gap-2 transition-colors">
                  <UserCog size={14} /> Make Think-Tank
                </button>
              )}

              {/* Block/Unblock Button */}
              {currentUser?._id !== user._id && (
                <button
                  onClick={() => {
                    handleToggleBlock(user._id, user.isActive);
                    setOpenDropdownId(null);
                  }}
                  className={`w-full px-4 py-2.5 text-xs flex items-center gap-2 transition-colors border-t border-white/5
                  ${user.isActive ? "text-rose-400 hover:bg-rose-500/10" : "text-lime-400 hover:bg-lime-500/10"}`}>
                  <Ban size={14} />{" "}
                  {user.isActive ? "Block User" : "Unblock User"}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </td>
    </tr>
  );
};

export default StudentTableRow;
