import { Book } from "lucide-react";
import React from "react";
import munsyari from "../images/munsyari.jpeg";
import { motion } from "motion/react";

const Hero = () => {

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const imageAnimation = {
    hidden: { opacity: 0, scale: 0.9 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative w-full overflow-hidden py-8">

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12"
      >

        {/* Left Content */}
        <div className="w-full md:w-1/2 space-y-6">

          {/* Badge */}
          <motion.div
            variants={item}
            className="w-fit flex items-center gap-2 border border-white/10 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2"
          >
            <Book size={18} className="text-teal-400" />
            <span className="text-sm text-zinc-300 tracking-wide">
              Empowering Education
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={container}
            className="text-4xl md:text-6xl font-bold leading-tight tracking-tight"
          >
            <motion.span variants={item} className="text-white block">
              Munsyari Youth
            </motion.span>

            <motion.span
              variants={item}
              className="bg-linear-to-r from-teal-400 to-lime-400 bg-clip-text text-transparent block"
            >
              Welfare Association
            </motion.span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={item}
            className="text-lg md:text-xl text-zinc-300 md:w-4/5"
          >
            Building disciplined minds and empowering futures through education,
            leadership, and community excellence.
          </motion.p>

          {/* Buttons */}
          <motion.div variants={item} className="flex flex-wrap gap-4 pt-2">

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-md bg-linear-to-r from-teal-500 to-lime-500 text-black font-semibold shadow-lg shadow-teal-500/20"
            >
              Join Your Branch
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 text-white"
            >
              Explore Impact
            </motion.button>

          </motion.div>

        </div>

        {/* Image */}
        <motion.div
          variants={imageAnimation}
          whileHover={{ scale: 1.03 }}
          className="w-full md:w-1/2 h-80 md:h-105 rounded-2xl overflow-hidden shadow-2xl shadow-black/40"
        >
          <img
            src={munsyari}
            alt="Munsyari"
            className="w-full h-full object-cover"
          />
        </motion.div>

      </motion.div>
    </section>
  );
};

export default Hero;