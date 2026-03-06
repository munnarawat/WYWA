import CountUp from "react-countup";
import { motion } from "framer-motion";

const ImpactStats = () => {
  const stats = [
    {
      number: 1200,
      label: "Students",
      description: "Across All Branches",
      color: "text-teal-400",
      glow: "bg-teal-500/30",
    },
    {
      number: 500,
      label: "Books Issued",
      description: "This Month",
      color: "text-lime-400",
      glow: "bg-lime-500/30",
    },
    {
      number: 100,
      label: "Selected Students",
      description: "Across All Branches",
      color: "text-amber-400",
      glow: "bg-amber-500/30",
    },
    {
      number: "Daily",
      label: "Attendance Tracking",
      description: "Automated System",
      color: "text-cyan-400",
      glow: "bg-cyan-500/30",
    },
  ];

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

  return (
    <section className="w-full py-24 px-4 overflow-hidden">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-semibold mb-12 text-center md:text-left"
      >
        Our Impact
      </motion.h2>

      {/* Stats Container with Framer Motion */}
      <motion.ul
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }} 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((item, index) => (
          <motion.li
            variants={itemVariants}
            key={index}
            className="relative border border-white/10 bg-white/5 rounded-xl p-6 text-center hover:-translate-y-2 transition-transform duration-300 ease-out overflow-hidden cursor-default"
          >
            {/* Glow */}
            <div
              aria-hidden="true"
              className={`absolute -bottom-6 left-1/2 -translate-x-1/2 w-24 h-24 ${item.glow} blur-3xl`}
            />

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