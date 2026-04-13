import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ChevronRight,
  BookDashed,
  BookOpen,
  Clock,
} from "lucide-react";

const LibraryOverviewSection = ({ issuedBooks = [], isLoading }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // 🔍 Search Filter Logic (Book Name or Student Name)
const filteredBooks = useMemo(() => {
    return issuedBooks.filter((record) => {
      const bookTitle = record.book?.title || "";
      const studentName = record?.issuedBy?.fullName?.firstName
        ? `${record.issuedBy?.fullName.firstName} ${record.issuedBy?.fullName.lastName || ""}`.trim()
        : record.issuedBy?.userName || "Unknown";

      return (
        bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.branch?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [issuedBooks, searchTerm]);

  // 🎨 Status Colors (Active vs Overdue vs Returned)
  const getStatusStyle = (status) => {
    const s = status?.toLowerCase() || "active";
    if (s === "returned")
      return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    if (s === "overdue")
      return "text-rose-400 bg-rose-400/10 border-rose-400/20";
    return "text-teal-400 bg-teal-400/10 border-teal-400/20"; // Active default
  };

  // 📅 Date Formatter Helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } },
  };

  return (
    <div className="mt-8 flex flex-col gap-5">
      {/* ── HEADER & SEARCH BAR ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">
            Library Overview
          </h2>
          <p className="text-sm text-slate-500">
            Track active book issues and returns
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Search books, students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0d1117] border border-white/10 text-sm text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* ── SKELETON LOADING ── */}
      {isLoading ? (
        <div className="animate-pulse flex flex-col gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 w-full bg-white/5 rounded-2xl" />
          ))}
        </div>
      ) : filteredBooks.length === 0 ? (
        /* ── EMPTY STATE ── */
        <div className="bg-[#0d1117] border border-white/5 rounded-[20px] p-10 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4 border border-white/5">
            <BookDashed className="h-8 w-8 text-slate-500" />
          </div>
          <h3 className="text-white font-bold text-lg mb-1">No books found</h3>
          <p className="text-slate-500 text-sm">
            {searchTerm
              ? "Try adjusting your search criteria."
              : "No books are currently issued in this branch."}
          </p>
        </div>
      ) : (
        /* ── LIBRARY LIST CONTAINER ── */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full">
          {/* 🖥️ DESKTOP VIEW (Table) */}
          <div className="hidden md:block overflow-hidden rounded-[20px] border border-white/5 bg-[#0d1117]">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/5 text-[10px] font-bold tracking-widest uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">Book Info</th>
                  <th className="px-6 py-4">Issued To</th>
                  <th className="px-6 py-4">Branch</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredBooks.map((record) => {
                  const studentName = record?.issuedBy?.fullName?.firstName
                    ? `${record.issuedBy?.fullName.firstName} ${record.issuedBy?.fullName.lastName || ""}`.trim()
                    : record.issuedBy?.userName || "Unknown";
                  const bookTitle = record.book?.title || "Unknown Book";

                  return (
                    <motion.tr
                      variants={itemVariants}
                      key={record._id}
                      className="hover:bg-white/2 transition-colors cursor-pointer group">
                      {/* Book Info */}
                      <td className="px-6 py-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-teal-400" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-slate-200 block group-hover:text-teal-400 transition-colors">
                            {bookTitle}
                          </span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />{" "}
                            {formatDate(record.createdAt)}
                          </span>
                        </div>
                      </td>

                      {/* Issued To (Student) */}
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-300 block">
                          {studentName}
                        </span>
                      </td>

                      {/* Branch */}
                      <td className="px-6 py-4 text-sm text-slate-400 capitalize">
                        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[11px] font-medium tracking-wide">
                          {record.branch}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${getStatusStyle(record.status)}`}>
                          {record.status || "Active"}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 📱 MOBILE VIEW (Cards) */}
          <div className="md:hidden flex flex-col gap-3">
            {filteredBooks.map((record) => {
              const studentName = record?.issuedBy?.fullName?.firstName
                ? `${record.issuedBy?.fullName.firstName} ${record.issuedBy?.fullName.lastName || ""}`.trim()
                : record.issuedBy?.userName || "Unknown";
              const bookTitle = record.book?.title || "Unknown Book";

              return (
                <motion.div
                  variants={itemVariants}
                  key={record._id}
                  className="p-4 rounded-[20px] bg-[#0d1117] border border-white/5 flex flex-col gap-3 active:bg-white/2 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-teal-400" />
                      </div>
                      <div>
                        <h4 className="text-slate-200 text-sm font-bold line-clamp-1">
                          {bookTitle}
                        </h4>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />{" "}
                          {formatDate(record.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5">
                    <div>
                      <p className="text-[10px] text-slate-600 font-bold uppercase">
                        Issued To
                      </p>
                      <p className="text-sm text-slate-300 font-medium truncate">
                        {studentName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-600 font-bold uppercase mb-1">
                        Status
                      </p>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold border ${getStatusStyle(record.status)}`}>
                        {record.status || "Active"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LibraryOverviewSection;
