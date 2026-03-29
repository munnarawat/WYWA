import React from "react";

const MiniStat = ({ value, label, gradient, color }) => (
  <div
    className="flex flex-col items-center justify-center px-4 py-3 rounded-[14px] min-w-[72px]"
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.06)",
    }}>
    <span
      className="font-extrabold text-[22px] leading-none mb-1"
      style={
        gradient
          ? {
              backgroundImage: gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontFamily: "'Syne', sans-serif",
            }
          : { color, fontFamily: "'Syne', sans-serif" }
      }>
      {value}
    </span>
    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600">
      {label}
    </span>
  </div>
);

export default MiniStat;
