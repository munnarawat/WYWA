import { motion } from "framer-motion";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../../utils/api";

const MarkAttendanceTab = ({ students = [] }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      status: "present",
    },
  });

  const onMarkAttendance = async (data) => {
    const toastId = toast.loading("Marking attendance...");
    try {
      await api.post("/attendance/mark", {
        studentId: data.studentId,
        date: data.date,
        status: data.status,
      });
      toast.success("Attendance marked! 🎉", { id: toastId });
      reset({ date: data.date, status: "present" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to mark attendance", {
        id: toastId,
      });
    }
  };

  return (
    <div>
      {/* Section title */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-[11px] bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-base">
          ✅
        </div>
        <h2 className="text-[17px] font-bold text-slate-100">
          Mark Student Attendance
        </h2>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-[10px] font-bold tracking-widest uppercase text-slate-600 whitespace-nowrap">
          Fill the form below
        </span>
        <div className="flex-1 h-px bg-white/5" />
      </div>

      <form
        onSubmit={handleSubmit(onMarkAttendance)}
        className="flex flex-col gap-4 max-w-120">
        {/* Date */}
        <div>
          <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-600 mb-2">
            Select Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            {...register("date", { required: true })}
            className="w-full bg-white/3 border border-white/[0.07] rounded-[13px] px-4 py-3 text-[14px] text-slate-100 outline-none transition-all scheme-dark focus:border-teal-500/40 focus:bg-teal-500/2 "
          />
        </div>

        {/* Student */}
        <div className=" relative">
          <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-600 mb-2">
            Select Student <span className="text-rose-500">*</span>
          </label>
          <select
            {...register("studentId", { required: true })}
            className="w-full max-w-full bg-white/3 truncate border border-white/[0.07] rounded-[13px] px-4 py-3 text-[14px] text-slate-100 outline-none transition-all appearance-none cursor-pointer focus:border-teal-500/40 focus:bg-teal-500/2 ">
            <option value="" disabled className="bg-[#0d1117] text-slate-500">
              — Choose a Student —
            </option>
            {students.map((s) => {
              const name = s.fullName?.firstName
                ? `${s.fullName.firstName} ${s.fullName.lastName || ""}`.trim()
                : s.userName;

              const fullText = `${name} (${s.email})`;
              const truncatedText =
                fullText.length > 35
                  ? fullText.substring(0, 32) + "..."
                  : fullText;

              return (
                <option key={s._id} value={s._id} className="bg-[#0d1117]">
                  {truncatedText}
                </option>
              );
            })}
          </select>
        </div>

        {/* Status — Radio Cards */}
        <div>
          <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-600 mb-3">
            Status <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                value: "present",
                icon: CheckCircle,
                label: "Present",
                checkedClass:
                  "peer-checked:bg-emerald-400/10 peer-checked:border-emerald-400/30 peer-checked:text-emerald-400",
              },
              {
                value: "absent",
                icon: XCircle,
                label: "Absent",
                checkedClass:
                  "peer-checked:bg-rose-400/10 peer-checked:border-rose-400/30  peer-checked:text-rose-400",
              },
            ].map(({ value, icon: Icon, label, checkedClass }) => (
              <label key={value} className="cursor-pointer">
                <input
                  type="radio"
                  value={value}
                  {...register("status")}
                  className="sr-only peer"
                />
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center  justify-center gap-2 py-3.5 rounded-[13px] border text-[13px] font-semibold transition-all
                    border-white/8 bg-white/3 text-slate-500
                    ${checkedClass}`}>
                  <Icon size={16} />
                  {label}
                </motion.div>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3.5 rounded-[13px] font-bold text-[14px] text-[#080c10] disabled:opacity-50 disabled:cursor-not-allowed transition-opacity mt-1 flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #14b8a6, #84cc16)" }}>
          {isSubmitting ? (
            <>
              <Loader2 size={17} className="animate-spin" /> Saving...
            </>
          ) : (
            "💾 Save Attendance Record"
          )}
        </motion.button>
      </form>
    </div>
  );
};

export default MarkAttendanceTab;
