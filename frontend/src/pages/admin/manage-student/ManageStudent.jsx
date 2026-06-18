import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../../../utils/api";
import PopUp from "../../../pop-up/PopUp";
import ManageHeader from "./ManageHeader";
import StudentDesktopTable from "./StudentDesktopTable";
import StudentMobileList from "./StudentMobileList";
import { Helmet } from "react-helmet-async";

// ─────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────
const TableSkeleton = () => (
  <div className="flex flex-col gap-5 animate-pulse">
    <div className="flex justify-between gap-4 flex-wrap">
      <div className="space-y-2">
        <div className="h-9 w-52 bg-white/6 rounded-xl" />
        <div className="h-4 w-72 bg-white/4 rounded-lg" />
      </div>
      <div className="h-10 w-64 bg-white/6 rounded-[14px]" />
    </div>
    <div
      className="rounded-[20px] overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-5 py-4 border-b border-white/4">
          <div className="w-9 h-9 rounded-full bg-white/6" />
          <div className="flex-1 space-y-1.5">
            <div className="h-4 w-40 bg-white/6 rounded-md" />
            <div className="h-3 w-56 bg-white/4 rounded-md" />
          </div>
          <div className="h-6 w-20 bg-white/6 rounded-lg" />
          <div className="h-6 w-20 bg-white/6 rounded-lg" />
          <div className="h-7 w-32 bg-white/6 rounded-lg ml-auto" />
        </div>
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────
const ManageStudent = () => {
  const { user: currentUser } = useSelector((state) => state.auth);

  const [users, setUsers] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Confirm popup state
  const [showAlert, setShowAlert] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [actionType, setActionType] = useState(null);

  // ── Fetch users ────────────────────────
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users");
      setUsers(res.data.users || []);
      setError("");
    } catch (err) {
      console.error("Fetch users error:", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ── Close dropdown on outside click ───
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest(".action-dropdown")) setOpenDropdownId(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Toggle Block ───────────────────────
  const handleToggleBlock = useCallback(
    async (userId, currentStatus) => {
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isActive: !u.isActive } : u,
        ),
      );
      try {
        const res = await api.patch(`/admin/user/${userId}/block`);
        if (res.data.success) {
          setUsers((prev) =>
            prev.map((u) =>
              u._id === userId ? { ...u, isActive: res.data.user.isActive } : u,
            ),
          );
          toast.success(
            res.data.message ||
              (currentStatus ? "User blocked!" : "User unblocked!"),
          );
        }
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Error updating user status",
        );
        fetchUsers(); // rollback
      }
    },
    [fetchUsers],
  );

  // ── Toggle Library ─────────────────────
  const handleToggleLibrary = useCallback(async (userId) => {
    try {
      const res = await api.patch(`/admin/user/${userId}/toggle-library`);
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId
              ? { ...u, isLibraryMember: res.data.user.isLibraryMember }
              : u,
          ),
        );
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Error updating library access",
      );
    }
  }, []);

  // __ toggle MYWA member
  const handleToggleMywaMember = useCallback(async (userId) => {
    try {
      const res = await api.patch(`/admin/user/${userId}/toggle-member`);
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId
              ? { ...u, isMywaFamilyMember: res.data.user.isMywaFamilyMember }
              : u,
          ),
        );
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Error updating Mywa member access",
      );
    }
  },[]);

  // ── Confirm popup triggers ─────────────
  const handleConfirmAdmin = useCallback((userId, userName) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setActionType("admin");
    setShowAlert(true);
  }, []);

  const handleConfirmThinkTank = useCallback((userId, userName) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setActionType("thinkTank");
    setShowAlert(true);
  }, []);

  // ── Make Admin ─────────────────────────
  const handleMakeAdmin = useCallback(async () => {
    if (!selectedUserId) return;
    try {
      const res = await api.patch(`/admin/user/${selectedUserId}/make-admin`);
      if (res.data.user) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === selectedUserId ? { ...u, role: "admin" } : u,
          ),
        );
        toast.success(res.data.message || "Promoted to Admin!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error promoting to admin");
    } finally {
      setShowAlert(false);
      setSelectedUserId(null);
      setActionType(null);
    }
  }, [selectedUserId]);

  // ── Make ThinkTank ─────────────────────
  const handleMakeThinkTank = useCallback(async () => {
    if (!selectedUserId) return;
    try {
      const res = await api.patch(
        `/admin/user/${selectedUserId}/make-thinkTank`,
      );
      if (res.data.user) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === selectedUserId ? { ...u, role: "thinkTank" } : u,
          ),
        );
        toast.success(res.data.message || "Promoted to Think-Tank!");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Error promoting to think-tank",
      );
    } finally {
      setShowAlert(false);
      setSelectedUserId(null);
      setActionType(null);
    }
  }, [selectedUserId]);

  // ── Cancel popup ───────────────────────
  const handleCancelPopup = useCallback(() => {
    setShowAlert(false);
    setSelectedUserId(null);
    setSelectedUserName(null);
    setActionType(null);
  }, []);

  // ── Search filter ──────────────────────
  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.userName?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q),
    );
  }, [users, searchQuery]);

  // ── Derived stats ──────────────────────
  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter((u) => u.isActive).length,
      blocked: users.filter((u) => !u.isActive).length,
      library: users.filter((u) => u.isLibraryMember).length,
    }),
    [users],
  );

  // ── Loading / Error states ─────────────
  if (isLoading) return <TableSkeleton />;

  if (error) {
    return (
      <div className="w-full h-[80vh] flex flex-col items-center justify-center text-rose-400 gap-4">
        <AlertCircle size={44} className="opacity-70" />
        <p className="text-[15px] text-slate-400">{error}</p>
        <button
          onClick={fetchUsers}
          className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/8 border border-white/8 text-slate-300 text-[13px] font-semibold transition-all">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen text-white p-4 md:p-8 pb-24 overflow-y-auto flex flex-col gap-5 relative">
      {/* Helmet */}
      <Helmet>
        <title>Manage Student | MYWA</title>
      </Helmet>
      {/* ── CONFIRM POPUP ── */}
      <AnimatePresence>
        {showAlert && (
          <PopUp
            onCancel={handleCancelPopup}
            onConfirm={() => {
              if (actionType === "admin") handleMakeAdmin();
              else if (actionType === "thinkTank") handleMakeThinkTank();
            }}
            text={`Are you sure you want to promote ${selectedUserName} to ${actionType === "admin" ? "Admin" : "Think-Tank"}?`}
          />
        )}
      </AnimatePresence>

      {/* ── HEADER ── */}
      <ManageHeader
        currentUser={currentUser}
        filteredCount={filteredUsers.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        stats={stats}
      />

      {/* ── DESKTOP TABLE (md+ screens) ── */}
      <StudentDesktopTable
        users={filteredUsers}
        currentUser={currentUser}
        openDropdownId={openDropdownId}
        setOpenDropdownId={setOpenDropdownId}
        handleToggleLibrary={handleToggleLibrary}
        handleToggleMywaMember={handleToggleMywaMember}
        handleConfirmAdmin={handleConfirmAdmin}
        handleConfirmThinkTank={handleConfirmThinkTank}
        handleToggleBlock={handleToggleBlock}
      />

      {/* ── MOBILE CARDS (below md screens) ── */}
      <StudentMobileList
        users={filteredUsers}
        currentUser={currentUser}
        openDropdownId={openDropdownId}
        setOpenDropdownId={setOpenDropdownId}
        handleToggleLibrary={handleToggleLibrary}
        handleConfirmAdmin={handleConfirmAdmin}
         handleToggleMywaMember={handleToggleMywaMember}
        handleConfirmThinkTank={handleConfirmThinkTank}
        handleToggleBlock={handleToggleBlock}
      />
    </div>
  );
};

export default ManageStudent;
