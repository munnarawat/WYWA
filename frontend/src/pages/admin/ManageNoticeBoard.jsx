import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  User,
  Loader2,
  AlertCircle,
  X,
  Megaphone,
} from "lucide-react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import PopUp from "../../pop-up/PopUp";

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
const ManageNoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  // Modal States (For Create and Update)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  // alert status
  const [showAlert, setShowAlert] = useState(false);
  const [selectedNoticeId, setSelectedNoticeId] = useState(null);
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
    const delayDebounceFn = setTimeout(fetchNotice,500);
    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchQuery]);

  // 2. Add / Update Notice API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      return toast.error("title and description are required");
    }
    const toastId = toast.loading(
      editingId ? "Updating notice..." : " Publishing notice... ",
    );

    try {
      if (editingId) {
        // update
        await api.put(`/notice/${editingId}`, formData);
        toast.success("notice update successfully 🎉", { id: toastId });
      } else {
        // create
        await api.post("/notice/create", formData);
        toast.success("notice create successfully 🎉", { id: toastId });
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

    const toastId = toast.loading("Deleting notice");
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
    }finally{
      setShowAlert(false);
      setSelectedNoticeId(null);
    }
  };

  const openCreateModel = () => {
    setFormData({ title: "", description: "" });
    setEditingId(null);
    setIsModalOpen(true);
  };
  const openEditModal = (notice) => {
    setFormData({ title: notice.title, description: notice.description });
    setEditingId(notice._id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ title: "", description: "" });
    setEditingId(null);
  };
  return (
    <div className="w-full min-h-screen bg-zinc-950 text-white p-4 md:p-8 overflow-y-auto pb-24 relative">
      {/* show alert */}
      <AnimatePresence>
        {showAlert && (
          <PopUp
            onCancel={() => {
              setShowAlert(false);
              setSelectedNoticeId(null);
            }}
            onConfirm={()=> handleDelete()}
            text={`Are you sure you want to delete this notice? this action cannot be undone!`}
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
              className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 z-10">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white transition bg-white/5 p-2 rounded-full">
                <X size={18} />
              </button>

              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Megaphone className="text-teal-400" />
                {editingId ? "Edit Notice" : "Create Notice"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">
                    Notice Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="E.g., Tomorrow is a holiday"
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-teal-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">
                    Description
                  </label>
                  <textarea
                    rows="4"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Provide details here..."
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-teal-500/50 transition-colors resize-none"></textarea>
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
                    className="flex-1 py-3 rounded-xl bg-linear-to-r from-teal-500 to-lime-500 text-zinc-950 font-bold shadow-lg hover:shadow-teal-500/25 transition">
                    {editingId ? "Update" : "Publish"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🟢 PAGE HEADER & CONTROLS */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-teal-400 to-lime-400">
            Notice Board
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 mt-1">
            Publish announcements and keep students updated.
          </motion.p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
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
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-teal-500/50 transition-all text-white"
            />
          </motion.div>

          {/* Add Notice Button */}
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
          <p className="text-sm">
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
            {notices.map((notice) => (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                key={notice._id}
                className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-teal-500/30 transition-all hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between h-full min-h-[220px]">
                {/* Notice Content */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-teal-400 transition-colors">
                    {notice.title}
                  </h3>
                  <p className="text-zinc-400 text-sm line-clamp-3 mb-4 leading-relaxed">
                    {notice.description}
                  </p>
                </div>

                {/* Footer Data & Actions */}
                <div className="mt-auto pt-4 border-t border-white/10 flex items-end justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <Calendar size={12} />
                      {new Date(notice.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <User size={12} />
                      <span className="capitalize">
                        {notice.createdBy?.userName || "Admin"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(notice)}
                      className="p-2 rounded-lg bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 transition"
                      title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => confirmDelete(notice._id)}
                      className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition"
                      title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* 🟢 PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center items-center gap-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed transition">
                Previous
              </button>
              <span className="text-sm font-medium text-zinc-400">
                Page <span className="text-white">{currentPage}</span> of{" "}
                {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed transition">
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageNoticeBoard;
