import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import React from 'react'

const BadgeCard = ({ badge, currentStreak }) => {
  const progress = Math.min(
    Math.round((currentStreak / badge.progressTarget) * 100),
    100,
  );
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: {
          opacity: 1,
          y: 0,
          transition: { type: "spring", stiffness: 280 },
        },
      }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="group relative rounded-2xl p-px cursor-pointer"
      style={{
        background: badge.unlocked
          ? "linear-gradient(135deg, rgba(20,184,166,0.35), rgba(255,255,255,0.04), rgba(132,204,22,0.2))"
          : "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
      }}>
      <div
        className={`relative bg-[#0d1117] rounded-[15px] p-5 flex gap-4 items-start overflow-hidden min-h-[110px] transition-all duration-300
          ${!badge.unlocked ? "opacity-55 grayscale-70 group-hover:opacity-85 group-hover:grayscale-0" : ""}`}>
        {/* Glow */}
        {badge.unlocked && (
          <div
            className="absolute top-[-40px] right-[-40px] w-28 h-28 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400"
            style={{
              background:
                "radial-gradient(circle, rgba(20,184,166,0.1), transparent 70%)",
            }}
          />
        )}

        {/* Dot mesh */}
        <div
          className="absolute bottom-0 right-0 w-20 h-20 pointer-events-none rounded-br-[15px]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "10px 10px",
          }}
        />

        {/* Icon */}
        <div
          className={`relative z-10 shrink-0 w-12 h-12 rounded-[14px] flex items-center justify-center text-xl border ${badge.iconClass}`}>
          {badge.icon}
        </div>

        {/* Body */}
        <div className="flex-1 relative z-10">
          <div className="flex items-center justify-between mb-1">
            <h3
              className="font-bold text-[14px] text-slate-100">
              {badge.title}
            </h3>
            {!badge.unlocked && (
              <Lock
                size={12}
                className="text-slate-600"
                aria-label="Locked badge"
              />
            )}
          </div>

          <p className="text-[12px] text-slate-500 leading-relaxed mb-3">
            {badge.description}
          </p>

          {badge.unlocked ? (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-md bg-teal-400/10 border border-teal-400/20 text-teal-400">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              Unlocked on {badge.date}
            </span>
          ) : (
            <div className="flex items-center gap-2">
              <div
                className="flex-1 h-1 rounded-full overflow-hidden bg-white/5"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${badge.title} progress`}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, #14b8a6, #84cc16)",
                  }}
                />
              </div>
              <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">
                {Math.min(currentStreak, badge.progressTarget)} /{" "}
                {badge.progressTarget}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BadgeCard;