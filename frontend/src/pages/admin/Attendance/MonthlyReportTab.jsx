import { motion } from "framer-motion";
import { BarChart3, CheckCircle, Loader2, Search, XCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../../utils/api";

// Mini stat card
const StatCard = ({ label, value, gradient, color }) => (
  <div
    className="relative rounded-[14px] p-[1px]"
    style={{ background: gradient }}>
    <div className="bg-[#0d1117] rounded-[13px] py-3.5 px-4 text-center relative overflow-hidden">
      <div
        className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none rounded-br-[13px]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "8px 8px",
        }}
      />
      <p className="text-[10px] font-bold tracking-widest uppercase text-slate-600 mb-1.5">
        {label}
      </p>
      <p className="text-[26px] font-extrabold leading-none" style={{ color }}>
        {value}
      </p>
    </div>
  </div>
);

const MonthlyReportTab = ({ students = [] }) => {
  const [monthlyData, setMonthlyData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onViewAttendance = async (data) => {
    const [year, month] = data.month.split("-");
    try {
      setIsLoading(true);
      const res = await api.get(
        `/attendance/monthly?studentId=${data.studentId}&year=${year}&month=${parseInt(month)}`,
      );
      setMonthlyData(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch attendance");
      setMonthlyData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Section title */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-[11px] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-base">
          📅
        </div>
        <h2 className="text-[17px] font-bold text-slate-100">
          Student Monthly Report
        </h2>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <span className="text-[10px] font-bold tracking-widest uppercase text-slate-600 whitespace-nowrap">
          Select student and month
        </span>
        <div className="flex-1 h-px bg-white/5" />
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onViewAttendance)}
        className="flex gap-3 flex-wrap mb-6">
        <div className="flex-2 min-w-45">
          <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-600 mb-2">
            Student <span className="text-rose-500">*</span>
          </label>
          <select
            {...register("studentId", { required: true })}
            className="w-full bg-white/3 border border-white/[0.07] rounded-[13px] px-4 py-3 text-[14px] text-slate-100 outline-none transition-all appearance-none cursor-pointer focus:border-teal-500/40 ">
            <option value="" disabled className="bg-[#0d1117] text-slate-500">
              — Choose a Student —
            </option>
            {students.map((s) => (
              <option key={s._id} value={s._id} className="bg-[#0d1117]">
                {s.fullName?.firstName
                  ? `${s.fullName.firstName} ${s.fullName.lastName || ""}`.trim()
                  : s.userName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-35">
          <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-600 mb-2">
            Month <span className="text-rose-500">*</span>
          </label>
          <input
            type="month"
            {...register("month", { required: true })}
            className="w-full bg-white/3 border border-white/[0.07] rounded-[13px] px-4 py-3 text-[14px] text-slate-100 outline-none transition-all scheme-dark focus:border-teal-500/40"
          />
        </div>

        <div className="flex items-end">
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 px-5 py-3 rounded-[13px] border border-teal-500/20 bg-teal-500/8 text-teal-400 hover:bg-teal-500/15 text-[13px] font-bold transition-colors disabled:opacity-50">
            {isSubmitting ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Search size={15} />
            )}
            Get Data
          </motion.button>
        </div>
      </form>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4 animate-pulse">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 rounded-[14px] bg-white/4" />
            ))}
          </div>
          <div className="h-64 rounded-2xl bg-white/3" />
        </div>
      )}

      {/* Data */}
      {!isLoading && monthlyData && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-5">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              label="Total Days"
              value={monthlyData.summary.totalDays}
              gradient="linear-gradient(135deg,rgba(20,184,166,.2),rgba(255,255,255,.04))"
              color="#94a3b8"
            />
            <StatCard
              label="Present"
              value={monthlyData.summary.presentDay}
              gradient="linear-gradient(135deg,rgba(52,211,153,.2),rgba(255,255,255,.04))"
              color="#34d399"
            />
            <StatCard
              label="Absent"
              value={monthlyData.summary.absentDay}
              gradient="linear-gradient(135deg,rgba(251,113,133,.2),rgba(255,255,255,.04))"
              color="#fb7185"
            />
            <StatCard
              label="Percentage"
              value={`${monthlyData.summary.percentage}%`}
              gradient="linear-gradient(135deg,rgba(132,204,22,.2),rgba(255,255,255,.04))"
              color="#a3e635"
            />
          </div>

          {/* Records table */}
          {monthlyData.records.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-slate-600 border border-dashed border-white/8 rounded-2xl gap-3">
              <BarChart3 size={36} className="opacity-40" />
              <p className="text-[13px]">No records found for this month.</p>
            </div>
          ) : (
            <div
              className="relative rounded-2xl p-px"
              style={{
                background:
                  "linear-gradient(135deg,rgba(20,184,166,.15),rgba(255,255,255,.04))",
              }}>
              <div className="bg-[#0d1117] rounded-[15px] overflow-hidden">
                <table className="w-full border-collapse text-[13px]">
                  <thead>
                    <tr
                      className="border-b border-white/5"
                      style={{ background: "rgba(255,255,255,0.02)" }}>
                      <th className="px-5 py-3.5 text-left text-[10px] font-bold tracking-widest uppercase text-slate-600">
                        Date
                      </th>
                      <th className="px-5 py-3.5 text-right text-[10px] font-bold tracking-widest uppercase text-slate-600">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyData.records.map((rec) => (
                      <motion.tr
                        key={rec._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-white/[0.035] last:border-none hover:bg-white/2 transition-colors">
                        <td className="px-5 py-3 text-slate-400">
                          {new Date(rec.date).toLocaleDateString("en-IN", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold tracking-wider uppercase
                              ${
                                rec.status === "present"
                                  ? "bg-emerald-400/8 border-emerald-400/20 text-emerald-400"
                                  : "bg-rose-400/8 border-rose-400/20 text-rose-400"
                              }`}>
                            {rec.status === "present" ? (
                              <>
                                <CheckCircle size={11} /> Present
                              </>
                            ) : (
                              <>
                                <XCircle size={11} /> Absent
                              </>
                            )}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Empty */}
      {!isLoading && !monthlyData && (
        <div className="flex flex-col items-center justify-center py-14 text-slate-600 border border-dashed border-white/8 rounded-2xl gap-3 mt-2">
          <BarChart3 size={36} className="opacity-40" />
          <p className="text-[13px]">
            Select a student and month to view their report.
          </p>
        </div>
      )}
    </div>
  );
};

export default MonthlyReportTab;
