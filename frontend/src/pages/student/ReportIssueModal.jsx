import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import api from "../../utils/api";
import toast from "react-hot-toast";
const ReportIssueModal = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const onSubmit = async (data) => {
    try {
      const res = await api.post("/ticket/create", data);

      if (res.data.success) {
        toast.success(res.data.message);
        reset();
        onClose();
      }
    } catch (error) {
      console.error("Submit issue error:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit the issue.",
      );
    }
  };
  const handleClose = () => {
    reset();
    onClose();
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Background Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <AlertCircle className="text-rose-400" size={24} />
                Report an Issue
              </h3>
              <button
                onClick={handleClose}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
              {/* Issue Title Input */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                  Issue Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., AC not working in Zone B"
                  className={`w-full bg-black/40 border rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:bg-white/5 transition-all
                    ${errors.title ? "border-rose-500/50" : "border-white/10 focus:border-rose-500/50"}
                  `}
                  {...register("title", {
                    required: "Issue title is required",
                    maxLength: {
                      value: 50,
                      message: "Title cannot exceed 50 characters",
                    },
                  })}
                />
                {/* 🟢 Error Message Display */}
                {errors.title && (
                  <p className="text-rose-400 text-xs mt-1.5 ml-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Detailed Description Textarea */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                  Detailed Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  placeholder="Please describe the issue in detail..."
                  className={`w-full bg-black/40 border rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:bg-white/5 transition-all resize-none h-32
                    ${errors.description ? "border-rose-500/50" : "border-white/10 focus:border-rose-500/50"}
                  `}
                  {...register("description", {
                    required: "Please provide a description of the issue",
                    minLength: {
                      value: 10,
                      message:
                        "Description must be at least 10 characters long",
                    },
                  })}
                />
                {/* 🟢 Error Message Display */}
                {errors.description && (
                  <p className="text-rose-400 text-xs mt-1.5 ml-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3.5 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2">
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Submit Ticket
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReportIssueModal;
