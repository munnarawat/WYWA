import React from "react";
import { motion } from "framer-motion";
import {
  AVATAR_CLASS,
  LibraryBadge,
  YouBadge,
  RolePill,
  StatusPill,
  LibraryBtn,
  BlockBtn,
  PromoteDropdown,
} from "./StudentSharedUI";
import { useNavigate } from "react-router-dom";

const StudentMobileList = ({
  users,
  currentUser,
  openDropdownId,
  setOpenDropdownId,
  handleToggleLibrary,
  handleToggleBlock,
  handleConfirmAdmin,
  handleConfirmThinkTank,
}) => {

  const navigate = useNavigate();
  if (users.length === 0) {
    return (
      <div className="text-center py-14 text-slate-600 text-[14px] md:hidden">
        👤 No users found.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15 }}
      className="flex flex-col gap-3 md:hidden">
      {users.map((user, index) => {
        const isSelf = currentUser?._id === user._id;
        const isOpen = openDropdownId === user._id;
        const initial = (
          user.fullName?.firstName?.charAt(0) ||
          user.userName?.charAt(0) ||
          "U"
        ).toUpperCase();
        const displayName = user.fullName?.firstName
          ? `${user.fullName.firstName} ${user.fullName.lastName || ""}`.trim()
          : user.userName;

        return (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, type: "spring", stiffness: 280 }}
            className="relative rounded-2xl p-px"
            style={{
              background: !user.isActive
                ? "linear-gradient(135deg, rgba(251,113,133,0.15), rgba(255,255,255,0.03))"
                : user.role === "thinkTank"
                  ? "linear-gradient(135deg, rgba(132,204,22,0.18), rgba(255,255,255,0.04), rgba(20,184,166,0.1))"
                  : "linear-gradient(135deg, rgba(20,184,166,0.18), rgba(255,255,255,0.04), rgba(132,204,22,0.08))",
            }}>
            <div className="bg-[#0d1117] rounded-[15px] p-4 relative overflow-hidden">
              <div
                className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none rounded-br-[15px]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
                  backgroundSize: "9px 9px",
                }}
              />

              <div onClick={()=>navigate(`/admin/user-profile/${user._id}`)} className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-extrabold shrink-0 border ${AVATAR_CLASS[user.role] || AVATAR_CLASS.student} ${!user.isActive ? "opacity-40 grayscale" : ""}`}>
                    {initial}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                      <span
                        className={`text-[14px] font-bold capitalize truncate ${!user.isActive ? "text-slate-500" : "text-slate-200"}`}>
                        {displayName}
                      </span>
                      {isSelf && <YouBadge />}
                    </div>
                    <p className="text-[11px] text-slate-600 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <StatusPill isActive={user.isActive} />
              </div>

              <div className="flex items-center gap-2 flex-wrap mb-3">
                <RolePill role={user.role} />
                {user.isLibraryMember && <LibraryBadge />}
              </div>

              <div className="h-px bg-white/5 mb-3" />

              <div className="flex items-center gap-2 flex-wrap">
                <LibraryBtn
                  isLibraryMember={user.isLibraryMember}
                  onClick={() => handleToggleLibrary(user._id)}
                  fullWidth
                />
                {!isSelf && (
                  <BlockBtn
                    isActive={user.isActive}
                    onClick={() => handleToggleBlock(user._id, user.isActive)}
                    fullWidth
                  />
                )}
                {user.role !== "admin" && (
                  <PromoteDropdown
                    user={user}
                    isOpen={isOpen}
                    onToggle={() => setOpenDropdownId(isOpen ? null : user._id)}
                    onConfirmAdmin={() => {
                      handleConfirmAdmin(user._id, user.userName);
                      setOpenDropdownId(null);
                    }}
                    onConfirmThinkTank={() => {
                      handleConfirmThinkTank(user._id, user.userName);
                      setOpenDropdownId(null);
                    }}
                  />
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default StudentMobileList;
