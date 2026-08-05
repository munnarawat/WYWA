import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Instagram, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};
const ThinkTank = () => {
  const [visionaries, setVisionaries] = useState([]);
  const [loading, setLoading] = useState(true);

  const sectionRef = useRef(null);
  const [shouldFetch, setShouldFetch] = useState(false);

  useEffect(()=>{
    const observer = new IntersectionObserver(([entry])=>{
      if(entry.isIntersecting){
        setShouldFetch(true);
        observer.disconnect();
      }
    },{
      threshold:0.2
    });
    if(sectionRef.current){
      observer.observe(sectionRef.current);
    }
    return()=>observer.disconnect();
  },[])
  useEffect(() => {
    if(!shouldFetch) return;
    const fetchVisionaries = async () => {
      try {
        const res = await api.get("/thinkTank/main");
        if (res.data.success) {
          setVisionaries(res.data.mainThinkTank);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchVisionaries();
  }, [shouldFetch]);

  return (
    <section ref={sectionRef} className="w-full py-24 px-4 overflow-hidden relative">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-teal-500/10 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            <span className="text-teal-400 font-mono text-sm tracking-wider uppercase mb-3 block flex items-center justify-center gap-2">
              <Quote size={14} /> The Birth of MYWA <Quote size={14} />
            </span>
            <h2 className="text-4xl heading md:text-5xl lg:text-6xl font-semibold text-white mb-6">
              The Minds Behind MYWA
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Meet the visionaries whose leadership, dedication and service
              transformed a simple idea into a growing community.
            </p>
          </motion.div>
        </div>

        {/* Profile Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2  gap-8">
          {visionaries.map((person) => (
            <motion.div
              key={person._id}
              variants={cardVariants}
              whileHover={{ y: -12, scale: 1.02 }}
              className="relative group rounded-[28px] border border-white/10 bg-white/5 p-8 overflow-hidden transition-all duration-300 hover:border-teal-500/30 hover:bg-white/10 flex flex-col ease-out items-center text-center">
              {/* Ambient Hover Glow behind card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-teal-500/20 -z-10" />

              {/* Profile Image with Gradient Ring */}
              <div className="relative mb-5">
                <div
                  className={`absolute -inset-1.5 bg-linear-to-br from-teal-500 to-teal-700 rounded-full blur-sm opacity-50 group-hover:opacity-100  transition-opacity duration-500`}
                />
                <div className="relative w-36 h-36 rounded-full border-2 border-zinc-900 overflow-hidden bg-zinc-800  group-hover:border-teal-400 group-hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all duration-300 ">
                  {person.imageUrl ? (
                    <img
                      src={person.imageUrl}
                      alt={person.name}
                      loading="lazy"
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-linear-to-br from-teal-900/50 to-zinc-900 flex items-center justify-center text-teal-400 text-2xl font-bold">
                      {person.name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <span
                  className="inline-flex items-center px-4 py-1.5 rounded-full
               bg-teal-500/10 border border-teal-500/20 text-xs uppercase tracking-[0.2em] font-semibold text-teal-300">
                  {person.roleOrContribution}
                </span>
              </div>
              {/* Info */}
              <h3 className="text-[26px] font-bold tracking-tight text-white leading-tight mb-4">
                {person.name}
              </h3>
              <div className="w-16 h-0.5 rounded-full bg-linear-to-r from-teal-400 to-indigo-500 mb-5" />

              <p className="text-slate-400 italic max-w-xs text-[15px] leading-8 mx-auto">
                "{person.description}"
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-4 mt-auto">
                {person.contact && (
                  <a
                    href={
                      person.contact.startsWith("http")
                        ? person.contact
                        : `mailto:${person.contact}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all">
                    <ExternalLink size={18} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
        {/* redirect to think-tank page */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex mx-auto justify-center w-full">
          <Link
            to="/all-thinkTank"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white transition-all flex items-center gap-2 group">
            Explore Our Leadership
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ThinkTank;
