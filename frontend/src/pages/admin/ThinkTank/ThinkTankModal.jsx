import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Lightbulb,
  User,
  Star,
  Link as LinkIcon,
  AtSign,
  FileText,
  Loader2,
} from "lucide-react";
import { useForm } from "react-hook-form";

const ThinkTankModal = ({ isOpen, onClose, onSubmitForm, editingMember }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (editingMember) {
      setValue("name", editingMember.name);
      setValue("roleOrContribution", editingMember.roleOrContribution);
      setValue("description", editingMember.description || "");
      setValue("contact", editingMember.contact || "");
      setValue("imageUrl", editingMember.imageUrl || "");
    } else {
      reset({
        name: "",
        roleOrContribution: "",
        description: "",
        contact: "",
        imageUrl: "",
      });
    }
  }, [editingMember, isOpen, setValue, reset]);

  const onFormSubmit = async (data) => {
    await onSubmitForm(data, editingMember?._id);
    onClose();
    reset();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl rounded-3xl p-px overflow-hidden z-10"
            style={{
              background:
                "linear-gradient(135deg, rgba(20,184,166,0.5), rgba(255,255,255,0.05), rgba(132,204,22,0.3))",
            }}>
            <div className="bg-[#0a0e14] rounded-[23px] overflow-hidden">
              {/* Header */}
              <div className="relative px-6 py-5 border-b border-white/5 bg-white/2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                    <Lightbulb size={20} />
                  </div>
                  <div>
                    <h2 className="text-[18px] font-bold text-slate-100 leading-tight">
                      {editingMember
                        ? "Edit Member Profile"
                        : "Add Think Tank Member"}
                    </h2>
                    <p className="text-[12px] text-slate-500">
                      Manage core advisors & experts
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 transition-colors">
                  <X size={16} />
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit(onFormSubmit)}
                className="p-6 sm:p-8 space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-[11px] font-bold tracking-widest uppercase text-slate-500 mb-2">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      type="text"
                      placeholder="e.g. Dr. APJ Abdul Kalam"
                      {...register("name", { required: "Name is required" })}
                      className={`w-full bg-[#131920] border rounded-xl py-3 pl-11 pr-4 text-[14px] text-slate-200 placeholder:text-slate-600 outline-none transition-all focus:bg-teal-500/5 ${errors.name ? "border-rose-500/50 focus:border-rose-500" : "border-white/10 focus:border-teal-500/50"}`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-rose-400 text-[11px] mt-1.5">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-[11px] font-bold tracking-widest uppercase text-slate-500 mb-2">
                    Role / Contribution <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Star
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      type="text"
                      placeholder="e.g. Chief Technical Advisor"
                      {...register("roleOrContribution", {
                        required: "Role is required",
                      })}
                      className={`w-full bg-[#131920] border rounded-xl py-3 pl-11 pr-4 text-[14px] text-slate-200 placeholder:text-slate-600 outline-none transition-all focus:bg-teal-500/5 ${errors.roleOrContribution ? "border-rose-500/50 focus:border-rose-500" : "border-white/10 focus:border-teal-500/50"}`}
                    />
                  </div>
                  {errors.roleOrContribution && (
                    <p className="text-rose-400 text-[11px] mt-1.5">
                      {errors.roleOrContribution.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Image URL */}
                  <div>
                    <label className="block text-[11px] font-bold tracking-widest uppercase text-slate-500 mb-2">
                      Profile Image
                    </label>
                    <div className="relative">
                      <LinkIcon
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                      />

                      <input
                        type="file"
                        accept="image/*"
                        placeholder="https://..."
                        {...register("imageUrl")}
                        className="w-full bg-[#131920] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-[14px] text-slate-200 placeholder:text-slate-600 outline-none transition-all focus:bg-teal-500/5 focus:border-teal-500/50"
                      />
                    </div>
                  </div>

                  {/* Contact */}
                  <div>
                    <label className="block text-[11px] font-bold tracking-widest uppercase text-slate-500 mb-2">
                      Contact Link
                    </label>
                    <div className="relative">
                      <AtSign
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                      />
                      <input
                        type="text"
                        placeholder="Insta or Email"
                        {...register("contact")}
                        className="w-full bg-[#131920] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-[14px] text-slate-200 placeholder:text-slate-600 outline-none transition-all focus:bg-teal-500/5 focus:border-teal-500/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[11px] font-bold tracking-widest uppercase text-slate-500 mb-2">
                    Description
                  </label>
                  <div className="relative">
                    <FileText
                      size={16}
                      className="absolute left-4 top-4 text-slate-500"
                    />
                    <textarea
                      rows="3"
                      placeholder="Brief info about their expertise..."
                      {...register("description")}
                      className="w-full bg-[#131920] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-[14px] text-slate-200 placeholder:text-slate-600 outline-none transition-all focus:bg-teal-500/5 focus:border-teal-500/50 resize-none"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/5 mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-[13px] font-bold transition-colors">
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-zinc-950 text-[13px] font-bold shadow-[0_0_20px_rgba(20,184,166,0.3)] disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                    style={{
                      background: "linear-gradient(135deg, #14b8a6, #84cc16)",
                    }}>
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Saving...
                      </>
                    ) : editingMember ? (
                      "Update Profile"
                    ) : (
                      "Add Member"
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

export default ThinkTankModal;
