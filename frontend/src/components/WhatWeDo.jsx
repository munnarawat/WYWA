import {
  ClipboardCheck,
  GraduationCap,
  Handshake,
  Library,
  Trophy,
} from "lucide-react";
import React from "react";
import { motion } from "motion/react";
const WhatWeDo = () => {
  const cards = [
    {
      title: " Library & Learning",
      description:
        "A dedicated space with books and resources to help students study and grow",
      icon: Library,
      cardBg1: "bg-teal-500/40",
      cardBg2: "bg-lime-500/30",
      iconColor: "text-teal-400",
      hoverBorder: "hover:border-teal-500/50",
      iconBg: "bg-linear-to-br from-teal-500/20 to-lime-500/10",
    },
    {
      title: " Career Guidance",
      description:
        "Helping students prepare for competitive exams and career opportunities.",
      icon: GraduationCap,
      cardBg1: "bg-lime-500/40",
      cardBg2: "bg-green-500/30",
      iconColor: "text-lime-400",
      hoverBorder: "hover:border-lime-500/50",
      iconBg: "bg-linear-to-br from-lime-500/20 to-green-500/10",
    },
    {
      title: "Community Support",
      description:
        "Supporting students with admissions, accommodation, mentorship and blood assistance.",
      icon: Handshake,
      cardBg1: "bg-amber-500/40",
      cardBg2: "bg-yellow-500/30",
      iconColor: "text-amber-400",
      hoverBorder: "hover:border-amber-500/50",
      iconBg: "bg-linear-to-br from-amber-500/20 to-yellow-500/10",
    },
    {
      title: "Events & Development",
      description:
        "Organizing workshops, competitions and community activities that build confidence and leadership.",
      icon: Trophy,
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
    <section className="w-full py-28 md:px-4">
      {/* header */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}>
          <span className="text-teal-400 font-semibold tracking-[0.25em] uppercase text-sm mb-4 inline-block">
            What We Do
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl text-center  font-semibold">
            Empowering Students <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-teal-400">
             Building Brighter Futures
            </span>
          </motion.h1>
          <p className="mt-5 max-w-3xl mx-auto text-lg text-slate-400 leading-relaxed">
            From learning resources and career guidance to community support and
            leadership opportunities, MYWA helps students grow with confidence
            and purpose
          </p>
        </motion.div>
        {/* Title */}
      </div>
      {/* section divider */}
      <div className="w-24 h-px bg-linear-to-r from-transparent via-teal-500 to-transparent mx-auto mb-8" />
      {/* Cards */}
      <motion.ul
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 px-4 sm:grid-cols-2 lg:grid-cols-4 gap-7 mt-10">
        {cards.map((item, index) => (
          <motion.li
            variants={cardVariant}
            whileHover={{ y: -10 }}
            key={index}
            className={`relative group flex flex-col gap-4 w-full min-h-65 border border-white/10 bg-white/5 rounded-xl p-7 overflow-hidden transition-all ease-out duration-300 ${item.hoverBorder} hover:shadow-[0_20px_60px_rgba(45,212,191,0.08)]`}>
            {/* Glow */}
            <div
              className={`absolute group-hover:opacity-100 -top-20 -left-7.5 w-32 h-32 ${item.cardBg1} blur-3xl rounded-full opacity-60`}></div>
            <div
              className={`absolute -bottom-10 -right-5 w-32 h-32 ${item.cardBg2} blur-3xl rounded-full opacity-60`}></div>

            {/* Icon */}
            <div
              className={`w-14 h-14 flex items-center justify-center rounded-2xl ${item.iconBg} group-hover:scale-110 transition`}>
              <item.icon className={item.iconColor} size={28} />
            </div>

            {/* Title */}
            <h2 className="mono text-xl font-semibold text-white">
              {item.title}
            </h2>
            
            <div className="w-12 h-px bg-linear-to-r from-teal-400 to-transparent" />
            {/* Description */}
            <p className="text-[15px] leading-7 text-slate-400 ">
              {item.description}
            </p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
};

export default WhatWeDo;
