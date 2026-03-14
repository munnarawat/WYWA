import React, { useState } from "react";
import { Trophy, Loader2, Medal } from "lucide-react";
import { useForm } from "react-hook-form";
import api from "../../../utils/api";
import toast from "react-hot-toast";

const LeaderboardSkeleton = () => (
  <div className="space-y-3 w-full mt-8">
    {[1, 2, 3, 4, 5].map(i => (
      <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5 animate-pulse">
        <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-white/10"></div><div><div className="h-5 w-32 bg-white/20 rounded-md mb-2"></div><div className="h-3 w-48 bg-white/10 rounded-md"></div></div></div>
        <div className="h-8 w-12 bg-white/20 rounded-md"></div>
      </div>
    ))}
  </div>
);

const LeaderboardTab = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const fetchLeaderboard = async (data) => {
    const [year, month] = data.month.split("-");
    try {
      setIsLoading(true);
      const res = await api.get(`/attendance/leaderboard?year=${year}&month=${parseInt(month) - 1}&limit=10`);
      setLeaderboardData(res.data.leaderboard);
    } catch (error) {
      toast.error("Failed to fetch leaderboard");
      setLeaderboardData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2"><Trophy className="text-amber-400"/> Monthly Leaderboard</h2>
      <form onSubmit={handleSubmit(fetchLeaderboard)} className="flex flex-col sm:flex-row gap-4 max-w-lg">
        <div className="flex-1"><input type="month" {...register("month", { required: true })} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-amber-500/50 [color-scheme:dark]" /></div>
        <button type="submit" disabled={isSubmitting} className="py-3 px-6 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 font-medium transition flex items-center justify-center gap-2 min-w-[120px]">
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Trophy size={18} />} Get Ranks
        </button>
      </form>

      {isLoading ? <LeaderboardSkeleton /> : leaderboardData.length > 0 ? (
        <div className="space-y-3 mt-8">
          {leaderboardData.map((student, index) => (
            <div key={student.studentId} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${index === 0 ? 'bg-amber-500/10 border-amber-500/30' : index === 1 ? 'bg-zinc-300/10 border-zinc-300/30' : index === 2 ? 'bg-orange-700/10 border-orange-700/30' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center font-bold text-lg">
                  {index === 0 ? <Medal size={28} className="text-amber-400" /> : index === 1 ? <Medal size={26} className="text-zinc-300" /> : index === 2 ? <Medal size={24} className="text-orange-600" /> : <span className="text-zinc-500">#{index + 1}</span>}
                </div>
                <div><p className="font-bold text-white capitalize">{student.userName}</p><p className="text-xs text-zinc-400">{student.email}</p></div>
              </div>
              <div className="text-right"><p className="text-2xl font-black text-white">{student.presentCount}</p><p className="text-[10px] uppercase tracking-wider text-zinc-500">Days Present</p></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center py-16 text-zinc-600 border border-white/5 border-dashed rounded-xl mt-8">
          <Trophy size={48} className="mb-4 opacity-50" /><p>Select a month to see the top performers.</p>
        </div>
      )}
    </div>
  );
};

export default LeaderboardTab;