import React, { useState } from "react";
import { Calendar, Search, Loader2, BarChart3, CheckCircle, XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import api from "../../../utils/api";
import toast from "react-hot-toast";

const ReportSkeleton = () => (
  <div className="space-y-6 w-full mt-8">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 h-24 animate-pulse flex flex-col items-center justify-center">
          <div className="h-3 w-16 bg-white/10 rounded-md mb-2"></div>
          <div className="h-8 w-12 bg-white/20 rounded-md"></div>
        </div>
      ))}
    </div>
    <div className="mt-6 border border-white/10 rounded-xl overflow-hidden animate-pulse">
      <div className="h-12 bg-zinc-900/50 border-b border-white/10"></div>
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-12 border-b border-white/5 bg-white/5 flex justify-between items-center px-6">
          <div className="h-4 w-24 bg-white/10 rounded-md"></div>
          <div className="h-6 w-20 rounded-full bg-white/10"></div>
        </div>
      ))}
    </div>
  </div>
);

const MonthlyReportTab = ({ students }) => {
  const [monthlyData, setMonthlyData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const onViewAttendance = async (data) => {
    const [year, month] = data.month.split("-");
    try {
      setIsLoading(true);
      const res = await api.get(`/attendance/monthly?studentId=${data.studentId}&year=${year}&month=${parseInt(month) - 1}`);
      setMonthlyData(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch attendance");
      setMonthlyData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2"><Calendar className="text-teal-400"/> Student Monthly Report</h2>
      <form onSubmit={handleSubmit(onViewAttendance)} className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <select {...register("studentId", { required: true })} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-teal-500/50 appearance-none">
            <option value="">-- Choose a Student --</option>
            {students.map(s => <option key={s._id} value={s._id} className="bg-zinc-900">{s.fullName?.firstName || s.userName} {s.fullName?.lastName || s.userName}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <input type="month" {...register("month", { required: true })} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-teal-500/50 [color-scheme:dark]" />
        </div>
        <button type="submit" disabled={isSubmitting} className="py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition flex items-center justify-center gap-2 min-w-[120px]">
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />} Get Data
        </button>
      </form>

      {isLoading ? <ReportSkeleton /> : monthlyData ? (
        <div className="space-y-6 mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center"><p className="text-zinc-500 text-sm mb-1">Total Days</p><p className="text-2xl font-bold">{monthlyData.summary.totalDays}</p></div>
            <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-4 text-center"><p className="text-teal-500/70 text-sm mb-1">Present</p><p className="text-2xl font-bold text-teal-400">{monthlyData.summary.presentDay}</p></div>
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-center"><p className="text-rose-500/70 text-sm mb-1">Absent</p><p className="text-2xl font-bold text-rose-400">{monthlyData.summary.absentDay}</p></div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center"><p className="text-zinc-500 text-sm mb-1">Percentage</p><p className="text-2xl font-bold text-lime-400">{monthlyData.summary.percentage}%</p></div>
          </div>
          {monthlyData.records.length > 0 ? (
            <div className="mt-6 border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-900/50 text-zinc-400"><tr><th className="px-6 py-3 font-medium">Date</th><th className="px-6 py-3 font-medium text-right">Status</th></tr></thead>
                <tbody className="divide-y divide-white/10">
                  {monthlyData.records.map((rec) => (
                    <tr key={rec._id} className="hover:bg-white/5">
                      <td className="px-6 py-3">{new Date(rec.date).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</td>
                      <td className="px-6 py-3 text-right">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border uppercase tracking-wider ${rec.status === "present" ? "bg-teal-500/10 text-teal-400 border-teal-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"}`}>
                          {rec.status === "present" ? <CheckCircle size={12} /> : <XCircle size={12} />} {rec.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-zinc-500 border border-white/5 border-dashed rounded-xl">No attendance records found.</div>
          )}
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center py-16 text-zinc-600 border border-white/5 border-dashed rounded-xl mt-8">
          <BarChart3 size={48} className="mb-4 opacity-50" /><p>Select a student and month to view their report.</p>
        </div>
      )}
    </div>
  );
};

export default MonthlyReportTab;