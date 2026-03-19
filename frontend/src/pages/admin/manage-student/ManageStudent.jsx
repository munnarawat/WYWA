import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  AlertCircle,
} from "lucide-react";
import api from "../../../utils/api";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import PopUp from "../../../pop-up/PopUp";
import toast from "react-hot-toast";
import StudentTableRow from "./StudentTableRow";
const ManageStudent = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { user: currentUser } = useSelector((state) => state.auth);
  // pop-up
  const [showAlert, setShowAlert] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [actionType, setActionType] = useState(null);
  // dropDown
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // skeleton loader
  const TableSkeleton = () => {
    return (
      <div className="w-full min-h-screen bg-zinc-950 p-4 md:p-8 flex flex-col gap-8">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <div className="h-10 w-48 bg-white/10 rounded-lg animate-pulse mb-2"></div>
            <div className="h-4 w-72 bg-white/5 rounded-md animate-pulse"></div>
          </div>
          <div className="h-10 w-full md:w-72 bg-white/10 rounded-xl animate-pulse"></div>
        </div>

        {/* Table Skeleton */}
        <div className="w-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-900/50">
                  <th className="px-6 py-5">
                    <div className="h-4 w-20 bg-white/10 rounded animate-pulse"></div>
                  </th>
                  <th className="px-6 py-5">
                    <div className="h-4 w-16 bg-white/10 rounded animate-pulse"></div>
                  </th>
                  <th className="px-6 py-5">
                    <div className="h-4 w-16 bg-white/10 rounded animate-pulse"></div>
                  </th>
                  <th className="px-6 py-5">
                    <div className="h-4 w-24 bg-white/10 rounded animate-pulse ml-auto"></div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {/* Generate 5 empty rows for skeleton */}
                {[1, 2, 3, 4, 5].map((item) => (
                  <tr key={item}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse"></div>
                        <div className="flex flex-col gap-2">
                          <div className="h-4 w-32 bg-white/10 rounded animate-pulse"></div>
                          <div className="h-3 w-48 bg-white/5 rounded animate-pulse"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 w-20 rounded-full bg-white/10 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 w-20 rounded-full bg-white/10 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-8 w-40 rounded-lg bg-white/10 animate-pulse ml-auto"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  //  fetch all api users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/users");
      setUsers(response.data.users);
      setError("");
    } catch (error) {
      console.error("Fetch users error:", error);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".action-dropdown")) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // toggle block/unblock api
  const handleToggleBlock = async (userId, currentStatus) => {
    try {
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isActive: !u.isActive } : u,
        ),
      );
      const response = await api.patch(`/admin/user/${userId}/block`);
      if (response.data.users) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId
              ? { ...u, isActive: response.data.user.isActive }
              : u,
          ),
        );
        toast.success(
          response.data.message ||
            (currentStatus ? "User blocked!" : "User unblocked!"),
        );
      }
    } catch (error) {
      console.error("Block toggle error:", error);
      toast.error(
        error.response?.data?.message || "Error blocking/unblocking user",
      );
      fetchUsers();
    }
  };
  // make sure to show pop-up before making admin;
  const handleConfirmAdmin = (userId, userName) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setActionType("admin");
    setShowAlert(true);
  };
  // make a admin
  const handleMakeAdmin = async () => {
    if (!selectedUserId) return;
    try {
      const response = await api.patch(
        `/admin/user/${selectedUserId}/make-admin`,
      );

      if (response.data.user) {
        setUsers(
          users.map((u) =>
            u._id === selectedUserId ? { ...u, role: "admin" } : u,
          ),
        );
        toast.success(response.data.message || "User prompted to admin!");
      }
    } catch (error) {
      console.error("Make admin error:", error);
      toast.error(error.response?.data?.message || "Error prompting to admin");
    } finally {
      setShowAlert(false);
      setSelectedUserId(null);
      setActionType(null);
    }
  };
  const handleConfirmThinkTank = (userId, userName) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setActionType("thinkTank");
    setShowAlert(true);
  };
  // make a thinkTank
  const handleMakeThinkTank = async () => {
    if (!selectedUserId) return;
    try {
      const response = await api.patch(
        `/admin/user/${selectedUserId}/make-thinkTank`,
      );

      if (response.data.user) {
        setUsers(
          users.map((u) =>
            u._id === selectedUserId ? { ...u, role: "thinkTank" } : u,
          ),
        );
        toast.success(response.data.message || "User prompted to Think-Tank!");
      }
    } catch (error) {
      console.error("Make a think-tank error:", error);
      toast.error(
        error.response?.data?.message || "Error prompting to think-tank",
      );
    } finally {
      setShowAlert(false);
      setSelectedUserId(null);
      setActionType(null);
    }
  };

  // library access
  const handleToggleLibrary = async (userId) => {
    try {
      const response = await api.patch(`/admin/user/${userId}/toggle-library`);

      if (response.data.success) {
        setUsers(
          users.map((u) =>
            u._id === userId
              ? { ...u, isLibraryMember: response.data.user.isLibraryMember }
              : u,
          ),
        );
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Toggle library error:", error);
      toast.error(
        error.response?.data?.message || "Error updating library access",
      );
    }
  };
  // search filter the logic
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [users, searchQuery]);
  // Loading State
  if (isLoading) {
    return <TableSkeleton />;
  }
  // Error State
  if (error) {
    return (
      <div className="w-full h-[80vh] flex flex-col items-center justify-center text-red-400">
        <AlertCircle size={48} className="mb-4 text-red-500/80" />
        <p>{error}</p>
        <button
          onClick={fetchUsers}
          className="mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white">
          Retry
        </button>
      </div>
    );
  }
  return (
    <div className="w-full relative min-h-screen bg-zinc-950 text-white p-4 md:p-8 overflow-y-auto pb-24">
      {/* show Alert section  */}
      <AnimatePresence>
        {showAlert && (
          <PopUp
            onCancel={() => {
              setShowAlert(false);
              setSelectedUserId(null);
              setSelectedUserName(null);
              setActionType(null);
            }}
            onConfirm={() => {
              if (actionType === "admin") handleMakeAdmin();
              else if (actionType === "thinkTank") handleMakeThinkTank();
            }}
            text={`Are you sure you want to promote ${selectedUserName} to ${actionType === "admin" ? "admin" : "Think-Tank"}`}
          />
        )}
      </AnimatePresence>
      {/* Header & Search */}
      <div className="mb-8 bg-zinc-950/50 backdrop-blur-sm  flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-teal-400 to-lime-400">
            Manage Users
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 mt-1">
            View, block, or promote users in the {currentUser?.branch} branch.
          </motion.p>
        </div>
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full md:w-72">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            type="text"
            placeholder="Search username or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-teal-500/50 focus:bg-white/10 transition-all text-white placeholder:text-zinc-500"
          />
        </motion.div>
      </div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-zinc-900/50 text-zinc-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-5 font-medium">User Info</th>
                <th className="px-6 py-5 font-medium">Role</th>
                <th className="px-6 py-5 font-medium">Status</th>
                <th className="px-6 py-5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-sm">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-zinc-500">
                    No users found in your branch.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <StudentTableRow
                    key={user._id}
                    user={user}
                    currentUser={currentUser}
                    openDropdownId={openDropdownId}
                    setOpenDropdownId={setOpenDropdownId}
                    handleToggleLibrary={handleToggleLibrary}
                    handleConfirmAdmin={handleConfirmAdmin}
                    handleConfirmThinkTank={handleConfirmThinkTank}
                    handleToggleBlock={handleToggleBlock}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default ManageStudent;
