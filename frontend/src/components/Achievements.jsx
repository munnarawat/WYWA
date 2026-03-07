import React from "react";
import { motion } from "framer-motion";
import { Award, Briefcase, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import ReactParallaxTilt from "react-parallax-tilt";

const Achievements = () => {
  const students = [
    {
      name: "Rahul Kumar",
      achievement: "Software Engineer",
      organization: "TCS Digital",
      image: "https://i.pravatar.cc/150?img=11",
      icon: Briefcase,
      color: "text-teal-400",
      bgGlow: "bg-teal-500/20",
    },
    {
      name: "Priya Sharma",
      achievement: "Cleared SSC CGL",
      organization: "Income Tax Dept.",
      image: "https://i.pravatar.cc/150?img=5",
      icon: Award,
      color: "text-amber-400",
      bgGlow: "bg-amber-500/20",
    },
    {
      name: "Amit Patel",
      achievement: "M.Tech CSE",
      organization: "IIT Bombay",
      image: "https://i.pravatar.cc/150?img=12",
      icon: GraduationCap,
      color: "text-cyan-400",
      bgGlow: "bg-cyan-500/20",
    },
    {
      name: "Neha Singh",
      achievement: "Data Analyst",
      organization: "Wipro",
      image: "https://i.pravatar.cc/150?img=9",
      icon: Briefcase,
      color: "text-lime-400",
      bgGlow: "bg-lime-500/20",
    },
  ];

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="w-full py-24 px-4 overflow-hidden relative">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-teal-500/10 blur-[100px] rounded-full -z-10" />

      {/* Header Section */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}>
          <span className="text-teal-400 font-mono text-sm tracking-wider uppercase mb-3 block">
            Our Pride
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6">
            Selected Students
          </h2>
          <p className="text-zinc-400 text-lg">
            Meet the bright minds from our library who have achieved their
            dreams and are making us proud in top organizations.
          </p>
        </motion.div>
      </div>

      {/* Students Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6  max-w-7xl mx-auto">
        {students.map((student, index) => (
          <ReactParallaxTilt tiltMaxAngleX={10} tiltMaxAngleY={10}  scale={1.02} key={index}>
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className="group relative border  border-white/10 bg-white/5 rounded-2xl p-6 text-center overflow-hidden flex flex-col items-center justify-center transition-all duration-300 ease-out hover:bg-white/10 hover:shadow-xl hover:shadow-teal-500/10">
              {/* Subtle Glow Behind Image */}
              <div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${student.bgGlow} -z-10`}
              />

              {/* Profile Image with Border/Glow on hover */}
              <div className="relative mb-5">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-white/30 transition-colors duration-300 relative z-10">
                  <img
                    src={student.image}
                    alt={`${student.name} achievement`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                {/* Floating Icon Indicator */}
                <div
                  className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-zinc-900 border border-white/20 flex items-center justify-center z-20 ${student.color}`}>
                  <student.icon size={16} />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-white mb-1 z-10">
                {student.name}
              </h3>

              <div className="flex flex-col items-center mt-2 z-10">
                <span className={`text-sm font-medium ${student.color} mb-1`}>
                  {student.achievement}
                </span>
                <span className="text-xs text-zinc-400 uppercase tracking-wider font-mono bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  {student.organization}
                </span>
              </div>
            </motion.div>
          </ReactParallaxTilt>
        ))}
      </motion.div>
      {/* redirect to achievements page */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 flex mx-auto justify-center w-full">
        <Link
          to="/achievements"
          className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white transition-all flex items-center gap-2 group">
          View All Achievements
          <span className="group-hover:translate-x-1 transition-transform">
            →
          </span>
        </Link>
      </motion.div>
    </section>
  );
};

export default Achievements;
