import { ArrowRight, Book } from "lucide-react";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router-dom";
const MotionLink = motion.create(Link);
const Hero = () => {
  const sliderImages = [
    "https://ik.imagekit.io/fmkamttxp/MYWA/mywa-1.jpeg", 
    "https://ik.imagekit.io/fmkamttxp/MYWA/mywa%20haldwani.jpeg",
    "https://ik.imagekit.io/fmkamttxp/MYWA/mywa-2.jpeg",
    "https://ik.imagekit.io/fmkamttxp/MYWA/mywa-3.jpeg",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  //  2 Second Auto-Slide Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === sliderImages.length - 1 ? 0 : prevIndex + 1,
      );
    }, 4000);
    return () => clearInterval(timer);
  }, [sliderImages.length]);

  // text-animation
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
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
        className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
        {/* Left Content */}
        <div className="w-full md:w-1/2 space-y-6">
          {/* Badge */}
          <motion.div
            variants={item}
            className="w-fit flex items-center gap-2 border border-white/10 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2">
            <Book size={18} className="text-teal-400" />
            <span className="text-sm text-zinc-300 tracking-wide">
              Empowering Education
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={container}
            className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
            <motion.span variants={item} className="text-white block">
              Munsyari Youth
            </motion.span>

            <motion.span
              variants={item}
              className="bg-linear-to-r from-teal-400 to-lime-400 bg-clip-text text-transparent block">
              Welfare Association
            </motion.span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={item}
            className="text-lg md:text-xl text-zinc-300 md:w-4/5">
            Building disciplined minds and empowering futures through education,
            leadership, and community excellence.
          </motion.p>

          {/* Buttons */}
          <motion.div variants={item} className="flex flex-wrap gap-4 pt-2">
            <MotionLink
              to="/login"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 rounded-xl bg-linear-to-r from-teal-500 to-lime-500 text-black font-bold text-lg shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] transition-shadow flex items-center justify-center gap-2">
              Join Your Branch
              <ArrowRight size={20} />
            </MotionLink>

            <motion.a
              href="/#impact"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255,255,255,0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium  text-lg flex items-center justify-center transition-colors">
              Explore Impact
            </motion.a>
          </motion.div>
        </div>

        {/* Right Content - Image Auto Slider */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full md:w-1/2 relative group h-80 md:h-[500px]">
          {/* Ambient Glow */}
          <div className="absolute -inset-4 bg-linear-to-r from-teal-500/20 to-lime-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />

          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-black border border-white/10 bg-black/70">
            {/* Overlay for dark theme text readability */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none" />

            {/* AnimatePresence for Smooth Cross fade */}
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={sliderImages[currentIndex]}
                alt={`Munsyari Slide ${currentIndex + 1}`}
                initial={{ opacity: 0, scale: 1.05 }} //fade in
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {sliderImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? "bg-teal-400 w-6"
                      : "bg-white/40 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
