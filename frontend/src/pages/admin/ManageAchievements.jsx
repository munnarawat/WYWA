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
  CalendarDays,
  User,
  Briefcase,
  Link as LinkIcon,
  Loader2,
  Sparkles,
} from "lucide-react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import PopUp from "../../pop-up/PopUp";
import { Helmet } from "react-helmet-async";

// 🌟 SKELETON LOADER
const AchievementSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div
        key={i}
        className="rounded-[20px] overflow-hidden animate-pulse"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}>
        <div className="w-full h-48 bg-white/5"></div>
        <div className="p-5 space-y-3">
          <div className="h-5 w-3/4 bg-white/10 rounded-md"></div>
          <div className="h-4 w-1/2 bg-teal-500/10 rounded-md"></div>
          <div className="h-3 w-full bg-white/5 rounded-md mt-4"></div>
          <div className="h-3 w-5/6 bg-white/5 rounded-md"></div>
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

  // Alert Status
  const [showAlert, setShowAlert] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  // 1. Fetch Achievements
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
      const formData = new FormData();
      formData.append("studentName", data.studentName);
      formData.append("examName", data.examName);
      formData.append("year", data.year);
      formData.append("description", data.description);

      if (data.imageUrl && data.imageUrl.length > 0) {
        formData.append("image", data.imageUrl[0]);
      }

      if (editingId) {
        await api.put(`/achievements/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Record updated successfully! 🏆", { id: toastId });
      } else {
        await api.post("/achievements/create", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
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
    if (!selectedStudentId) return;
    const toastId = toast.loading("Removing record...");
    try {
      await api.delete(`/achievements/${selectedStudentId}`);
      toast.success("Record removed!", { id: toastId });
      setAchievements(achievements.filter((a) => a._id !== selectedStudentId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove record", {
        id: toastId,
      });
    } finally {
      setShowAlert(false);
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
      {/* Helmet */}
      <Helmet>
        <title>Manage Achievement | MYWA</title>
      </Helmet>
      {/* 🔴 ALERT POPUP */}
      <AnimatePresence>
        {showAlert && (
          <PopUp
            onCancel={() => {
              setShowAlert(false);
              setSelectedStudentId(null);
            }}
            onConfirm={handleDelete}
            text="Are you sure you want to delete this Achievement? This action cannot be undone!"
          />
        )}
      </AnimatePresence>

      {/* 🟢 PREMIUM MODAL (Add / Edit) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl rounded-3xl p-px z-10"
              style={{
                background:
                  "linear-gradient(135deg, rgba(20,184,166,0.5), rgba(255,255,255,0.05), rgba(132,204,22,0.3))",
              }}>
              <div className="bg-[#0a0e14] rounded-[23px] overflow-hidden">
                {/* Modal Header */}
                <div className="relative px-6 py-5 border-b border-white/5 bg-white/2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                      <Trophy size={20} />
                    </div>
                    <div>
                      <h2 className="text-[18px] font-bold text-slate-100 leading-tight">
                        {editingId
                          ? "Edit Success Story"
                          : "Add to Wall of Fame"}
                      </h2>
                      <p className="text-[12px] text-slate-500">
                        Celebrate student milestones
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 transition-colors">
                    <X size={16} />
                  </button>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit(onSubmitForm)}
                  className="p-6 sm:p-8 space-y-5">
                  {/* Student Name */}
                  <div>
                    <label className="block text-[11px] font-bold tracking-widest uppercase text-slate-500 mb-2">
                      Student Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                      />
                      <input
                        type="text"
                        placeholder="e.g. Rahul Sharma"
                        {...register("studentName", {
                          required: "Name is required",
                        })}
                        className={`w-full bg-[#131920] border rounded-xl py-3 pl-11 pr-4 text-[14px] text-slate-200 placeholder:text-slate-600 outline-none transition-all focus:bg-teal-500/5 ${errors.studentName ? "border-rose-500/50" : "border-white/10 focus:border-teal-500/50"}`}
                      />
                    </div>
                    {errors.studentName && (
                      <p className="text-rose-400 text-[11px] mt-1.5">
                        {errors.studentName.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Exam Name */}
                    <div>
                      <label className="block text-[11px] font-bold tracking-widest uppercase text-slate-500 mb-2">
                        Selection / Exam{" "}
                        <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Briefcase
                          size={16}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                        />
                        <input
                          type="text"
                          placeholder="e.g. TCS Ninja or JEE"
                          {...register("examName", {
                            required: "Exam/Selection is required",
                          })}
                          className={`w-full bg-[#131920] border rounded-xl py-3 pl-11 pr-4 text-[14px] text-slate-200 placeholder:text-slate-600 outline-none transition-all focus:bg-teal-500/5 ${errors.examName ? "border-rose-500/50" : "border-white/10 focus:border-teal-500/50"}`}
                        />
                      </div>
                      {errors.examName && (
                        <p className="text-rose-400 text-[11px] mt-1.5">
                          {errors.examName.message}
                        </p>
                      )}
                    </div>

                    {/* Passing Year */}
                    <div>
                      <label className="block text-[11px] font-bold tracking-widest uppercase text-slate-500 mb-2">
                        Passing Year <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <CalendarDays
                          size={16}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                        />
                        <input
                          type="text"
                          placeholder="e.g. 2026"
                          {...register("year", {
                            required: "Year is required",
                          })}
                          className={`w-full bg-[#131920] border rounded-xl py-3 pl-11 pr-4 text-[14px] text-slate-200 placeholder:text-slate-600 outline-none transition-all focus:bg-teal-500/5 ${errors.year ? "border-rose-500/50" : "border-white/10 focus:border-teal-500/50"}`}
                        />
                      </div>
                      {errors.year && (
                        <p className="text-rose-400 text-[11px] mt-1.5">
                          {errors.year.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-[11px] font-bold tracking-widest uppercase text-slate-500 mb-2">
                      Image URL{" "}
                      <span className="text-slate-600 font-normal normal-case">
                        (Optional)
                      </span>
                    </label>
                    <div className="relative">
                      <LinkIcon
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        placeholder="https://..."
                        {...register("imageUrl")}
                        className="w-full bg-[#131920] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-[14px] text-slate-200 placeholder:text-slate-600 outline-none transition-all focus:bg-teal-500/5 focus:border-teal-500/50"
                      />
                    </div>
                  </div>
                  {/* Form Actions */}
                  <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/5 mt-6">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-[13px] font-bold transition-colors">
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-zinc-950 text-[13px] font-bold shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_25px_rgba(20,184,166,0.5)] disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                      style={{
                        background: "linear-gradient(135deg, #14b8a6, #84cc16)",
                      }}>
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />{" "}
                          Saving...
                        </>
                      ) : editingId ? (
                        "Save Changes"
                      ) : (
                        "Add Record"
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🟢 HEADER SECTION */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] font-semibold tracking-widest uppercase mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
        MYWA · Admin Achievement Panel
      </div>

      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-extrabold flex items-center bg-clip-text text-transparent mb-2 text-3xl md:text-4xl"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #f0fdf4 0%, #14b8a6 50%, #84cc16 100%)",
            }}>
            <Trophy size={32} className="text-teal-400 mr-3" /> Wall of Fame
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-[14px] mt-1">
            Showcase successful selections and achievements of{" "}
            <span className="text-slate-300 font-medium">
              {currentUser?.branch}
            </span>{" "}
            students.
          </motion.p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full sm:w-64">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              placeholder="Search student or exam..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-[13px] focus:outline-none focus:border-teal-500/40 focus:bg-teal-500/5 transition-all text-white placeholder:text-slate-600"
            />
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 bg-linear-to-r from-teal-500 to-lime-500 text-zinc-950 font-bold px-5 py-2.5 rounded-xl hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:-translate-y-1 transition-all whitespace-nowrap">
            <Plus size={18} /> Add Success Story
          </motion.button>
        </div>
      </div>

      {/* 🟢 ACHIEVEMENTS GRID */}
      {isLoading ? (
        <AchievementSkeleton />
      ) : filteredAchievements.length === 0 ? (
        <div className="w-full h-64 flex flex-col items-center justify-center text-zinc-500 bg-white/5 border border-white/10 rounded-2xl border-dashed">
          <Sparkles size={48} className="mb-4 opacity-30 text-teal-500" />
          <p className="text-lg font-medium text-slate-300">
            No success stories found.
          </p>
          <p className="text-sm mt-1">
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
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { type: "spring", stiffness: 280 },
                },
              }}
              key={ach._id}
              className="group relative rounded-[20px] p-px overflow-hidden cursor-pointer"
              style={{
                background:
                  "linear-gradient(135deg, rgba(20,184,166,0.2), rgba(255,255,255,0.03), rgba(132,204,22,0.1))",
              }}>
              {/* Internal Card Background */}
              <div className="bg-[#0d1117] rounded-[19px] flex flex-col h-full relative z-10">
                {/* Image Container */}
                <div className="w-full h-48 relative overflow-hidden bg-[#131920] border-b border-white/5 flex items-center justify-center rounded-t-[19px]">
                  {ach.imageUrl ? (
                    <img
                      src={ach.imageUrl}
                      alt={ach.studentName}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700 ease-out"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    // Fallback Teal Gradient
                    <div className="w-full h-full bg-linear-to-br from-teal-900/30 to-[#0d1117] flex flex-col items-center justify-center text-teal-500/20">
                      <Award size={48} strokeWidth={1} />
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-[#0d1117] via-transparent to-transparent opacity-80 pointer-events-none" />

                  {/* Sleek Year Badge */}
                  <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5 text-[11px] font-bold text-slate-200">
                    <CalendarDays size={12} className="text-teal-400" />{" "}
                    {ach.year}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col relative overflow-hidden">
                  {/* Decorative Mesh Background */}
                  <div
                    className="absolute bottom-0 right-0 w-20 h-20 pointer-events-none rounded-br-[19px] opacity-30 transition-opacity group-hover:opacity-100"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, rgba(20,184,166,0.2) 1px, transparent 1px)",
                      backgroundSize: "10px 10px",
                    }}
                  />

                  <h3 className="text-[17px] font-black text-slate-100 mb-1 line-clamp-1 group-hover:text-teal-400 transition-colors">
                    {ach.studentName}
                  </h3>

                  <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-widest uppercase text-teal-400/90 mb-3 bg-teal-500/10 self-start px-2 py-1 rounded-md border border-teal-500/20">
                    <Star size={12} className="fill-teal-400/50" />{" "}
                    {ach.examName}
                  </div>
                  {/* Footer Controls (Edit/Delete) */}
                  <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                    <button
                      onClick={() => openEditModal(ach)}
                      className="p-2 rounded-xl bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 transition hover:scale-105"
                      title="Edit Record">
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => confirmDelete(ach._id)}
                      className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition hover:scale-105"
                      title="Delete Record">
                      <Trash2 size={15} />
                    </button>
                  </div>
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
