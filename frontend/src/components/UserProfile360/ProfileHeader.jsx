import { motion } from "framer-motion";
import { Calendar, Mail, MapPin, Phone } from "lucide-react";
import { formatDate, meshStyle, ROLE_CONFIG } from "./shared/helpers";

const ProfileHeader = ({ personalDetails }) => {
  const roleConf = ROLE_CONFIG[personalDetails.role] || ROLE_CONFIG.student;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260 }}
      className="relative rounded-[22px] p-[1px]"
      style={{
        background:
          "linear-gradient(135deg, rgba(20,184,166,0.3), rgba(255,255,255,0.05), rgba(132,204,22,0.18))",
      }}
    >
      <div className="bg-[#0d1117] rounded-[21px] px-7 py-7 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">

        {/* Glows */}
        <div className="absolute top-[-80px] right-[-80px] w-64 h-64 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(20,184,166,0.1), transparent 70%)" }} />
        <div className="absolute bottom-[-60px] left-[-60px] w-52 h-52 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(132,204,22,0.07), transparent 70%)" }} />

        {/* Mesh */}
        <div
          className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none rounded-br-[21px]"
          style={meshStyle("14px")}
        />

        {/* ── Avatar ── */}
        <div className="relative flex-shrink-0">
          {/* Gradient ring */}
          <div
            className="absolute inset-[-3px] rounded-full pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgba(20,184,166,0.7), rgba(132,204,22,0.5))",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              padding: "2px",
            }}
          />
          {personalDetails.imageUrl ? (
            <img
              src={personalDetails.imageUrl}
              alt={personalDetails.fullName}
              className="w-20 h-20 rounded-full object-cover border-2 border-[#0d1117]"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#131920] border border-teal-500/20 flex items-center justify-center text-2xl font-extrabold text-teal-400">
              {personalDetails.fullName?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
          {/* Online dot */}
          <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0d1117]" />
        </div>

        {/* ── Info ── */}
        <div className="relative z-10 text-center sm:text-left flex-1">
          <h1
            className="font-extrabold text-[clamp(20px,3vw,28px)] mb-2 bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(135deg, #f0fdf4 0%, #14b8a6 50%, #84cc16 100%)",
            }}
          >
            {personalDetails.fullName}
          </h1>

          {/* Tags */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${roleConf.className}`}
            >
              {roleConf.emoji} {roleConf.label}
            </span>
            {personalDetails.branch && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <MapPin size={9} /> {personalDetails.branch}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/[0.08] border border-emerald-400/20 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </span>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[12px] text-slate-500 flex items-center justify-center sm:justify-start gap-2">
              <Mail size={12} /> {personalDetails.email}
            </p>
            {personalDetails.phone && (
              <p className="text-[12px] text-slate-500 flex items-center justify-center sm:justify-start gap-2">
                <Phone size={12} /> {personalDetails.phone}
              </p>
            )}
            <p className="text-[12px] text-slate-500 flex items-center justify-center sm:justify-start gap-2">
              <Calendar size={12} /> Joined: {formatDate(personalDetails.joinedAt)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;