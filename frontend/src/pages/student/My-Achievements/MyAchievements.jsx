import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Flame,
  Star,
  Lock,
  Crown,
  CalendarCheck,
  Zap,
} from "lucide-react";
import SpotlightCard from "../../../ReactBits/SpotlightCard";
import { useSelector } from "react-redux";
import api from "../../../utils/api";

const ALL_BADGES_TEMPLATE = [
  {
    id: "first_step",
    title: "First Step 🌟",
    description: "Marked your very first attendance.",
    icon: Star,
    color: "from-yellow-400 to-amber-600",
  },
  {
    id: "7_days",
    title: "7 Days Streak 🔥",
    description: "You attended the library for 7 consecutive days!",
    icon: Flame,
    color: "from-rose-400 to-red-600",
  },
  {
    id: "15_days",
    title: "Consistency King 👑",
    description: "Maintained a 15-day streak.",
    icon: Crown,
    color: "from-violet-400 to-purple-600",
  },
  {
    id: "monthly_champ",
    title: "Monthly Champ 🏆",
    description: "100% attendance in a single month.",
    icon: Trophy,
    color: "from-teal-400 to-emerald-600",
  },
];
const MyAchievements = () => {
  const { user } = useSelector((state) => state.auth);

  const [topRankers, setTopRankers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [myStats, setMyStats] = useState({
    currentStreak: 5,
    highestStreak: 12,
    totalBadges: 2,
  });

  const [badgesList, setBadgesList] = useState(
    ALL_BADGES_TEMPLATE.map((b) => ({ ...b, unlocked: false })),
  );
  useEffect(() => {
    const loadAllData = async () => {
      if (!user?._id) return;
      setIsLoading(true);

      const fetchLeaderboard = async () => {
        try {
          const currentDate = new Date();
          const year = currentDate.getFullYear();
          const month = currentDate.getMonth();

          const response = await api.get("/attendance/leaderboard", {
            params: { year, month, limit: 3 },
            withCredentials: true,
          });
          if (response.data.leaderboard) {
            setTopRankers(response.data.leaderboard);
          }
        } catch (error) {
          console.error("Failed to fetch leaderboard", error);
        }
      };

      const fetchMyAchievements = async () => {
        try {
          const res = await api.get("/achievements/student");
          if (res.data.success) {
            const unlockedBadges = res.data.achievements;
            // Total badges update karo
            setMyStats((prev) => ({
              ...prev,
              totalBadges: unlockedBadges.length,
            }));

            const mergedBadges = ALL_BADGES_TEMPLATE.map((templateBadge) => {
              const foundInDb = unlockedBadges.find(
                (b) => b.title === templateBadge.title,
              );

              if (foundInDb) {
                return {
                  ...templateBadge,
                  unlocked: true,
                  date: new Date(foundInDb.createdAt).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric", year: "numeric" },
                  ),
                };
              }
              return { ...templateBadge, unlocked: false };
            });

            setBadgesList(mergedBadges);
          }          
        } catch (error) {
          console.error("Failed to fetch achievements", error);
        }
      };

      const fetchMyStreak = async () => {
        try {
          const res = await api.get("/attendance/streak/me");
          if (res.data.success) {
            setMyStats((prev) => ({
              ...prev,
              currentStreak: res.data.currentStreak,
              highestStreak: res.data.highestStreak,
            }));
          }
        } catch (error) {
          console.error("Failed to fetch streaks", error);
        }
      };
      await Promise.all([
        fetchLeaderboard(),
        fetchMyAchievements(),
        fetchMyStreak(),
      ]);
      setIsLoading(false);
    };
    loadAllData();
  }, [user]);

  // animation  variant
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } },
  };
  return (
    <div className="p-4 sm:p-8 w-full max-w-6xl mx-auto">
      {/* 🌟 PAGE HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
          <Trophy className="text-yellow-400" size={32} />
          My Achievements
        </h1>
        <p className="text-zinc-400 mt-2 text-sm sm:text-base">
          Unlock badges, build streaks, and top the leaderboard!
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Streaks & Leaderboard */}
        {/* 🟢 LEFT COLUMN: Streaks & Leaderboard  */}
        <div className="space-y-6">
          {/* STREAK CARD */}
          {isLoading ? (
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 h[160px] animate-pulse flex flex-col justify-between">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-zinc-800 rounded-xl" />
                <div className="space-y-2 py-1">
                  <div className="w-24 h-4 bg-zinc-800 rounded" />
                  <div className="w-32 h-8 bg-zinc-800 rounded" />
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
                <div className="w-24 h-3 bg-zinc-800 rounded" />
                <div className="w-16 h-4 bg-zinc-800 rounded" />
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-zinc-900/60 border border-rose-500/20 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-[50px] rounded-full pointer-events-none" />

              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20">
                  <Flame className="text-rose-500" size={24} />
                </div>
                <div>
                  <p className="text-zinc-400 text-sm font-medium">
                    Current Streak
                  </p>
                  <h2 className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-rose-400 to-orange-500">
                    {myStats.currentStreak} Days
                  </h2>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
                  Highest Streak
                </span>
                <span className="text-sm text-zinc-300 font-bold">
                  {myStats.highestStreak} Days
                </span>
              </div>
            </motion.div>
          )}

          {/* MINI LEADERBOARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900/60 border border-teal-500/20 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-white font-bold flex items-center gap-2">
                <Crown className="text-teal-400" size={18} /> Top Rankers
              </h3>
              <span className="text-xs font-mono text-zinc-500 bg-white/5 px-2 py-1 rounded-md">
                This Month
              </span>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                // 🟢 LEADERBOARD SKELETON
                [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-3 rounded-xl border border-transparent bg-zinc-800/30 animate-pulse">
                    <div className="flex gap-3 items-center w-full">
                      <div className="w-5 h-5 bg-zinc-700 rounded" />
                      <div className="w-32 h-4 bg-zinc-700 rounded" />
                    </div>
                    <div className="w-12 h-4 bg-zinc-700 rounded" />
                  </div>
                ))
              ) : topRankers.length === 0 ? (
                <p className="text-sm text-zinc-500 text-center py-4">
                  No data this month yet.
                </p>
              ) : (
                topRankers.map((ranker, index) => {
                  const isMe = ranker.studentId === user?._id;
                  return (
                    <div
                      key={ranker.studentId}
                      className={`flex items-center justify-between p-3 rounded-xl border ${isMe ? "bg-teal-500/10 border-teal-500/20" : "bg-white/5 border-transparent"}`}>
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-bold w-5 text-center ${index === 0 ? "text-yellow-400" : index === 1 ? "text-gray-300" : index === 2 ? "text-amber-600" : "text-zinc-500"}`}>
                          #{index + 1}
                        </span>
                        <span
                          className={`text-sm font-medium ${isMe ? "text-teal-400 font-bold" : "text-zinc-200"}`}>
                          {isMe ? `${ranker.userName} (You)` : ranker.userName}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-zinc-400">
                        {ranker.presentCount} Days
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>

        {/* 🟢 RIGHT COLUMN: Badges Cabinet (Takes 2 columns on large screens) */}
        <div className="lg:col-span-2 bg-zinc-900/40 border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap className="text-yellow-400" size={20} />
              Badges Cabinet
            </h2>
            <span className="text-sm font-medium text-zinc-400 bg-white/5 px-3 py-1 rounded-full">
              {myStats.totalBadges} Unlocked
            </span>
          </div>
          {isLoading ? (
            // 🟢 BADGES SKELETON
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50 flex gap-4 items-start animate-pulse">
                  <div className="w-12 h-12 bg-zinc-800 rounded-full shrink-0" />
                  <div className="flex-1 space-y-3 py-1">
                    <div className="w-3/4 h-5 bg-zinc-800 rounded" />
                    <div className="space-y-2">
                      <div className="w-full h-3 bg-zinc-800 rounded" />
                      <div className="w-5/6 h-3 bg-zinc-800 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {badgesList.map((badge) => (
                <motion.div key={badge.id} variants={itemVariants}>
                  <SpotlightCard
                    spotlightColor={
                      badge.unlocked
                        ? "rgba(20, 184, 166, 0.2)"
                        : "rgba(255, 255, 255, 0.05)"
                    }
                    className={`h-full p-5 rounded-xl border transition-all duration-300 group ${
                      badge.unlocked
                        ? "bg-zinc-900/80 border-white/10 hover:border-white/20 hover:shadow-lg"
                        : "bg-zinc-950/50 border-white/5 opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
                    }`}>
                    <div className="flex gap-4 items-start">
                      {/* Badge Icon */}
                      <div
                        className={`shrink-0 p-3 rounded-full border ${badge.unlocked ? `bg-linear-to-br ${badge.color} bg-opacity-10 border-white/20` : "bg-white/5 border-white/10"}`}>
                        <badge.icon
                          size={24}
                          className={
                            badge.unlocked
                              ? "text-white drop-shadow-md"
                              : "text-zinc-500"
                          }
                        />
                      </div>
                      {/* Badge Info */}
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-zinc-100 mb-1 flex items-center justify-between">
                          {badge.title}
                          {!badge.unlocked && (
                            <Lock size={14} className="text-zinc-600" />
                          )}
                        </h3>
                        <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                          {badge.description}
                        </p>
                        {badge.unlocked ? (
                          <span className="inline-block text-[10px] font-mono font-bold text-teal-400 bg-teal-400/10 px-2 py-1 rounded">
                            Unlocked on {badge.date}
                          </span>
                        ) : (
                          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-zinc-700 h-full w-1/3 rounded-full" />
                          </div>
                        )}
                      </div>
                    </div>
                  </SpotlightCard>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAchievements;
