import React, { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Plus, Lightbulb, Briefcase } from "lucide-react";
import api from "../../../utils/api";
import toast from "react-hot-toast";
import ThinkTankSkeleton from "./ThinkTankSkeleton";
import ThinkTankCard from "./ThinkTankCard";
import ThinkTankModal from "./ThinkTankModal";
import PopUp from "../../../pop-up/PopUp";
const ManageThinkTank = () => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

    // pop-up
  const [showAlert, setShowAlert] = useState(false);
  const [selectedThinkTankId, setSelectedThinkTankId] = useState(null);
  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/thinkTank`); // Global API
      setMembers(res.data.members);
    } catch (error) {
      toast.error("Failed to load Think Tank members.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleFormSubmit = async (data, id) => {
    const toastId = toast.loading(
      id ? "Updating profile..." : "Adding team member...",
    );
    try {
      if (id) {
        await api.put(`/thinkTank/${id}`, data);
        toast.success("Profile updated successfully! ✨", { id: toastId });
      } else {
        await api.post("/thinkTank/create", data);
        toast.success("Team member added! 🎉", { id: toastId });
      }
      fetchMembers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
    }
  };

  const confirmDelete = async(id)=>{
    setShowAlert(true);
    setSelectedThinkTankId(id);
  }
  const handleDelete = async (id) => {
    if (!selectedThinkTankId) return;
    const toastId = toast.loading("Removing profile...");
    try {
      await api.delete(`/thinkTank/${selectedThinkTankId}`);
      toast.success("Member removed!", { id: toastId });
      setMembers(members.filter((m) => m._id !== selectedThinkTankId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove member", {
        id: toastId,
      });
    }finally{
      setShowAlert(false);
      setSelectedThinkTankId(null);
    }
  };

  const openCreateModal = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const filteredMembers = useMemo(() => {
    return members.filter(
      (m) =>
        m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.roleOrContribution?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [members, searchQuery]);
  return (
    <div className="w-full min-h-screen bg-zinc-950 text-white p-4 md:p-8 overflow-y-auto pb-24 relative">
      {/* show Alert section  */}
      <AnimatePresence>
        {showAlert && (
          <PopUp
            onCancel={() => {
              setShowAlert(false);
              setSelectedThinkTankId(null);
            }}
            onConfirm={() =>handleDelete()}
            text={`Are you sure you want to delete this thinkTank member`}
          />
        )}
      </AnimatePresence>
      {/* 🟢 MODAL COMPONENT */}
      <ThinkTankModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitForm={handleFormSubmit}
        editingMember={editingMember}
      />

      {/* 🟢 HEADER & SEARCH */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-purple-400 flex items-center gap-3">
            <Lightbulb size={32} className="text-indigo-400" /> Think Tank
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 mt-1">
            Manage the core advisors, contributors, and experts of the MYWA
            Organization.
          </motion.p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full sm:w-64">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="text"
              placeholder="Search by name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all text-white"
            />
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 bg-linear-to-r from-indigo-500 to-purple-500 text-white font-bold px-5 py-2.5 rounded-xl hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all whitespace-nowrap">
            <Plus size={18} /> Add Member
          </motion.button>
        </div>
      </div>

      {/* 🟢 THINK TANK GRID */}
      {isLoading ? (
        <ThinkTankSkeleton />
      ) : filteredMembers.length === 0 ? (
        <div className="w-full h-64 flex flex-col items-center justify-center text-zinc-500 bg-white/5 border border-white/10 rounded-2xl border-dashed">
          <Briefcase size={48} className="mb-4 opacity-30" />
          <p className="text-lg font-medium">No members added yet.</p>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.05 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member) => (
            <ThinkTankCard
              key={member._id}
              member={member}
              onEdit={openEditModal}
              onDelete={confirmDelete}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ManageThinkTank;
