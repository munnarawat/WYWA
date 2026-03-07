import { ClipboardCheck, Handshake, Library, Trophy } from "lucide-react";
import React from "react";
import { motion } from "motion/react";
const WhatWeDo = () => {
  const cards = [
    {
      title: "Library Management",
      description:
        "Manage books, student memberships and track library activity easily.",
      icon: Library,
      cardBg1: "bg-teal-500/40",
      cardBg2: "bg-lime-500/30",
      iconColor: "text-teal-400",
      hoverBorder: "hover:border-teal-500/50",
      iconBg: "bg-linear-to-br from-teal-500/20 to-lime-500/10",
    },
    {
      title: "Attendance & Leaderboard",
      description: "Track attendance & motivate students",
      icon: ClipboardCheck,
      cardBg1: "bg-lime-500/40",
      cardBg2: "bg-green-500/30",
      iconColor: "text-lime-400",
      hoverBorder: "hover:border-lime-500/50",
      iconBg: "bg-linear-to-br from-lime-500/20 to-green-500/10",
    },
    {
      title: "Students Achievements",
      description: "Highlights selected students",
      icon: Trophy,
      cardBg1: "bg-amber-500/40",
      cardBg2: "bg-yellow-500/30",
      iconColor: "text-amber-400",
      hoverBorder: "hover:border-amber-500/50",
      iconBg: "bg-linear-to-br from-amber-500/20 to-yellow-500/10",
    },
    {
      title: "Foundation and Supporters",
      description: "Our trusted partners in education",
      icon: Handshake,
      cardBg1: "bg-cyan-500/40",
      cardBg2: "bg-blue-500/30",
      iconColor: "text-cyan-400",
      hoverBorder: "hover:border-cyan-500/50",
      iconBg: "bg-linear-to-br from-cyan-500/20 to-blue-500/10",
    },
  ];
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };
  const cardVariant = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };
  return (
    <section className="w-full py-20 md:px-4">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-semibold">
        What We Do
      </motion.h1>

      {/* Cards */}
      <motion.ul
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true ,amount: 0.2}}
        className="grid grid-cols-1 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
        {cards.map((item, index) => (
          <motion.li
            variants={cardVariant}
            whileHover={{ y: -10 }}
            key={index}
            className={`relative group flex flex-col gap-4 w-full min-h-[220px] border border-white/10 bg-white/5 rounded-xl p-6 overflow-hidden transition-all ease-out duration-300 ${item.hoverBorder}`}>
            {/* Glow */}
            <div
              className={`absolute group-hover:opacity-100 -top-20 -left-7.5 w-32 h-32 ${item.cardBg1} blur-3xl rounded-full opacity-60`}></div>
            <div
              className={`absolute -bottom-10 -right-5 w-32 h-32 ${item.cardBg2} blur-3xl rounded-full opacity-60`}></div>

            {/* Icon */}
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-lg ${item.iconBg} group-hover:scale-110 transition`}>
              <item.icon className={item.iconColor} size={28} />
            </div>

            {/* Title */}
            <h2 className="mono text-2xl font-semibold text-white">
              {item.title}
            </h2>

            {/* Description */}
            <p className="text-sm text-zinc-400">{item.description}</p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
};

export default WhatWeDo;
