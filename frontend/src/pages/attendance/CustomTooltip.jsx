import React from "react";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const isPresent = payload[0].value === 100;
  return (
    <div
      className="px-4 py-3 rounded-[13px] border text-sm"
      style={{
        background: "#0d1117",
        borderColor: isPresent
          ? "rgba(52,211,153,0.3)"
          : "rgba(251,113,133,0.3)",
      }}>
      <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">
        {label}
      </p>
      <p
        className={`font-bold ${isPresent ? "text-emerald-400" : "text-rose-400"}`}>
        {isPresent ? "✅ Present" : "❌ Absent"}
      </p>
    </div>
  );
};

export default CustomTooltip;
