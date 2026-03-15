import React from "react";

const ThinkTankSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse flex flex-col items-center text-center h-[340px]">
        <div className="w-24 h-24 bg-white/10 rounded-full mb-4"></div>
        <div className="h-6 w-3/4 bg-white/10 rounded-md mb-2"></div>
        <div className="h-4 w-1/2 bg-white/5 rounded-md mb-6"></div>
        <div className="h-16 w-full bg-white/5 rounded-md mb-4"></div>
        <div className="mt-auto flex gap-2 w-full justify-center">
          <div className="h-8 w-8 bg-white/5 rounded-md"></div>
          <div className="h-8 w-8 bg-white/5 rounded-md"></div>
        </div>
      </div>
    ))}
  </div>
);

export default ThinkTankSkeleton;