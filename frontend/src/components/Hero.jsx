import { ArrowRight, Book } from "lucide-react";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router-dom";
const MotionLink = motion.create(Link);
const sliderImages = [
  "https://ik.imagekit.io/fmkamttxp/MYWA/mywa-1.jpeg?tr=w-800,q-75,f-webp",
  "https://ik.imagekit.io/fmkamttxp/MYWA/mywa%20haldwani.jpeg?tr=w-800,q-75,f-webp",
  "https://ik.imagekit.io/fmkamttxp/MYWA/mywa-2.jpeg?tr=w-800,q-75,f-webp",
  "https://ik.imagekit.io/fmkamttxp/MYWA/mywa-3.jpeg?tr=w-800,q-75,f-webp",
];

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

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  //  2 Second Auto-Slide Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === sliderImages.length - 1 ? 0 : prevIndex + 1,
      );
    }, 5000);
    return () => clearInterval(timer);
  }, [sliderImages.length]);

  useEffect(() => {
    const next = (currentIndex + 1) % sliderImages.length;
    const img = new Image();
    img.src = sliderImages[next];
  }, [currentIndex]);

  return (
    <section className="relative w-full overflow-hidden  min-h-[85vh]">
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
            className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-4 py-2 backdrop-blur-xl">
            <Book size={16} className="text-teal-400" />
            <span className="text-sm font-medium text-teal-200">
              Since 2022 • Empowering the Youth of Munsyari
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={container}
            className="text-[clamp(42px,6vw,72px)] font-extrabold leading-[1.05] tracking-tight">
            <motion.span variants={item} className="text-white block">
              Munsyari Youth
            </motion.span>

            <motion.span
              variants={item}
              className="block bg-linear-to-r from-teal-400 via-cyan-300 to-lime-400 bg-clip-text text-transparent">
              Welfare Association
            </motion.span>
          </motion.h1>
          {/* Subheading */}
          <motion.p
            variants={item}
            className="max-w-xl text-lg leading-8 text-slate-300">
            Connecting students with opportunities, guidance, libraries and a
            strong community where no young dream is left behind.
          </motion.p>

          {/* Buttons */}
          <motion.div variants={item} className="flex flex-wrap gap-4 pt-2">
            <MotionLink
              to="/login"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-xl w-full px-8 lg:w-fit justify-center py-4 font-semibold bg-linear-to-r from-teal-500 to-cyan-500 text-lg md:hover:scale-[1.03] transition-all flex items-center gap-2">
              Join MYWA
              <ArrowRight size={20} />
            </MotionLink>

            <MotionLink
              to="/about"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 w-full lg:w-fit rounded-xl bg-white/5 border border-white/10 text-white font-medium  md:hover:border-teal-500/30 md:hover:bg-white/10 text-lg flex items-center justify-center transition-colors">
              Our Journey
            </MotionLink>
          </motion.div>
        </div>

        {/* Right Content - Image Auto Slider */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full md:w-1/2 relative group h-80 md:h-125">
          {/* Ambient Glow */}
          <div className="absolute -inset-4 bg-linear-to-r from-teal-500/20 to-lime-500/20 rounded-3xl blur-2xl opacity-0 md:group-hover:opacity-100 transition-opacity duration-700 -z-10" />
          <div className="absolute top-5 left-5 z-20 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl px-4 py-2">
            <p className="text-xs uppercase tracking-[0.2em] text-white/80">
              Since 2022
            </p>
          </div>
          <div className="relative w-full h-full rounded-3xl lg:rounded-4xl overflow-hidden shadow-xl shadow-black border border-white/15 bg-black/70">
            {/* Overlay for dark theme text readability */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent z-10" />
            {/* Image Counter */}
            <div className="absolute top-5 right-5 z-20 rounded-full bg-black/40 backdrop-blur-xl px-3 py-1">
              <span className="text-white text-sm">
                {currentIndex + 1} / {sliderImages.length}
              </span>
            </div>
            {/* AnimatePresence for Smooth Cross fade */}
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={sliderImages[currentIndex]}
                alt={`Munsyari Slide ${currentIndex + 1}`}
                initial={{ opacity: 0, scale: 1.05 }} //fade in
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                loading={currentIndex === 0 ? "eager" : "lazy"}
                fetchPriority="high"
                decoding="async"
                width="800"
                height="1000"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-105"
              />
            </AnimatePresence>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {sliderImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? "bg-teal-400 w-8"
                      : "bg-white/30 md:hover:bg-white/80"
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
