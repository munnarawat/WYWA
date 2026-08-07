import React, { lazy, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Award, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
const ReactParallaxTilt = lazy(() => import("react-parallax-tilt"));
import api from "../utils/api";

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

const Achievements = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [shouldFetch, setShouldFetch] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldFetch(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "300px 0px 300px 0px",
      },
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!shouldFetch) return;
    let mounted = true;

    const fetchAchievement = async () => {
      try {
        const res = await api.get("/achievements/all");
        if (mounted && res.data.success) {
          setStudents(res.data.achievement.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching achievements:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    fetchAchievement();
    return () => {
      mounted = false;
    };
  }, [shouldFetch]);

  return (
    <section
      ref={sectionRef}
      className="w-full py-24 px-4 overflow-hidden relative">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-teal-500/10 blur-[100px] rounded-full -z-10" />

      {/* Header Section */}
      <header className="max-w-3xl mx-auto text-center mb-16">
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
            Celebrating the brilliant minds who cracked top exams and placements
            through sheer dedication and hard work.
          </p>
        </motion.div>
      </header>

      {/* Students Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6  max-w-7xl mx-auto">
        {loading
          ? [...Array(4)].map((_, i) => (
              <div
                key={i}
                className=" relative border min-h-80 border-white/10 bg-white/5 rounded-2xl p-6 text-center overflow-hidden flex flex-col items-center justify-center ">
                <div className="w-24 h-24 rounded-full bg-white/10 animate-pulse mb-5" />
                <div className="h-6 w-32 bg-white/10 animate-pulse rounded mb-2" />
                <div className="h-4 w-24 bg-white/10 animate-pulse rounded" />
              </div>
            ))
          : students.map((student, index) => (
              <ReactParallaxTilt
                tiltMaxAngleX={10}
                tiltMaxAngleY={10}
                scale={1.02}
                key={student._id}>
                <motion.div
                  variants={cardVariants}
                  whileHover={{ y: -8 }}
                  className="group relative border min-h-80 border-white/10 bg-white/5 rounded-2xl p-6 text-center overflow-hidden flex flex-col items-center justify-center transition-all duration-300 ease-out hover:bg-white/10 hover:shadow-xl hover:shadow-teal-500/10">
                  {/* Subtle Glow Behind Image */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-cyan-500/20 -z-10" />

                  {/* Profile Image with Border/Glow on hover */}
                  <div className="relative mb-5">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-white/30 transition-colors duration-300 relative z-10">
                      <img
                        src={student.imageUrl}
                        alt={student.studentName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    {/* Floating Icon Indicator */}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-zinc-900 border border-white/20 flex items-center justify-center z-20 text-teal-400">
                      <Award size={16} />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-1 z-10">
                    {student.studentName}
                  </h3>

                  <div className="flex flex-col items-center mt-2 z-10">
                    <span className="text-xs text-teal-400 uppercase tracking-wider font-mono bg-white/5 px-3 py-1 rounded-full border border-white/10">
                      {student.examName}
                    </span>
                  </div>
                  <div className="mt-2 flex px-6 py-1.5 bg-white/5 border border-white/5  rounded-full items-center group-hover:border-teal-400/30 justify-center gap-2">
                    <Calendar size={16} className="text-teal-400" />
                    <h2 className="text-sm text-slate-300">{student.year}</h2>
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
