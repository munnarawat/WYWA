import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";

const IssueBookModal = ({
  isOpen,
  onClose,
  onSubmit,
  availableBooks = [],
  branchStudents = [],
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // Escape key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-120 rounded-[22px] p-px z-10"
            style={{
              background:
                "linear-gradient(135deg, rgba(20,184,166,0.35), rgba(255,255,255,0.05), rgba(132,204,22,0.2))",
            }}>
            <div className="bg-[#0d1117] rounded-[21px] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/6 bg-white/2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                    <BookOpen size={16} className="text-teal-400" />
                  </div>
                  <h2 className="text-[17px] font-bold text-slate-100">
                    Issue New Book
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  aria-label="Close modal"
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-slate-500 hover:bg-teal-500/10 hover:border-teal-500/25 hover:text-teal-400 transition-colors">
                  <X size={14} />
                </motion.button>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="p-6 flex flex-col gap-4">
                {/* Student select */}
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-600 mb-2">
                    Select Student <span className="text-rose-500">*</span>
                  </label>
                  <select
                    {...register("studentId", {
                      required: "Please select a student",
                    })}
                    className={`w-full bg-white/3 border rounded-[13px] px-4 py-3 text-[14px] text-slate-100 outline-none transition-all appearance-none cursor-pointer 
                      ${
                        errors.studentId
                          ? "border-rose-500/50"
                          : "border-white/[0.07] focus:border-teal-500/40 focus:bg-teal-500/2"
                      }`}>
                    <option
                      value=""
                      disabled
                      className="bg-[#0d1117] text-slate-500">
                      — Choose a Student —
                    </option>
                    {branchStudents.map((s) => (
                      <option
                        key={s._id}
                        value={s._id}
                        className="bg-[#0d1117]">
                        {s.fullName?.firstName
                          ? `${s.fullName.firstName} ${s.fullName.lastName || ""} (${s.email})`
                          : `${s.userName} (${s.email})`}
                      </option>
                    ))}
                  </select>
                  {errors.studentId && (
                    <p className="text-rose-400 text-[11px] mt-1.5">
                      {errors.studentId.message}
                    </p>
                  )}
                </div>

                {/* Book select */}
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-600 mb-2">
                    Select Book <span className="text-rose-500">*</span>
                  </label>
                  <select
                    {...register("bookId", {
                      required: "Please select a book",
                    })}
                    className={`w-full bg-white/3 border rounded-[13px] px-4 py-3 text-[14px] text-slate-100 outline-none transition-all appearance-none cursor-pointer
                      ${
                        errors.bookId
                          ? "border-rose-500/50"
                          : "border-white/[0.07] focus:border-teal-500/40 focus:bg-teal-500/2"
                      }`}>
                    <option
                      value=""
                      disabled
                      className="bg-[#0d1117] text-slate-500">
                      — Choose a Book —
                    </option>
                    {availableBooks.length === 0 ? (
                      <option disabled className="bg-[#0d1117] text-slate-500">
                        No books available in stock
                      </option>
                    ) : (
                      availableBooks.map((b) => (
                        <option
                          key={b._id}
                          value={b._id}
                          className="bg-[#0d1117]">
                          {b.title} — Available: {b.available}
                        </option>
                      ))
                    )}
                  </select>
                  {errors.bookId && (
                    <p className="text-rose-400 text-[11px] mt-1.5">
                      {errors.bookId.message}
                    </p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 py-3 rounded-xl bg-white/4 border border-white/8 text-slate-400 hover:bg-white/8 text-[13px] font-semibold transition-all">
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      availableBooks.length === 0 ||
                      branchStudents.length === 0
                    }
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-[14px] text-[#080c10] disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                    style={{
                      background: "linear-gradient(135deg, #14b8a6, #84cc16)",
                    }}>
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />{" "}
                        Processing...
                      </>
                    ) : (
                      "📖 Issue Book"
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default IssueBookModal;
