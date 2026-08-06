import CountUp from "react-countup";
import { motion } from "framer-motion";
import api from "../utils/api";
import { useEffect, useRef, useState } from "react";
import { BookOpen, CalendarDays, Icon, Trophy, User } from "lucide-react";

// Framer Motion Variants for Container (UL)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// Framer Motion Variants for Items(LI)
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};
const ImpactStats = () => {
  const sectionRef = useRef(null);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [dynamicCounts, setDynamicCounts] = useState({
    students: 0,
    bookIssued: 0,
    selectedStudents: 0,
  });
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldFetch(true);
          observer.disconnect();
        }
      },{
        rootMargin: "300px 0px 300px 0px"
      }
    );
    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);
  // fetch data
  useEffect(() => {
    if (!shouldFetch) return;
    const fetchStatus = async () => {
      try {
        const res = await api.get("/public/landing-stats");
        if (res.data.success) {
          setDynamicCounts(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch impact stats:", error);
      }
    };
    fetchStatus();
  }, [shouldFetch]);

  const stats = [
    {
      number: dynamicCounts.students > 20 ? dynamicCounts.students : 1200,
      icon: User,
      label: "Students",
      description: "Across All Branches",
      color: "text-teal-400",
      glow: "bg-teal-500/30",
    },
    {
      number: dynamicCounts.bookIssued > 20 ? dynamicCounts.bookIssued : 500,
      icon: BookOpen,
      label: "Books Issued",
      description: "This Month",
      color: "text-lime-400",
      glow: "bg-lime-500/30",
    },
    {
      number:
        dynamicCounts.selectedStudents > 20
          ? dynamicCounts.selectedStudents
          : 100,
      icon: Trophy,
      label: "Selected Students",
      description: "Across All Branches",
      color: "text-amber-400",
      glow: "bg-amber-500/30",
    },
    {
      number: "Daily",
      icon: CalendarDays,
      label: "Active Learning",
      description: "Every Day",
      color: "text-cyan-400",
      glow: "bg-cyan-500/30",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="impact"
      className="w-full py-24 px-4 overflow-hidden">
      {/* header */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}>
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl tracking-tight font-semibold mb-12 text-center">
            The Impact We've Created
          </motion.h2>
          <p className="mt-5 max-w-2xl mx-auto text-lg text-slate-400 leading-8">
            Every number reflects the collective efforts of our volunteers,
            mentors and students in building a stronger learning community.
          </p>
        </motion.div>
      </div>

      {/* Stats Container with Framer Motion */}
      <motion.ul
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <motion.li
            variants={itemVariants}
            key={index}
            className="relative border border-white/10 bg-white/5 rounded-3xl p-6 text-center hover:-translate-y-2 transition-transform duration-300 ease-out overflow-hidden cursor-default hover:shadow-[0_20px_60px_rgba(45,212,191,.08)]">
            {/* Glow */}
            <div
              aria-hidden="true"
              className={`absolute -bottom-6 left-1/2 -translate-x-1/2 w-24 h-24 ${item.glow} blur-3xl`}
            />

            <div className="mb-5 flex justify-center">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <item.icon className={item.color} size={28} />
              </div>
            </div>
            {/* Number */}
            <h3 className={`text-4xl font-bold ${item.color}`}>
              {typeof item.number === "number" ? (
                <CountUp
                  end={item.number}
                  duration={2.5}
                  suffix="+"
                  enableScrollSpy
                  scrollSpyOnce
                />
              ) : (
                item.number
              )}
            </h3>
            {/* Label */}
            <p className="text-zinc-200 mt-3 font-medium text-lg">
              {item.label}
            </p>
            {/* Description */}
            <p className="text-zinc-400 text-sm mt-1">{item.description}</p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
};

export default ImpactStats;
