import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Plus, Search } from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../../../utils/api";
import PopUp from "../../../pop-up/PopUp";

import IssueTableRow from "./IssueTableRow";
import IssueCard from "./IssueCard";
import IssueBookModal from "./IssueBookModal";
import { Helmet } from "react-helmet-async";

// ─────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────
const TableSkeleton = () => (
  <div className="flex flex-col gap-3 animate-pulse">
    <div className="h-12 rounded-[14px] bg-white/4" />
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className="h-16 rounded-[14px] bg-white/3"
        style={{ animationDelay: `${i * 0.08}s` }}
      />
    ))}
  </div>
);

// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────
const ManageIssues = () => {
  const { user: currentUser } = useSelector((state) => state.auth);

  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [branchStudents, setBranchStudents] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState(null);

  // ── Fetch issues ───────────────────────
  const fetchIssues = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/library/issued");
      setIssues(res.data.records || []);
    } catch (err) {
      console.error("Fetch issues error:", err);
      toast.error("Failed to load issue records.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Fetch dropdown data ────────────────
  const fetchDropdownData = useCallback(async () => {
    try {
      const [booksRes, usersRes] = await Promise.all([
        api.get("/library/books"),
        api.get("/admin/users"),
      ]);
      setAvailableBooks(booksRes.data.books.filter((b) => b.available > 0));
      setBranchStudents(
        usersRes.data.users.filter((u) => u.role === "student" && u.isActive),
      );
    } catch (err) {
      console.error("Dropdown data error:", err);
      toast.error("Failed to load form data.");
    }
  }, []);

  useEffect(() => {
    fetchIssues();
    fetchDropdownData();
  }, [fetchIssues, fetchDropdownData]);

  // ── Issue new book ─────────────────────
  const handleIssueBook = async (data) => {
    const toastId = toast.loading("Issuing book...");
    try {
      await api.post("/library/issue", {
        bookId: data.bookId,
        studentId: data.studentId,
      });
      toast.success("Book issued successfully! 🎉", { id: toastId });
      setIsModalOpen(false);
      await Promise.all([fetchIssues(), fetchDropdownData()]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to issue book", {
        id: toastId,
      });
    }
  };

  // ── Confirm return ─────────────────────
  const confirmReturn = useCallback((issueId) => {
    setSelectedIssueId(issueId);
    setShowAlert(true);
  }, []);

  // ── Handle return ──────────────────────
  const handleReturn = async () => {
    if (!selectedIssueId) return;
    const toastId = toast.loading("Processing return...");
    try {
      await api.patch(`/library/return/${selectedIssueId}`);
      toast.success("Book marked as returned! ✅", { id: toastId });
      await Promise.all([fetchIssues(), fetchDropdownData()]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to return book", {
        id: toastId,
      });
    } finally {
      setShowAlert(false);
      setSelectedIssueId(null);
    }
  };

  // ── Search filter ──────────────────────
  const filteredIssues = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return issues;
    return issues.filter(
      (issue) =>
        issue.student?.userName?.toLowerCase().includes(q) ||
        issue.student?.fullName?.firstName?.toLowerCase().includes(q) ||
        issue.book?.title?.toLowerCase().includes(q),
    );
  }, [issues, searchQuery]);

  // ── Derived stats ──────────────────────
  const stats = useMemo(
    () => ({
      total: issues.length,
      active: issues.filter(
        (i) =>
          i.status !== "returned" &&
          (!i.dueDate || new Date(i.dueDate) >= new Date()),
      ).length,
      returned: issues.filter((i) => i.status === "returned").length,
      overdue: issues.filter(
        (i) =>
          i.status !== "returned" &&
          i.dueDate &&
          new Date(i.dueDate) < new Date(),
      ).length,
    }),
    [issues],
  );

  return (
    <div className="w-full min-h-screen text-white p-4 md:p-8 pb-24 overflow-y-auto flex flex-col gap-5">
      {/* Helmet */}
      <Helmet>
        <title>Manage Issue | MYWA</title>
      </Helmet>
      {/* ── CONFIRM POPUP ── */}
      <AnimatePresence>
        {showAlert && (
          <PopUp
            onCancel={() => {
              setShowAlert(false);
              setSelectedIssueId(null);
            }}
            onConfirm={handleReturn}
            text="Are you sure the student has returned this book? This cannot be undone."
          />
        )}
      </AnimatePresence>

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-6 border-b border-white/5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] font-semibold tracking-widest uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            MYWA · Library Management
          </div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-extrabold bg-clip-text text-transparent mb-2"
            style={{
              fontSize: "clamp(22px, 3vw, 34px)",
              backgroundImage:
                "linear-gradient(135deg, #f0fdf4 0%, #14b8a6 50%, #84cc16 100%)",
            }}>
            Book Issues & Returns
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[14px] text-slate-500">
            Track issued books and process returns for{" "}
            <span className="text-slate-300 font-medium">
              {currentUser?.branch}
            </span>
            .
          </motion.p>
        </div>

        {/* Search + Issue button */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search student or book…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search issues"
              className="bg-white/3 border border-white/[0.07] rounded-[13px] py-2.5 pl-9 pr-4 text-[13px] text-slate-100 placeholder:text-slate-700 outline-none transition-all w-56 focus:border-teal-500/40 focus:bg-teal-500/2 "
            />
          </div>

          <motion.div
            whileHover={{ y: -2 }}
            className="relative rounded-[13px] p-px shrink-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(20,184,166,0.5), rgba(132,204,22,0.4))",
            }}>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[13px] text-[#080c10]"
              style={{
                background: "linear-gradient(135deg, #14b8a6, #84cc16)",
              }}>
              <Plus size={16} /> Issue Book
            </button>
          </motion.div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="flex gap-3 flex-wrap">
        {[
          { dot: "#14b8a6", value: stats.total, label: "Total Issues" },
          { dot: "#fbbf24", value: stats.active, label: "Active" },
          { dot: "#34d399", value: stats.returned, label: "Returned" },
          { dot: "#fb7185", value: stats.overdue, label: "Overdue" },
        ].map(({ dot, value, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-[12px] text-slate-400"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}>
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: dot }}
            />
            <strong className="text-slate-200">{value}</strong> {label}
          </div>
        ))}
      </div>

      {/* Section label */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-bold tracking-widest uppercase text-slate-600 whitespace-nowrap">
          Issue records
        </span>
        <div className="flex-1 h-px bg-white/5" />
        {!isLoading && (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/4 border border-white/6 text-slate-600">
            {filteredIssues.length} Records
          </span>
        )}
      </div>

      {/* ── LOADING ── */}
      {isLoading ? (
        <TableSkeleton />
      ) : filteredIssues.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-600">
          <BookOpen size={40} className="mb-3 opacity-40" />
          <p className="text-[15px] font-semibold text-slate-500">
            No issue records found.
          </p>
          <p className="text-[13px] mt-1">
            Try adjusting the search or issue a new book.
          </p>
        </div>
      ) : (
        <>
          {/* ── DESKTOP TABLE (md+) ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="hidden md:block relative rounded-[20px] p-px"
            style={{
              background:
                "linear-gradient(135deg, rgba(20,184,166,0.22), rgba(255,255,255,0.04), rgba(132,204,22,0.1))",
            }}>
            <div className="bg-[#0d1117] rounded-[19px] overflow-hidden relative">
              <div
                className="absolute bottom-0 right-0 w-28 h-28 pointer-events-none rounded-br-[19px]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
                  backgroundSize: "12px 12px",
                }}
              />
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr
                      className="border-b border-white/5"
                      style={{ background: "rgba(255,255,255,0.02)" }}>
                      {[
                        "Student Info",
                        "Book Details",
                        "Issue Date",
                        "Status",
                        "Actions",
                      ].map((h, i) => (
                        <th
                          key={h}
                          className="px-5 py-4 text-[10px] font-bold tracking-widest uppercase text-slate-600"
                          style={i === 4 ? { textAlign: "right" } : {}}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIssues.map((issue, i) => (
                      <IssueTableRow
                        key={issue._id}
                        issue={issue}
                        onConfirmReturn={confirmReturn}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* ── MOBILE CARDS (below md) ── */}
          <div className="flex flex-col gap-3 md:hidden">
            {filteredIssues.map((issue, i) => (
              <IssueCard
                key={issue._id}
                issue={issue}
                index={i}
                onConfirmReturn={confirmReturn}
              />
            ))}
          </div>
        </>
      )}

      {/* ── MODAL ── */}
      <IssueBookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleIssueBook}
        availableBooks={availableBooks}
        branchStudents={branchStudents}
      />
    </div>
  );
};

export default ManageIssues;
