import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Trophy,
  Award,
  Star,
  X,
  Image as ImageIcon,
  CalendarDays,
} from "lucide-react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import PopUp from "../../pop-up/PopUp";

// 🌟 SKELETON LOADER
const AchievementSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div
        key={i}
        className="bg-white/5 border border-white/10 rounded-2xl p-4 animate-pulse flex flex-col h-[340px]">
        <div className="w-full h-48 bg-white/10 rounded-xl mb-4"></div>
        <div className="h-6 w-3/4 bg-white/10 rounded-md mb-2"></div>
        <div className="h-4 w-1/2 bg-white/5 rounded-md mb-4"></div>
        <div className="mt-auto flex justify-between">
          <div className="h-6 w-20 bg-white/5 rounded-md"></div>
          <div className="h-6 w-16 bg-white/5 rounded-md"></div>
        </div>
      </div>
    ))}
  </div>
);
const ManageAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { user: currentUser } = useSelector((state) => state.auth);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // alert status
  const [showAlert, setShowAlert] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  // 1. fetch fetchAchievements
  const fetchAchievements = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(
        `/achievements/all?branch=${currentUser?.branch}`,
      );
      setAchievements(res.data.achievement || res.data.achievements);
    } catch (error) {
      console.error("Fetch achievements error:", error);
      toast.error("Failed to load Wall of Fame.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchAchievements();
  }, [currentUser]);

  // 2. Add / Update Achievement
  const onSubmitForm = async (data) => {
    const toastId = toast.loading(
      editingId ? "Updating record..." : "Adding to Wall of Fame...",
    );
    try {
      if (editingId) {
        await api.put(`/achievements/${editingId}`, data);
        toast.success("Record updated successfully! 🏆", { id: toastId });
      } else {
        await api.post("/achievements/create", data);
        toast.success("Added to Wall of Fame! 🎉", { id: toastId });
      }
      closeModal();
      fetchAchievements();
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
    }
  };

  const confirmDelete = (id) => {
    setSelectedStudentId(id);
    setShowAlert(true);
  };
  // 3. Delete Achievement
  const handleDelete = async () => {
    if (selectedStudentId) return;
    const toastId = toast.loading("Removing record...");
    try {
      await api.delete(`/achievements/${selectedStudentId}`);
      toast.success("Record removed!", { id: toastId });
      setAchievements(achievements.filter((a) => a._id !== selectedStudentId));
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to remove record", {
        id: toastId,
      });
    }finally{
      showAlert(false);
      setSelectedStudentId(null);
    }
  };

  // Modal Handlers
  const openCreateModal = () => {
    reset({
      studentName: "",
      examName: "",
      year: new Date().getFullYear().toString(),
      description: "",
      imageUrl: "",
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (ach) => {
    setValue("studentName", ach.studentName);
    setValue("examName", ach.examName);
    setValue("year", ach.year);
    setValue("description", ach.description);
    setValue("imageUrl", ach.imageUrl || "");
    setEditingId(ach._id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
    setEditingId(null);
  };

  // Search Filter
  const filteredAchievements = useMemo(() => {
    return achievements.filter(
      (ach) =>
        ach.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ach.examName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ach.year?.toString().includes(searchQuery),
    );
  }, [achievements, searchQuery]);

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-white p-4 md:p-8 overflow-y-auto pb-24 relative">
      {/* show alert */}
      <AnimatePresence>
        {showAlert && (
          <PopUp
            onCancel={() => {
              setShowAlert(false);
              setSelectedStudentId(null);
            }}
            onConfirm={() => handleDelete()}
            text={`Are you sure you want delete Student Achievements? this action cannot be undone!`}
          />
        )}
      </AnimatePresence>
      {/* 🟢 MODAL (Add / Edit Form) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-zinc-900 border border-amber-500/20 rounded-2xl shadow-2xl p-6 md:p-8 z-10">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white transition bg-white/5 p-2 rounded-full">
                <X size={18} />
              </button>

              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Trophy className="text-amber-400" />
                {editingId ? "Edit Success Story" : "Add to Wall of Fame"}
              </h2>

              <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">
                    Student Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    {...register("studentName", {
                      required: "Name is required",
                    })}
                    className={`w-full bg-black/20 border ${errors.studentName ? "border-rose-500" : "border-white/10"} rounded-xl py-3 px-4 text-white focus:outline-none focus:border-amber-500/50`}
                  />
                  {errors.studentName && (
                    <p className="text-rose-400 text-xs mt-1">
                      {errors.studentName.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                      Selection / Exam *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. TCS Ninja or JEE"
                      {...register("examName", {
                        required: "Exam/Selection is required",
                      })}
                      className={`w-full bg-black/20 border ${errors.examName ? "border-rose-500" : "border-white/10"} rounded-xl py-3 px-4 text-white focus:outline-none focus:border-amber-500/50`}
                    />
                    {errors.examName && (
                      <p className="text-rose-400 text-xs mt-1">
                        {errors.examName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                      Passing Year *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2026"
                      {...register("year", { required: "Year is required" })}
                      className={`w-full bg-black/20 border ${errors.year ? "border-rose-500" : "border-white/10"} rounded-xl py-3 px-4 text-white focus:outline-none focus:border-amber-500/50`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">
                    Image URL{" "}
                    <span className="text-xs text-zinc-500">
                      (Optional - Drive/Imgur Link)
                    </span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    {...register("imageUrl")}
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">
                    Short Description *
                  </label>
                  <textarea
                    rows="3"
                    placeholder="e.g. Secured AIR 500 and got placed as SDE."
                    {...register("description", {
                      required: "Description is required",
                    })}
                    className={`w-full bg-black/20 border ${errors.description ? "border-rose-500" : "border-white/10"} rounded-xl py-3 px-4 text-white focus:outline-none focus:border-amber-500/50 resize-none`}
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition font-medium">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 text-zinc-950 font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] transition disabled:opacity-50">
                    {isSubmitting
                      ? "Saving..."
                      : editingId
                        ? "Update Record"
                        : "Add Student"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🟢 HEADER & SEARCH */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-amber-400 to-orange-400 flex items-center gap-3">
            <Award size={32} className="text-amber-400" /> Wall of Fame
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 mt-1">
            Showcase successful selections and achievements of{" "}
            {currentUser?.branch} students.
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
              placeholder="Search student or exam..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-amber-500/50 transition-all text-white"
            />
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 bg-linear-to-r from-amber-500 to-orange-500 text-zinc-950 font-bold px-5 py-2.5 rounded-xl hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all whitespace-nowrap">
            <Plus size={18} /> Add Success Story
          </motion.button>
        </div>
      </div>

      {/* 🟢 ACHIEVEMENTS GRID */}
      {isLoading ? (
        <AchievementSkeleton />
      ) : filteredAchievements.length === 0 ? (
        <div className="w-full h-64 flex flex-col items-center justify-center text-zinc-500 bg-white/5 border border-white/10 rounded-2xl border-dashed">
          <Star size={48} className="mb-4 opacity-30" />
          <p className="text-lg font-medium">No success stories yet.</p>
          <p className="text-sm">
            Add students who got selected to inspire others!
          </p>
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
          {filteredAchievements.map((ach) => (
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              key={ach._id}
              className="group relative bg-zinc-900 border border-white/10 rounded-2xl p-4 hover:border-amber-500/40 transition-all hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(245,158,11,0.1)] flex flex-col h-full overflow-hidden">
              {/* Image Container with Glow */}
              <div className="w-full h-48 rounded-xl bg-zinc-950 mb-4 overflow-hidden relative border border-white/5 flex items-center justify-center">
                {ach.imageUrl ? (
                  <img
                    src={ach.imageUrl}
                    alt={ach.studentName}
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "";
                    }}
                  />
                ) : (
                  // Fallback Gradient if no image
                  <div className="w-full h-full bg-linear-to-br from-amber-900/40 to-zinc-900 flex flex-col items-center justify-center text-amber-500/30">
                    <Trophy size={40} className="mb-2" />
                  </div>
                )}

                {/* Year Badge */}
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1.5 text-xs font-bold text-white shadow-lg">
                  <CalendarDays size={12} className="text-amber-400" />{" "}
                  {ach.year}
                </div>
              </div>

              {/* Student Details */}
              <div className="flex-1 flex flex-col">
                <h3
                  className="text-xl font-bold text-white mb-1 group-hover:text-amber-400 transition-colors line-clamp-1"
                  title={ach.studentName}>
                  {ach.studentName}
                </h3>
                {/* Exam / Selection Highlight */}
                <p className="text-amber-500 font-semibold text-sm mb-3 line-clamp-1 flex items-center gap-1.5">
                  <Star size={14} className="fill-amber-500" /> Selected in{" "}
                  {ach.examName}
                </p>
                <p className="text-zinc-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                  "{ach.description}"
                </p>

                {/* Footer Controls (Admin Only Actions) */}
                <div className="mt-auto pt-3 border-t border-white/10 flex items-center justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(ach)}
                    className="p-2 rounded-lg bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 transition"
                    title="Edit Record">
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => confirmDelete(ach._id)}
                    className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition"
                    title="Delete Record">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ManageAchievements;
