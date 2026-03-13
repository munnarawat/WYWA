import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  CheckCircle,
  Clock,
  BookOpen,
  X,
  AlertCircle,
  RefreshCw,
  UserCheck,
} from "lucide-react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import PopUp from "../../pop-up/PopUp";

//  SKELETON LOADER
const TableSkeleton = () => (
  <div className="w-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-4">
    <div className="animate-pulse space-y-4">
      <div className="h-10 bg-white/10 rounded-lg w-full mb-6"></div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-16 bg-white/5 rounded-xl w-full"></div>
      ))}
    </div>
  </div>
);

const ManageIssues = () => {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { user: currentUser } = useSelector((state) => state.auth);

  // Modal & Dropdown States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [branchStudents, setBranchStudents] = useState([]);

  // alert status
  const [showAlert, setShowAlert] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  //   1. fetch issues
  const fetchIssues = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/library/issued");
      setIssues(response.data.records);
    } catch (error) {
      console.error("Fetch issues error:", error);
      toast.error("Failed to load issue records.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Fetch Data for Dropdowns
  const fetchDropdownData = async () => {
    try {
      const [booksRes, usersRes] = await Promise.all([
        api.get("/library/books"),
        api.get("/admin/users"),
      ]);
      //   only show those books are available in stock
      const inStockBooks = booksRes.data.books.filter((b) => b.available > 0);
      setAvailableBooks(inStockBooks);

      // only filter on students
      const studentsOnly = usersRes.data.users.filter(
        (u) => u.role === "student" && u.isActive,
      );
      setBranchStudents(studentsOnly);
    } catch (error) {
      console.error("Dropdown data error:", error);
      toast.error("Failed to load students/books for the form.");
    }
  };

  useEffect(() => {
    fetchIssues();
    fetchDropdownData();
  }, []);

  // 3. Issue New Book
  const onSubmitForm = async (data) => {
    const toastId = toast.loading("Issuing book...");
    try {
      await api.post("/library/issue", {
        bookId: data.bookId,
        studentId: data.studentId,
      });
      toast.success("Book issued successfully! 🎉", { id: toastId });
      closeModal();
      fetchIssues(); // Refresh table
      fetchDropdownData();
    } catch (error) {
      console.error("Issue error:", error);
      toast.error(error.response?.data?.message || "Failed to issue book", {
        id: toastId,
      });
    }
  };

  const confirmReturn = (issuesId)=>{
    setShowAlert(true);
    setSelectedIssueId(issuesId)
  }
  // 4. Return Book
  const handleReturn = async () => {
    if (!selectedIssueId) return;

    const toastId = toast.loading("Processing return...");
    try {
      await api.patch(`/library/return/${selectedIssueId}`);
      toast.success("Book marked as returned! ✅", { id: toastId });

      fetchIssues();
      fetchDropdownData();
    } catch (error) {
      console.error("Return error:", error);
      toast.error(error.response?.data?.message || "Failed to return book", {
        id: toastId,
      });
    }finally{
        setShowAlert(false);
        setSelectedIssueId(null);
    }
  };

  const openIssueModal = () => {
    reset({ studentId: "", bookId: "" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
  };

  // Search Logic (Student Name ya Book Title se)
  const filteredIssues = useMemo(() => {
    return issues.filter(
      (issue) =>
        issue.student?.userName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        issue.student?.fullName.firstName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        issue.book?.title?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [issues, searchQuery]);
  return (
    <div className="w-full min-h-screen bg-zinc-950 text-white p-4 md:p-8 overflow-y-auto pb-24 relative">
      {/* show alert */}
      <AnimatePresence>
        {showAlert && (
          <PopUp
            onCancel={() => {
              setShowAlert(false);
              setSelectedIssueId(null);
            }}
            onConfirm={() => handleReturn()}
            text={`Are you sure student  return this Book? this action cannot be undone!`}
          />
        )}
      </AnimatePresence>
      {/* 🟢 MODAL (Issue Book) */}
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
                <BookOpen className="text-teal-400" />
                Issue New Book
              </h2>

              <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-5">
                {/* Select Student */}
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">
                    Select Student *
                  </label>
                  <select
                    {...register("studentId", {
                      required: "Please select a student",
                    })}
                    className={`w-full bg-black/40 border ${errors.studentId ? "border-rose-500" : "border-white/10"} rounded-xl py-3 px-4 text-white focus:outline-none focus:border-teal-500/50 appearance-none`}>
                    <option
                      value=""
                      disabled
                      className="bg-zinc-900 text-zinc-500">
                      -- Choose a Student --
                    </option>
                    {branchStudents.map((student) => (
                      <option
                        key={student._id}
                        value={student._id}
                        className="bg-zinc-900">
                        {student.fullName
                          ? `${student.fullName.firstName} (${student.email})`
                          : `${student.userName} (${student.email})`}
                      </option>
                    ))}
                  </select>
                  {errors.studentId && (
                    <p className="text-rose-400 text-xs mt-1">
                      {errors.studentId.message}
                    </p>
                  )}
                </div>

                {/* Select Book */}
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">
                    Select Book *
                  </label>
                  <select
                    {...register("bookId", {
                      required: "Please select a book",
                    })}
                    className={`w-full bg-black/40 border ${errors.bookId ? "border-rose-500" : "border-white/10"} rounded-xl py-3 px-4 text-white focus:outline-none focus:border-teal-500/50 appearance-none`}>
                    <option
                      value=""
                      disabled
                      className="bg-zinc-900 text-zinc-500">
                      -- Choose a Book --
                    </option>
                    {availableBooks.length === 0 ? (
                      <option disabled className="bg-zinc-900">
                        No books available in stock
                      </option>
                    ) : (
                      availableBooks.map((book) => (
                        <option
                          key={book._id}
                          value={book._id}
                          className="bg-zinc-900">
                          {book.title} (Available: {book.available})
                        </option>
                      ))
                    )}
                  </select>
                  {errors.bookId && (
                    <p className="text-rose-400 text-xs mt-1">
                      {errors.bookId.message}
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
                    disabled={
                      isSubmitting ||
                      availableBooks.length === 0 ||
                      branchStudents.length === 0
                    }
                    className="flex-1 py-3 rounded-xl bg-linear-to-r from-teal-500 to-lime-500 text-zinc-950 font-bold shadow-lg hover:shadow-teal-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmitting ? "Processing..." : "Issue Book"}
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
            className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-teal-400 to-lime-400">
            Book Issues & Returns
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 mt-1">
            Track currently issued books and process returns for{" "}
            {currentUser?.branch}.
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
              placeholder="Search student or book..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-teal-500/50 transition-all text-white"
            />
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={openIssueModal}
            className="flex items-center justify-center gap-2 bg-linear-to-r from-teal-500 to-lime-500 text-zinc-950 font-bold px-5 py-2.5 rounded-xl hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all whitespace-nowrap">
            <Plus size={18} /> Issue Book
          </motion.button>
        </div>
      </div>

      {/* 🟢 ISSUES TABLE */}
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-zinc-900/50 text-zinc-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-5 font-medium">Student Info</th>
                  <th className="px-6 py-5 font-medium">Book Details</th>
                  <th className="px-6 py-5 font-medium">Issue Date</th>
                  <th className="px-6 py-5 font-medium">Status</th>
                  <th className="px-6 py-5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-sm">
                {filteredIssues.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-zinc-500">
                      No issue records found.
                    </td>
                  </tr>
                ) : (
                  filteredIssues.map((issue) => (
                    <tr
                      key={issue._id}
                      className="hover:bg-white/5 transition-colors">
                      {/* 1. Student Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm text-zinc-300 border border-white/20 uppercase">
                            {issue.student?.userName?.charAt(0) || "U"}
                          </div>
                          <div>
                            <p className="font-semibold text-white capitalize">
                              {issue.student?.fullName.firstNam ||
                                issue.student?.userName}
                            </p>
                            <p className="text-xs text-zinc-500">
                              {issue.student?.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* 2. Book Info */}
                      <td className="px-6 py-4">
                        <p
                          className="font-semibold text-white max-w-[200px] truncate"
                          title={issue.book?.title}>
                          {issue.book?.title}
                        </p>
                        <p className="text-xs text-zinc-500 truncate max-w-[200px]">
                          {issue.book?.author}
                        </p>
                      </td>

                      {/* 3. Issue Date */}
                      <td className="px-6 py-4 text-zinc-400">
                        {new Date(
                          issue.issuedAt || issue.createdAt,
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* 4. Status Badge */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                          ${issue.status === "returned" ? "bg-teal-500/10 text-teal-400 border-teal-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}
                        `}>
                          {issue.status === "returned" ? (
                            <CheckCircle size={14} />
                          ) : (
                            <Clock size={14} />
                          )}
                          {issue.status === "returned" ? "Returned" : "Active"}
                        </span>
                      </td>

                      {/* 5. Actions (Return Button) */}
                      <td className="px-6 py-4 text-right">
                        {issue.status !== "returned" ? (
                          <button
                            onClick={() => confirmReturn(issue._id)}
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-teal-500/20 hover:text-teal-400 border border-white/10 text-zinc-300 text-xs font-medium transition-colors flex items-center gap-1.5 ml-auto">
                            <RefreshCw size={14} /> Mark Returned
                          </button>
                        ) : (
                          <span className="text-xs text-zinc-500 italic px-2">
                            Processed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ManageIssues;
