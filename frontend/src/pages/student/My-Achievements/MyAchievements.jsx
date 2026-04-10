import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Crown, Flame, Lock, Star, Trophy, Zap } from "lucide-react";
import { useSelector } from "react-redux";
import api from "../../../utils/api";
import BadgeCard from "./BadgeCard";
import { Helmet } from "react-helmet-async";

const ALL_BADGES_TEMPLATE = [
  {
    id: "first_step",
    title: "First Step 🌟",
    description: "Marked your very first attendance.",
    icon: "⭐",
    iconClass: "bg-amber-400/10 border-amber-400/20 text-amber-400",
    progressTarget: 1,
  },
  {
    id: "7_days",
    title: "7 Days Streak 🔥",
    description: "Attended for 7 consecutive days!",
    icon: "🔥",
    iconClass: "bg-rose-400/10 border-rose-400/20 text-rose-400",
    progressTarget: 7,
  },
  {
    id: "15_days",
    title: "Consistency King 👑",
    description: "Maintain a 15-day streak to unlock.",
    icon: "👑",
    iconClass: "bg-violet-400/10 border-violet-400/20 text-violet-400",
    progressTarget: 15,
  },
  {
    id: "monthly_champ",
    title: "Monthly Champ 🏆",
    description: "100% attendance in a single month.",
    icon: "🏆",
    iconClass: "bg-teal-400/10 border-teal-400/20 text-teal-400",
    progressTarget: 30,
  },
];

const RANK_STYLES = [
  "bg-amber-400/15 text-amber-400",
  "bg-slate-300/10 text-slate-300",
  "bg-amber-700/15 text-amber-700",
];

const MEDALS = ["🥇", "🥈", "🥉"];

const MyAchievements = () => {
  const { user } = useSelector((state) => state.auth);

  const [topRankers, setTopRankers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [myStats, setMyStats] = useState({
    currentStreak: 0,
    highestStreak: 0,
    totalBadges: 0,
  });
  const [badgesList, setBadgesList] = useState(
    ALL_BADGES_TEMPLATE.map((b) => ({ ...b, unlocked: false })),
  );

  const fetchLeaderboard = useCallback(async () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const response = await api.get("/attendance/leaderboard", {
      params: { year, month, limit: 3 },
      withCredentials: true,
    });
    if (response.data.leaderboard) setTopRankers(response.data.leaderboard);
  }, []);

  const fetchMyAchievements = useCallback(async () => {
    const res = await api.get("/achievements/student");
    if (res.data.success) {
      const unlockedBadges = res.data.achievements;
      setMyStats((prev) => ({ ...prev, totalBadges: unlockedBadges.length }));
      setBadgesList(
        ALL_BADGES_TEMPLATE.map((template) => {
          const found = unlockedBadges.find((b) => b.title === template.title);
          return found
            ? {
                ...template,
                unlocked: true,
                date: new Date(found.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
              }
            : { ...template, unlocked: false };
        }),
      );
    }
  }, []);

  const fetchMyStreak = useCallback(async () => {
    const res = await api.get("/attendance/streak/me");
    if (res.data.success) {
      setMyStats((prev) => ({
        ...prev,
        currentStreak: res.data.currentStreak,
        highestStreak: res.data.highestStreak,
      }));
    }
  }, []);

  useEffect(() => {
    if (!user?._id) return;
    setIsLoading(true);
    setError(null);
    Promise.all([fetchLeaderboard(), fetchMyAchievements(), fetchMyStreak()])
      .catch(() => setError("Failed to load achievements. Please try again."))
      .finally(() => setIsLoading(false));
  }, [user?._id, fetchLeaderboard, fetchMyAchievements, fetchMyStreak]);

  const myRank = topRankers.findIndex((r) => r.studentId === user?._id);

  return (
    <div className="p-4 sm:p-8 w-full max-w-6xl mx-auto">
      {/* helmet */}
      <Helmet>
        <title>My Achievement | MYWA</title>
      </Helmet>
      {/* Eyebrow */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] font-semibold tracking-widest uppercase mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          MYWA · Student Achievement
        </div>
      </div>
      {/* header */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent mb-2"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #f0fdf4 0%, #14b8a6 50%, #84cc16 100%)",
          }}>
          My Achievements
        </motion.h1>
        <p className="text-slate-500 text-[15px]">
          Unlock badges, build streaks, and top the leaderboard!
        </p>
      </div>

      {/* STATS PILLS */}
      {!isLoading && (
        <div className="flex flex-wrap gap-3 mb-10">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.07] text-[13px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <strong className="text-slate-200">
              {myStats.currentStreak}
            </strong>{" "}
            Day Streak
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.07] text-[13px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <strong className="text-slate-200">
              {myStats.totalBadges}
            </strong>{" "}
            Badges Unlocked
          </div>
          {myRank !== -1 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.07] text-[13px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-violet-400" />
              <strong className="text-slate-200">#{myRank + 1}</strong> This
              Month
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-red-400 text-sm text-center py-4 mb-6">{error}</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-5">
          {/* STREAK CARD */}
          {isLoading ? (
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 h-[180px] animate-pulse" />
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-[20px] p-px"
              style={{
                background:
                  "linear-gradient(135deg, rgba(251,113,133,0.35), rgba(255,255,255,0.04), rgba(249,115,22,0.2))",
              }}>
              <div className="bg-[#0d1117] rounded-[19px] p-6 relative overflow-hidden">
                {/* Glow */}
                <div
                  className="absolute top-[-60px] right-[-60px] w-48 h-48 rounded-full pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(251,113,133,0.12), transparent 70%)",
                  }}
                />
                {/* Mesh */}
                <div
                  className="absolute bottom-0 right-0 w-28 h-28 pointer-events-none rounded-br-[19px]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
                    backgroundSize: "14px 14px",
                  }}
                />

                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="w-12 h-12 rounded-[14px] bg-rose-400/10 border border-rose-400/20 flex items-center justify-center text-2xl">
                    🔥
                  </div>
                  <div>
                    <p className="text-[11px] font-bold tracking-widest uppercase text-rose-400/80 mb-1">
                      Current Streak
                    </p>
                    <div
                      className="text-4xl font-extrabold bg-clip-text text-transparent"
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, #fb7185, #f97316)",
                      }}>
                      {myStats.currentStreak} Days
                    </div>
                  </div>
                </div>

                <div className="relative z-10 flex justify-between items-center pt-4 border-t border-white/[0.06]">
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-slate-600 mb-1">
                      Highest Streak
                    </p>
                    <p className="text-[13px] font-bold text-slate-200">
                      {myStats.highestStreak} Days 🏅
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-slate-600 mb-1">
                      Total Badges
                    </p>
                    <p className="text-[13px] font-bold text-teal-400">
                      {myStats.totalBadges} / {ALL_BADGES_TEMPLATE.length}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* LEADERBOARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="relative rounded-[20px] p-px"
            style={{
              background:
                "linear-gradient(135deg, rgba(20,184,166,0.25), rgba(255,255,255,0.04), rgba(132,204,22,0.12))",
            }}>
            <div className="bg-[#0d1117] rounded-[19px] p-6">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-[16px] font-bold text-slate-100 flex items-center gap-2">
                  👑 Top Rankers
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/5 text-slate-500">
                  This Month
                </span>
              </div>

              <div className="space-y-2">
                {isLoading ? (
                  [1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-12 rounded-xl bg-white/3 animate-pulse"
                    />
                  ))
                ) : topRankers.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">
                    No data this month yet.
                  </p>
                ) : (
                  topRankers.map((ranker, i) => {
                    const isMe = ranker.studentId === user?._id;
                    return (
                      <div
                        key={ranker.studentId}
                        className={`flex items-center justify-between px-3.5 py-3 rounded-[14px] border transition-all
                            ${isMe ? "bg-teal-500/6 border-teal-500/20" : "bg-white/3 border-transparent"}`}>
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-[13px] font-extrabold shrink-0 ${RANK_STYLES[i] || "bg-white/5 text-slate-500"}`}>
                            {i + 1}
                          </div>
                          <span
                            className={`text-[13px] font-medium ${isMe ? "text-teal-400 font-bold" : "text-slate-200"}`}>
                            {isMe
                              ? `${ranker.userName} (You)`
                              : ranker.userName}
                            {MEDALS[i] && (
                              <span className="ml-1">{MEDALS[i]}</span>
                            )}
                          </span>
                        </div>
                        <span
                          className={`text-[12px] font-bold ${isMe ? "text-teal-400" : "text-slate-500"}`}>
                          {ranker.presentCount} Days
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT — BADGES CABINET */}
        <div className="bg-[#0d1117] border border-white/6 rounded-[20px] p-6 sm:p-7">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[20px] font-extrabold text-slate-100 flex items-center gap-2">
              ⚡ Badges Cabinet
            </h2>
            <span className="text-[12px] font-bold px-3.5 py-1.5 rounded-full bg-teal-400/8 border border-teal-400/20 text-teal-400">
              {myStats.totalBadges} / {ALL_BADGES_TEMPLATE.length} Unlocked
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-[120px] rounded-2xl bg-white/[0.03] animate-pulse"
                />
              ))}
            </div>
          ) : (
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.08 } },
              }}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {badgesList.map((badge) => (
                <BadgeCard
                  key={badge.id}
                  badge={badge}
                  currentStreak={myStats.currentStreak}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAchievements;
