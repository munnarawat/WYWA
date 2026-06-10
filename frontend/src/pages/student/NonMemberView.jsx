import { motion } from 'framer-motion';
import { ArrowRight, HeartHandshake, Mountain, Users } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NonMemberView = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 bg-zinc-950">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260 }}
        className="relative w-full max-w-[600px] rounded-3xl p-px"
        style={{
          background:
            "linear-gradient(135deg, rgba(20,184,166,0.4), rgba(255,255,255,0.05), rgba(132,204,22,0.3))",
        }}>
        <div className="bg-[#0d1117] rounded-[23px] px-8 py-12 md:px-12 text-center relative overflow-hidden">
          
          {/* Top ambient glow */}
          <div
            className="absolute -top-15 left-1/2 -translate-x-1/2 w-80 h-56 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(20,184,166,0.15), transparent 70%)",
            }}
          />

          {/* Emotional Icons */}
          <motion.div
            initial={{ scale: 0.8, rotate:45, opacity: 0 }}
            animate={{ scale: 1, rotate:0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
            className="relative  w-24 h-24 mx-auto mb-8 flex items-center justify-center"
          >
            <div className="absolute inset-0 rounded-3xl rotate-6 opacity-50" style={{ background: "linear-gradient(135deg, #14b8a6, #84cc16)" }} />
            <div className="absolute hover:rotate-6 duration-200 inset-0 rounded-3xl -rotate-3" style={{ background: "linear-gradient(135deg, #14b8a6, #84cc16)" }} />
            <HeartHandshake size={42} className="relative z-10 text-white drop-shadow-lg" />
          </motion.div>

          {/* Headline */}
          <h2 className="text-3xl heading md:text-4xl font-extrabold text-slate-100 mb-5 leading-tight tracking-tight">
            Your Home ,  <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #14b8a6, #84cc16)",
              }}>
              Away From Home.
            </span>
          </h2>

          {/* Emotional Body Text */}
          <p className="text-slate-400  text-[16px] leading-relaxed mb-8 max-w-[420px] mx-auto">
            Leaving Munsyari to chase your dreams doesn't mean you have to do it alone. 
            <span className="text-slate-200 mono font-semibold block mt-3">
              MYWA is not just an association; it's your family.
            </span>
            Connect with your roots, support your people, and let's build our careers together.
          </p>

          {/* Small Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300">
              <Mountain size={14} className="text-teal-400" /> Stay Connected
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300">
              <Users size={14} className="text-lime-400" /> Brotherhood
            </span>
          </div>

          {/* CTA Button */}
          <motion.button
            whileHover={{ y: -3, boxShadow: "0 0 40px rgba(20,184,166,0.4)" }}
            whileTap={{ scale: 0.96, }}
            onClick={() => navigate("/apply-membership")}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full  font-extrabold text-[15px] text-zinc-950 w-full sm:w-auto justify-center"
            style={{
              background: "linear-gradient(135deg, #f0fdf4 0%, #14b8a6 50%, #84cc16 100%)",
              boxShadow: "0 0 24px rgba(20,184,166,0.2)",
            }}>
            Join the MYWA Family
            <ArrowRight size={18} />
          </motion.button>

        </div>
      </motion.div>
    </div>
  );
};

export default NonMemberView;