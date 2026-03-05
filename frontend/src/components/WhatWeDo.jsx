import { ClipboardCheck, Handshake, Library, Trophy } from "lucide-react";
import React from "react";

const WhatWeDo = () => {
  const cards = [
    {
      title: " Library Management",
      description:
        "Manage books, student memberships and track library activity easily.",
      icon: Library,
    },
    {
      title: " Attendance & Leaderboard",
      description: "Track attendance & motivate students",
      icon: ClipboardCheck,
    },
    {
      title: " Students Achievements",
      description: "Highlights selected students",
      icon: Trophy,
    },
    {
      title: " Foundation and Supporters",
      description: "Our trusted partners in eduction",
      icon: Handshake,
    },
  ];
  return (
    <div className="w-full pt-8 min-h-screen md:px-4">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-semibold">What We Do</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
        {cards.map((item, index) => (
          <div key={index} className="relative group flex flex-col gap-4 w-full min-h-55 border border-white/10 bg-white/5 rounded-xl p-6 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-teal-400/40">
            {/* Glow */}
            <div className="absolute -top-20 -left-7.5 w-32 h-32 bg-teal-500/40 blur-3xl rounded-full opacity-60"></div>
            <div className="absolute -bottom-10 -right-5 w-32 h-32 bg-lime-500/30 blur-3xl rounded-full opacity-60"></div>

            {/* Icon */}
            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-linear-to-br from-teal-500/20 to-lime-500/10 group-hover:scale-110 transition">
              <item.icon className="text-teal-400" size={26} />
            </div>

            {/* Title */}
            <h2 className=" mono text-2xl font-semibold text-white">
              {item.title}
            </h2>

            {/* Description */}
            <p className="text-sm text-zinc-400">
                {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhatWeDo;
