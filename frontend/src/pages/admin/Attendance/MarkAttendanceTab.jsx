import React from "react";
import { CheckCircle, XCircle, UserCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import api from "../../../utils/api";
import toast from "react-hot-toast";

const MarkAttendanceTab = ({ students }) => {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const onMarkAttendance = async (data) => {
    const toastId = toast.loading("Marking attendance...");
    try {
      await api.post("/attendance/mark", {
        studentId: data.studentId,
        date: data.date,
        status: data.status
      });
      toast.success("Attendance marked successfully! 🎉", { id: toastId });
      reset({ date: data.date, status: "present" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark attendance", { id: toastId });
    }
  };

  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
        <UserCheck className="text-teal-400" /> Mark Student Attendance
      </h2>
      <form onSubmit={handleSubmit(onMarkAttendance)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">Select Date *</label>
          <input type="date" defaultValue={new Date().toISOString().split('T')[0]} {...register("date", { required: true })} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-teal-500/50 [color-scheme:dark]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">Select Student *</label>
          <select {...register("studentId", { required: true })} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-teal-500/50 appearance-none">
            <option value="">-- Choose a Student --</option>
            {students.map(s => <option key={s._id} value={s._id} className="bg-zinc-900">{s.fullName?.firstName || s.userName}{s.fullName?.lastName || s.userName} ({s.email})</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-3">Status *</label>
          <div className="flex gap-4">
            <label className="flex-1 relative cursor-pointer group">
              <input type="radio" value="present" defaultChecked {...register("status")} className="peer sr-only" />
              <div className="flex items-center justify-center gap-2 py-3 border border-white/10 rounded-xl peer-checked:bg-teal-500/20 peer-checked:border-teal-500/50 peer-checked:text-teal-400 text-zinc-400 transition-all"><CheckCircle size={18} /> Present</div>
            </label>
            <label className="flex-1 relative cursor-pointer group">
              <input type="radio" value="absent" {...register("status")} className="peer sr-only" />
              <div className="flex items-center justify-center gap-2 py-3 border border-white/10 rounded-xl peer-checked:bg-rose-500/20 peer-checked:border-rose-500/50 peer-checked:text-rose-400 text-zinc-400 transition-all"><XCircle size={18} /> Absent</div>
            </label>
          </div>
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full mt-4 py-3 rounded-xl bg-linear-to-r from-teal-500 to-lime-500 text-zinc-950 font-bold shadow-lg hover:shadow-teal-500/25 transition disabled:opacity-50">
          {isSubmitting ? "Saving..." : "Save Record"}
        </button>
      </form>
    </div>
  );
};

export default MarkAttendanceTab;