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

const StudentDesktopTable = ({
  users,
  currentUser,
  openDropdownId,
  setOpenDropdownId,
  handleToggleLibrary,
  handleToggleBlock,
  handleConfirmAdmin,
  handleConfirmThinkTank,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="hidden md:block relative rounded-[20px] p-px"
      style={{
        background:
          "linear-gradient(135deg, rgba(20,184,166,0.22), rgba(255,255,255,0.04), rgba(132,204,22,0.1))",
      }}>
      <div className="bg-[#0d1117] rounded-[19px] overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr
                className="border-b border-white/5"
                style={{ background: "rgba(255,255,255,0.02)" }}>
                {["User Info", "Role", "Status", "Actions"].map((h, i) => (
                  <th
                    key={h}
                    className="px-5 py-4 text-[10px] font-bold tracking-widest uppercase text-slate-600"
                    style={i === 3 ? { textAlign: "right" } : {}}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-14 text-center text-slate-600">
                    👤 No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
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
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="border-b border-white/4 last:border-none hover:bg-white/2 transition-colors group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-extrabold shrink-0 border transition-transform group-hover:scale-105 ${AVATAR_CLASS[user.role] || AVATAR_CLASS.student} ${!user.isActive ? "opacity-40 grayscale" : ""}`}>
                            {initial}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                              <span
                                className={`text-[13px] font-semibold capitalize ${!user.isActive ? "text-slate-500" : "text-slate-200"}`}>
                                {displayName}
                              </span>
                              {user.isLibraryMember && <LibraryBadge />}
                              {isSelf && <YouBadge />}
                            </div>
                            <p className="text-[11px] text-slate-600">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <RolePill role={user.role} />
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusPill isActive={user.isActive} />
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <LibraryBtn
                            isLibraryMember={user.isLibraryMember}
                            onClick={() => handleToggleLibrary(user._id)}
                          />
                          {!isSelf && (
                            <BlockBtn
                              isActive={user.isActive}
                              onClick={() =>
                                handleToggleBlock(user._id, user.isActive)
                              }
                            />
                          )}
                          {user.role !== "admin" && (
                            <PromoteDropdown
                              user={user}
                              isOpen={isOpen}
                              onToggle={() =>
                                setOpenDropdownId(isOpen ? null : user._id)
                              }
                              onConfirmAdmin={() =>
                                handleConfirmAdmin(user._id, user.userName)
                              }
                              onConfirmThinkTank={() =>
                                handleConfirmThinkTank(user._id, user.userName)
                              }
                            />
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentDesktopTable;
