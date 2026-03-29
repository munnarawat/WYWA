import React from "react";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";

const ProfileHeader = ({ authUser, firstName, handleAvatarUpload }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260 }}
      className="relative rounded-[20px] p-px"
      style={{
        background:
          "linear-gradient(135deg, rgba(20,184,166,0.35), rgba(255,255,255,0.05), rgba(132,204,22,0.2))",
      }}>
      <div className="bg-[#0d1117] rounded-[19px] px-7 py-8 relative overflow-hidden flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Glows & Mesh Background */}
        <div className="absolute top-[-80px] right-[-80px] w-72 h-72 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(20,184,166,0.1), transparent 70%)" }} />
        <div className="absolute bottom-[-60px] left-[-60px] w-52 h-52 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(132,204,22,0.07), transparent 70%)" }} />
        <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none rounded-br-[19px]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "14px 14px" }} />

        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="absolute inset-[-3px] rounded-full pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(20,184,166,0.7), rgba(132,204,22,0.5))", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", padding: "2px" }} />
          <div className="w-[88px] h-[88px] rounded-full bg-[#131920] border border-teal-500/20 flex items-center justify-center text-3xl">🧑‍💻</div>
          <input type="file" id="avatar-input" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          <motion.button type="button" whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={() => document.getElementById("avatar-input").click()} className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center border-2 border-[#0d1117]" style={{ background: "linear-gradient(135deg, #14b8a6, #84cc16)" }}>
            <Camera size={14} className="text-[#0d1117]" />
          </motion.button>
        </div>

        {/* Info */}
        <div className="relative z-10 text-center sm:text-left flex-1">
          <h1 className="font-extrabold text-[28px] mb-1.5 bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #f0fdf4 0%, #14b8a6 50%, #84cc16 100%)", fontFamily: "'Syne', sans-serif" }}>
            {firstName}
          </h1>
          <p className="text-[13px] text-slate-500 mb-3">{authUser?.branch && `${authUser.branch} Branch`}</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-slate-400">🎓 {authUser?.role || "User"}</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/8 border border-teal-500/20 text-[10px] font-bold uppercase tracking-wider text-teal-400">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" /> Active
            </span>
            {authUser?.profile?.academic?.batch && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-slate-400">📅 Batch {authUser.profile.academic.batch}</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;