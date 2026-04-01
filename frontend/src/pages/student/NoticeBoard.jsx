import { motion } from "framer-motion";
import {
  ArrowRight,
  BellRing,
  Calendar,
  Megaphone,
  Search,
  User,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import NoticeCard from "../../components/NoticeCard";

const NoticeSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-white/5  border border-white/10 rounded-2xl p-6 h-48 animate-pulse flex flex-col justify-between">
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
const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;
  // fetch notice
  const fetchAllNotice = useCallback(async () => {
    const controller = new AbortController();
    try {
      setIsLoading(true);
      const response = await api.get(
        `/notice?page=${currentPage}&limit=${limit}&search=${searchQuery}`,
        { signal: controller.signal },
      );
      if (response.data.success) {
        setNotices(response.data.notices);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      if (error.name !== "CanceledError")
        toast.error("Failed to load notices.");
    } finally {
      setIsLoading(false);
    }
    return () => controller.abort();
  }, [currentPage, searchQuery]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(fetchAllNotice, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchAllNotice]);

  return (
    <div className="w-full min-h-screen  text-white p-4 md:p-8 overflow-y-auto pb-24 relative">
      {/* Eyebrow */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] font-semibold tracking-widest uppercase mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          MYWA ·Student noticeboard
        </div>
      </div>
      {/* 🟢 PAGE HEADER & CONTROLS */}
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
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 mt-1">
            Access the latest updates and announcements from the administration.
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
              aria-label="Search notices"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search notices..."
              className="w-full bg-[#111C1F] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-teal-500/50 transition-all text-white"
            />
          </motion.div>
        </div>
      </div>
      {/* notice section */}
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
            {/* 🚀 PREMIUM NOTICE CARD */}
            {notices.map((notice, index) => (
              <NoticeCard
                key={notice._id || index}
                notice={notice}
                index={index}
              />
            ))}
          </motion.div>
          {/* pagination */}
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

export default NoticeBoard;
