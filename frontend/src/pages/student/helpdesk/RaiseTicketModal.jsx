import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Send, X } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../../utils/api";

const RaiseTicketModal = ({ isOpen, onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // Escape key close
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

  const onSubmit = async (data) => {
    const toastId = toast.loading("Raising your ticket...");
    try {
      const res = await api.post("/ticket/create", data);
      if (res.data.success) {
        toast.success(res.data.message || "Ticket raised! 🛠️", { id: toastId });
        reset();
        onClose();
        onSuccess?.();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to raise ticket", {
        id: toastId,
      });
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
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-125 rounded-[22px] p-px z-10"
            style={{
              background:
                "linear-gradient(135deg, rgba(20,184,166,0.35), rgba(255,255,255,0.05), rgba(132,204,22,0.2))",
            }}>
            <div className="bg-[#0d1117] rounded-[21px] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/6 bg-white/2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[11px] bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-base">
                    🛟
                  </div>
                  <h2 className="text-[18px] font-bold text-slate-100">
                    Raise a Ticket
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  aria-label="Close modal"
                  className="w-8 h-8 rounded-[9px] bg-white/5 border border-white/8 flex items-center justify-center text-slate-500 hover:bg-teal-500/10 hover:border-teal-500/25 hover:text-teal-400 transition-colors">
                  <X size={15} />
                </motion.button>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-6 flex flex-col gap-4">
                <p className="text-[13px] text-slate-500">
                  Describe your issue clearly so admin can help you faster.
                </p>

                {/* Title */}
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-600 mb-2">
                    Issue Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="E.g. Library AC not working"
                    className={`w-full bg-white/3 border rounded-[13px] px-4 py-3 text-[14px] text-slate-100 placeholder:text-slate-700 outline-none transition-all 
                      ${
                        errors.title
                          ? "border-rose-500/50 focus:border-rose-500"
                          : "border-white/[0.07] focus:border-teal-500/40 focus:bg-teal-500/2"
                      }`}
                    {...register("title", { required: "Title is required" })}
                  />
                  {errors.title && (
                    <p className="text-rose-400 text-[11px] mt-1.5 ml-0.5">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-600 mb-2">
                    Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Explain the problem in detail..."
                    className={`w-full bg-white/3 border rounded-[13px] px-4 py-3 text-[14px] text-slate-100 placeholder:text-slate-700 outline-none transition-all resize-none 
                      ${
                        errors.description
                          ? "border-rose-500/50 focus:border-rose-500"
                          : "border-white/[0.07] focus:border-teal-500/40 focus:bg-teal-500/2"
                      }`}
                    {...register("description", {
                      required: "Description is required",
                      minLength: {
                        value: 10,
                        message: "At least 10 characters required",
                      },
                    })}
                  />
                  {errors.description && (
                    <p className="text-rose-400 text-[11px] mt-1.5 ml-0.5">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[13px] font-bold text-[14px] text-[#080c10] disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
                  style={{
                    background: "linear-gradient(135deg, #14b8a6, #84cc16)",
                  }}>
                  {isSubmitting ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />{" "}
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={17} /> Submit Ticket
                    </>
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

export default RaiseTicketModal;
