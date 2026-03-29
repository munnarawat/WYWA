import React from "react";

const AttendanceSkeleton = () => (
  <div
    className="rounded-[20px] p-px animate-pulse"
    style={{
      background: "linear-gradient(135deg, rgba(20,184,166,0.2), rgba(255,255,255,0.04))",
    }}>
    <div className="bg-[#0d1117] rounded-[19px] p-7 space-y-5">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="h-10 w-10 rounded-xl bg-white/4" />
          <div className="h-6 w-44 rounded-lg bg-white/4" />
          <div className="h-4 w-32 rounded-md bg-white/4" />
        </div>
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 w-16 rounded-[14px] bg-white/4" />
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="flex-1 h-9 rounded-[10px] bg-white/4" />
        ))}
      </div>
      <div className="h-[200px] rounded-xl bg-white/4" />
    </div>
  </div>
);

export default AttendanceSkeleton;