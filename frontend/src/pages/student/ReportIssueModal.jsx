import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Send, X } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../utils/api";

const ReportIssueModal = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // Escape key close
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/ticket/create", data);
      if (res.data.success) {
        toast.success(res.data.message);
        reset();
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit the issue.");
    }
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
            className="absolute inset-0 bg-black/70 backdrop-blur-[8px]"
          />

          {/* Modal box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-120 rounded-[20px] p-px z-10"
            style={{
              background: "linear-gradient(135deg, rgba(251,113,133,0.35), rgba(255,255,255,0.05), rgba(249,115,22,0.2))",
            }}
          >
            <div className="bg-[#0d1117] rounded-[19px] overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/6 bg-white/2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[11px] bg-rose-400/10 border border-rose-400/25 flex items-center justify-center text-base">
                    🚨
                  </div>
                  <h3
                    className="text-[18px] font-bold text-slate-100"
                  >
                    Report an Issue
                  </h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  className="w-8 h-8 rounded-[9px] bg-white/5 border border-white/8 flex items-center justify-center text-slate-500 hover:bg-rose-400/10 hover:border-rose-400/25 hover:text-rose-400 transition-colors"
                >
                  <X size={15} />
                </motion.button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-5">

                {/* Title field */}
                <div>
                  <label className="block text-[11px] font-bold tracking-widest uppercase text-slate-600 mb-2">
                    Issue Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., AC not working in Zone B"
                    className={`w-full bg-white/3 border rounded-xl px-4 py-3 text-[14px] text-slate-100 placeholder:text-slate-700 outline-none transition-all font-['DM_Sans']
                      ${errors.title
                        ? "border-rose-500/50 focus:border-rose-500"
                        : "border-white/8 focus:border-teal-500/40 focus:bg-teal-500/2"
                      }`}
                    {...register("title", {
                      required: "Issue title is required",
                      maxLength: { value: 50, message: "Title cannot exceed 50 characters" },
                    })}
                  />
                  {errors.title && (
                    <p className="text-rose-400 text-[11px] mt-1.5 ml-1">{errors.title.message}</p>
                  )}
                </div>

                {/* Description field */}
                <div>
                  <label className="block text-[11px] font-bold tracking-widest uppercase text-slate-600 mb-2">
                    Detailed Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    placeholder="Please describe the issue in detail..."
                    rows={4}
                    className={`w-full bg-white/3 border rounded-xl px-4 py-3 text-[14px] text-slate-100 placeholder:text-slate-700 outline-none transition-all resize-none font-['DM_Sans']
                      ${errors.description
                        ? "border-rose-500/50 focus:border-rose-500"
                        : "border-white/8 focus:border-teal-500/40 focus:bg-teal-500/2"
                      }`}
                    {...register("description", {
                      required: "Please describe the issue",
                      minLength: { value: 10, message: "Description must be at least 10 characters" },
                    })}
                  />
                  {errors.description && (
                    <p className="text-rose-400 text-[11px] mt-1.5 ml-1">{errors.description.message}</p>
                  )}
                </div>

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[13px] font-bold text-[14px] text-white disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
                  style={{
                    background: "linear-gradient(135deg, #fb7185, #f97316)",
                  }}
                >
                  {isSubmitting ? (
                    <><Loader2 size={17} className="animate-spin" /> Submitting...</>
                  ) : (
                    <><Send size={17} /> Submit Ticket</>
                  )}
                </motion.button>

              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReportIssueModal;