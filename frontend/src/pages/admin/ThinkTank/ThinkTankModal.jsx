import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lightbulb } from "lucide-react";
import { useForm } from "react-hook-form";

const ThinkTankModal = ({ isOpen, onClose, onSubmitForm, editingMember }) => {
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm();
  useEffect(() => {
    if (editingMember) {
      setValue("name", editingMember.name);
      setValue("roleOrContribution", editingMember.roleOrContribution);
      setValue("description", editingMember.description || "");
      setValue("contact", editingMember.contact || "");
      setValue("imageUrl", editingMember.imageUrl || "");
    } else {
      reset({ name: "", roleOrContribution: "", description: "", contact: "", imageUrl: "" });
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
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-zinc-900 border border-indigo-500/20 rounded-2xl shadow-2xl p-6 md:p-8 z-10"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white transition bg-white/5 p-2 rounded-full">
              <X size={18} />
            </button>
            
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Lightbulb className="text-indigo-400" />
              {editingMember ? "Edit Member Profile" : "Add Think Tank Member"}
            </h2>

            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Full Name *</label>
                <input type="text" placeholder="e.g. Dr. APJ Abdul Kalam" {...register("name", { required: "Name is required" })} className={`w-full bg-black/20 border ${errors.name ? 'border-rose-500' : 'border-white/10'} rounded-xl py-3 px-4 text-white focus:outline-none focus:border-indigo-500/50`} />
                {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Role/Contribution *</label>
                <input type="text" placeholder="e.g. Chief Technical Advisor" {...register("roleOrContribution", { required: "Role is required" })} className={`w-full bg-black/20 border ${errors.roleOrContribution ? 'border-rose-500' : 'border-white/10'} rounded-xl py-3 px-4 text-white focus:outline-none focus:border-indigo-500/50`} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Profile Image URL</label>
                  <input type="url" placeholder="https://..." {...register("imageUrl")} className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-indigo-500/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Contact Link</label>
                  <input type="text" placeholder="LinkedIn/Email" {...register("contact")} className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-indigo-500/50" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Description</label>
                <textarea rows="3" placeholder="Brief info..." {...register("description")} className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-indigo-500/50 resize-none" />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition font-medium">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 rounded-xl bg-linear-to-r from-indigo-500 to-purple-500 text-white font-bold shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] transition disabled:opacity-50">
                  {isSubmitting ? "Saving..." : (editingMember ? "Update Profile" : "Add Member")}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ThinkTankModal;