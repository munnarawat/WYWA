import { motion } from "framer-motion";
import { Loader2, Trophy } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../../utils/api";

const RANK_STYLES = [
  {
    cardGradient:
      "linear-gradient(135deg, rgba(251,191,36,0.3), rgba(255,255,255,0.04), rgba(245,158,11,0.15))",
    avatarClass: "bg-amber-400/15 border-amber-400/30 text-amber-400",
    rankGradient: "linear-gradient(135deg, #fbbf24, #f97316)",
    medal: "🥇",
  },
  {
    cardGradient:
      "linear-gradient(135deg, rgba(203,213,225,0.2), rgba(255,255,255,0.04))",
    avatarClass: "bg-slate-300/10 border-slate-300/25 text-slate-300",
    rankGradient: "linear-gradient(135deg, #cbd5e1, #94a3b8)",
    medal: "🥈",
  },
  {
    cardGradient:
      "linear-gradient(135deg, rgba(180,83,9,0.2), rgba(255,255,255,0.04))",
    avatarClass: "bg-amber-700/15 border-amber-700/30 text-amber-700",
    rankColor: "#d97706",
    medal: "🥉",
  },
];

const LeaderboardTab = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const fetchLeaderboard = async (data) => {
    const [year, month] = data.month.split("-");
    try {
      setIsLoading(true);
      const res = await api.get(
        `/attendance/leaderboard?year=${year}&month=${parseInt(month)}&limit=10`,
      );
      setLeaderboardData(res.data.leaderboard || []);
    } catch (err) {
      toast.error("Failed to fetch leaderboard");
      setLeaderboardData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Section title */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-[11px] bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-base">
          🏆
        </div>
        <h2 className="text-[17px] font-bold text-slate-100">
          Monthly Leaderboard
        </h2>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <span className="text-[10px] font-bold tracking-widest uppercase text-slate-600 whitespace-nowrap">
          Select month to see top performers
        </span>
        <div className="flex-1 h-px bg-white/5" />
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(fetchLeaderboard)}
        className="flex gap-3 flex-wrap mb-6">
        <input
          type="month"
          {...register("month", { required: true })}
          className="flex-1 max-w-[220px] bg-white/3 border border-white/[0.07] rounded-[13px] px-4 py-3 text-[14px] text-slate-100 outline-none transition-all scheme-dark focus:border-amber-400/40 "
        />
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 px-5 py-3 rounded-[13px] border border-amber-400/20 bg-amber-400/8 text-amber-400 hover:bg-amber-400/15 text-[13px] font-bold transition-colors disabled:opacity-50">
          {isSubmitting ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Trophy size={15} />
          )}
          Get Ranks
        </motion.button>
      </form>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-18 rounded-2xl bg-white/4"
              style={{ animationDelay: `${i * 0.07}s` }}
            />
          ))}
        </div>
      )}

      {/* Leaderboard list */}
      {!isLoading && leaderboardData.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col gap-2">
          {leaderboardData.map((student, i) => {
            const style = RANK_STYLES[i] || null;
            const isTop3 = i < 3;

            return (
              <motion.div
                key={student.studentId}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, type: "spring", stiffness: 280 }}
                whileHover={{ x: 5 }}
                className="relative rounded-2xl p-px"
                style={{
                  background: isTop3
                    ? style.cardGradient
                    : "linear-gradient(135deg, rgba(20,184,166,0.12), rgba(255,255,255,0.04))",
                }}>
                <div className="bg-[#0d1117] rounded-[15px] px-4 py-3.5 flex items-center justify-between gap-3 relative overflow-hidden">
                  {/* Mesh */}
                  <div
                    className="absolute bottom-0 right-0 w-14 h-14 pointer-events-none rounded-br-[15px]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
                      backgroundSize: "8px 8px",
                    }}
                  />

                  <div className="flex items-center gap-3">
                    {/* Rank */}
                    {isTop3 ? (
                      <span
                        className="text-[20px] font-extrabold w-8 text-center leading-none"
                        style={
                          style.rankGradient
                            ? {
                                backgroundImage: style.rankGradient,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                              }
                            : { color: style.rankColor }
                        }>
                        {i + 1}
                      </span>
                    ) : (
                      <span className="text-[13px] font-bold text-slate-600 w-8 text-center">
                        #{i + 1}
                      </span>
                    )}

                    {/* Avatar */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-extrabold shrink-0 border
                        ${isTop3 ? style.avatarClass : "bg-white/6 border-white/12 text-slate-400"}`}>
                      {student.userName?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="text-[13px] font-bold text-slate-200 capitalize">
                        {student.userName} {isTop3 ? style.medal : ""}
                      </p>
                      <p className="text-[11px] text-slate-600">
                        {student.email}
                      </p>
                    </div>
                  </div>

                  {/* Days count */}
                  <div className="text-right shrink-0">
                    <p
                      className="text-[24px] font-extrabold leading-none"
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, #14b8a6, #84cc16)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}>
                      {student.presentCount}
                    </p>
                    <p className="text-[9px] font-bold tracking-widest uppercase text-slate-600 mt-0.5">
                      Days
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Empty */}
      {!isLoading && leaderboardData.length === 0 && (
        <div className="flex flex-col items-center justify-center py-14 text-slate-600 border border-dashed border-white/8 rounded-2xl gap-3 mt-2">
          <Trophy size={36} className="opacity-40" />
          <p className="text-[13px]">
            Select a month to see the top performers.
          </p>
        </div>
      )}
    </div>
  );
};

export default LeaderboardTab;
