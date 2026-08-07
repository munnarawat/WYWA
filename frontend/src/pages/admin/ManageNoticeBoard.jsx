import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, X, Megaphone } from "lucide-react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import PopUp from "../../pop-up/PopUp";
import { useForm } from "react-hook-form";
import NoticeCard from "../../components/NoticeCard";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";

// 🌟 SKELETON LOADER FOR CARDS
const NoticeSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 h-48 animate-pulse flex flex-col justify-between">
          <div>
            <div className="h-6 w-3/4 bg-white/10 rounded-md mb-4"></div>
            <div className="h-4 w-full bg-white/5 rounded-md mb-2"></div>
            <div className="h-4 w-5/6 bg-white/5 rounded-md"></div>
          </div>
          <div className="flex justify-between mt-4">
            <div className="h-4 w-24 bg-white/5 rounded-md"></div>
            <div className="h-4 w-24 bg-white/5 rounded-md"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const categoryOptions = [
  "urgent",
  "event",
  "important",
  "meeting",
  "announcement",
];
const ManageNoticeBoard = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Alert status
  const [showAlert, setShowAlert] = useState(false);
  const [selectedNoticeId, setSelectedNoticeId] = useState(null);

  // 🌟 REACT HOOK FORM SETUP
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  // 1. Fetch Notices API
  const fetchNotice = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(
        `/notice?page=${currentPage}&limit=${limit}&search=${searchQuery}`,
      );
      setNotices(response.data.notices);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Fetch notices error:", error);
      toast.error("Failed to load notices.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(fetchNotice, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchQuery]);
  const onSubmitForm = async (data) => {
    const toastId = toast.loading(
      editingId ? "Updating notice..." : "Publishing notice...",
    );

    try {
      if (editingId) {
        // update
        await api.put(`/notice/${editingId}`, data);
        toast.success("Notice updated successfully 🎉", { id: toastId });
      } else {
        // create
        await api.post("/notice/create", data);
        toast.success("Notice created successfully 🎉", { id: toastId });
      }
      closeModal();
      fetchNotice(); //refresh the list
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
    }
  };

  const confirmDelete = (id) => {
    setSelectedNoticeId(id);
    setShowAlert(true);
  };

  // 3. Delete Notice API
  const handleDelete = async () => {
    if (!selectedNoticeId) return;

    const toastId = toast.loading("Deleting notice...");
    try {
      await api.delete(`/notice/${selectedNoticeId}`);
      toast.success("Notice deleted!", { id: toastId });
      if (notices.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchNotice();
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete notice", { id: toastId });
    } finally {
      setShowAlert(false);
      setSelectedNoticeId(null);
    }
  };

  // Modal Handlers (RHF reset/setValue ka use)
  const openCreateModel = () => {
    reset({ title: "", description: "", category: "" });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (notice) => {
    setValue("title", notice.title);
    setValue("description", notice.description);
    setValue("category", notice.category);
    setEditingId(notice._id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
    setEditingId(null);
  };

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-white p-4 md:p-8 overflow-y-auto pb-24 relative">
      {/* Helmet */}
      <Helmet>
        <title>Manage NoticeBoard | MYWA</title>
      </Helmet>
      {/* show alert */}
      <AnimatePresence>
        {showAlert && (
          <PopUp
            onCancel={() => {
              setShowAlert(false);
              setSelectedNoticeId(null);
            }}
            onConfirm={() => handleDelete()}
            text={`Are you sure you want to delete this notice? This action cannot be undone!`}
          />
        )}
      </AnimatePresence>

      {/* 🟢 MODAL OVERLAY (Create / Edit Form) */}
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
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-xl rounded-3xl p-px overflow-hidden z-10"
              style={{
                background:
                  "linear-gradient(135deg, rgba(20,184,166,0.5), rgba(255,255,255,0.05), rgba(132,204,22,0.3))",
              }}>
              <div className="bg-[#0a0e14] p-6 rounded-[23px] overflow-hidden">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-zinc-400 hover:text-white transition bg-white/5 p-2 rounded-full">
                  <X size={18} />
                </button>

                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Megaphone className="text-teal-400" />
                  {editingId ? "Edit Notice" : "Create Notice"}
                </h2>

                {/* 🌟 FORM SE ONSUBMIT CHANGE HUA HAI */}
                <form
                  onSubmit={handleSubmit(onSubmitForm)}
                  className="space-y-4">
                  {/* category */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                      Notice Category
                    </label>
                    <select
                      {...register("category", {
                        required: "Category is required",
                      })}
                      className={`w-full bg-black/20 border ${
                        errors.category ? "border-rose-500" : "border-white/10"
                      } rounded-xl py-3 px-4 text-white focus:outline-none focus:border-teal-500/50 transition-colors cursor-pointer appearance-none`}>
                      {/* Dark theme fix for default option */}
                      <option value="" className="bg-[#0d1117] text-slate-100">
                        Select a category
                      </option>

                      {/* Mapping with capitalized first letter for UI */}
                      {categoryOptions.map((cat) => (
                        <option
                          className="bg-[#0d1117] text-slate-100"
                          key={cat}
                          value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-rose-400 text-xs mt-1">
                        {errors.category.message}
                      </p>
                    )}
                  </div>
                  {/* title */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                      Notice Title
                    </label>
                    <input
                      type="text"
                      placeholder="E.g., Tomorrow is a holiday"
                      {...register("title", { required: "Title is required" })}
                      className={`w-full bg-black/20 border ${
                        errors.title ? "border-rose-500" : "border-white/10"
                      } rounded-xl py-3 px-4 text-white focus:outline-none focus:border-teal-500/50 transition-colors`}
                    />
                    {errors.title && (
                      <p className="text-rose-400 text-xs mt-1">
                        {errors.title.message}
                      </p>
                    )}
                  </div>
                  {/* description */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                      Description
                    </label>
                    <textarea
                      rows="4"
                      placeholder="Provide details here..."
                      {...register("description", {
                        required: "Description is required",
                      })}
                      className={`w-full bg-black/20 border ${
                        errors.description
                          ? "border-rose-500"
                          : "border-white/10"
                      } rounded-xl py-3 px-4 text-white focus:outline-none focus:border-teal-500/50 transition-colors resize-none`}
                    />
                    {errors.description && (
                      <p className="text-rose-400 text-xs mt-1">
                        {errors.description.message}
                      </p>
                    )}
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
                      className="flex-1 py-3 rounded-xl bg-linear-to-r from-teal-500 to-lime-500 text-zinc-950 font-bold shadow-lg hover:shadow-teal-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed">
                      {isSubmitting
                        ? "Processing..."
                        : editingId
                          ? "Update"
                          : "Publish"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🟢 PAGE HEADER & CONTROLS */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] font-semibold tracking-widest uppercase mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
        MYWA · Admin notice board
      </div>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-extrabold bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #f0fdf4 0%, #14b8a6 50%, #84cc16 100%)",
            }}>
            Notice Board
          </motion.h1>
          {/* description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[14px] text-slate-500">
            Publish announcements and keep students updated. for{" "}
            <span className="text-slate-300 font-medium">
              {currentUser?.branch}
            </span>{" "}
            branch.
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
              placeholder="Search notices..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#111C1F] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-teal-500/50 transition-all text-white"
            />
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={openCreateModel}
            className="flex items-center justify-center gap-2 bg-linear-to-r from-teal-500 to-lime-500 text-zinc-950 font-bold px-5 py-2.5 rounded-xl hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all whitespace-nowrap">
            <Plus size={18} /> New Notice
          </motion.button>
        </div>
      </div>

      {/* 🟢 NOTICES GRID SECTION */}
      {isLoading ? (
        <NoticeSkeleton />
      ) : notices.length === 0 ? (
        <div className="w-full h-64 flex flex-col items-center justify-center text-zinc-500 bg-white/5 border border-white/10 rounded-2xl border-dashed">
          <Megaphone size={48} className="mb-4 opacity-50" />
          <p className="text-lg font-medium">No notices found</p>
          <p className="text-sm text-center text-zinc-500">
            Click "New Notice" to publish your first announcement.
          </p>
        </div>
      ) : (
        <>
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notices.map((notice, index) => (
              <NoticeCard
                key={notice._id || index}
                notice={notice}
                index={index}
                isAdmin={true}
                onDelete={confirmDelete}
                onEdit={openEditModal}
              />
            ))}
          </motion.div>
          {/* 🟢 PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-3">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-5 py-2.5 rounded-xl border border-white/8 bg-white/4 text-slate-400 text-[13px] font-medium hover:bg-teal-500/10 hover:border-teal-500/30 hover:text-teal-400 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/4 disabled:hover:border-white/8 disabled:hover:text-slate-400 transition-all duration-300">
                ← Previous
              </button>

              <span className="px-4 text-[13px] text-slate-500">
                Page{" "}
                <span className="text-white font-semibold">{currentPage}</span>{" "}
                of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-5 py-2.5 rounded-xl border border-white/8 bg-white/4 text-slate-400 text-[13px] font-medium hover:bg-teal-500/10 hover:border-teal-500/30 hover:text-teal-400 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/4 disabled:hover:border-white/8 disabled:hover:text-slate-400 transition-all duration-300">
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageNoticeBoard;
