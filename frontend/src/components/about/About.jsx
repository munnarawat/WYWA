import React from "react";
import { motion } from "framer-motion";
import { Target, Users, LayoutDashboard, ShieldCheck } from "lucide-react";

const About = () => {
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  return (
    <section className="w-full py-24 px-4 md:px-8 lg:px-16   overflow-hidden relative">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-125 h-125 bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* ── HEADER ── */}
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUpVariant}
          className="text-center mb-16"
        >
          <span className="text-teal-400 font-bold tracking-widest uppercase text-sm bg-teal-500/10 px-4 py-1.5 rounded-full border border-teal-500/20 inline-block mb-4">
            About Us
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            Discover the Purpose Behind <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-blue-500">MYWA</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* ── LEFT: The Real Story (Placeholders) ── */}
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.div variants={fadeUpVariant}>
              <div className="flex items-center gap-3 mb-3">
                <Target className="w-6 h-6 text-teal-400" />
                <h3 className="text-2xl font-bold text-white">How It Started</h3>
              </div>
              <p className="text-slate-400 leading-relaxed text-lg">
                [Insert MYWA's actual origin story here. Talk about the initial problem the founders faced, the environment where the idea was born, and the exact moment they decided this system was needed.]
              </p>
            </motion.div>

            <motion.div variants={fadeUpVariant}>
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-6 h-6 text-blue-400" />
                <h3 className="text-2xl font-bold text-white">Our Core Purpose</h3>
              </div>
              <p className="text-slate-400 leading-relaxed text-lg">
                [Explain the main goal. E.g., We aim to bring complete transparency between students and administration. MYWA is designed to eliminate paperwork and create a digital-first educational workspace.]
              </p>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: The Platform Capabilities (Your Work) ── */}
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 lg:p-10"
          >
            <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">
              Platform Capabilities
            </h3>
            
            <div className="space-y-6">
              <motion.div variants={fadeUpVariant} className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center shrink-0">
                  <LayoutDashboard className="w-6 h-6 text-teal-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">360° Student Profiles</h4>
                  <p className="text-slate-400 text-sm mt-1">A unified dashboard integrating attendance, library records, and achievements.</p>
                </div>
              </motion.div>

              <motion.div variants={fadeUpVariant} className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Enterprise Security</h4>
                  <p className="text-slate-400 text-sm mt-1">Role-Based Access Control ensuring strict data privacy across different branches.</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;