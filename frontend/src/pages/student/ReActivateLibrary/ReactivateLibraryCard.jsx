import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Library,
  BookOpen,
  Send,
  Check,
  CircleCheck,
  MapPin,
} from "lucide-react";
import { useSelector } from "react-redux";
import api from "../../../utils/api";
import toast from "react-hot-toast";
const ReactivateLibraryCard = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [requested, setRequested] = useState(
    currentUser?.hasRequestedLibrary || false,
  );
console.log(currentUser);

  const handleRequestAccess = async () => {
    try {
      await api.post("/auth/requestLibraryMember");
      setRequested(true);
      toast.success("Request sent successfully!");
    } catch (error) {
      toast.error("Failed to send request.");
    }
  };
  useEffect(() => {
    if (currentUser.hasRequestedLibrary) {
      setRequested(true);
    }
  }, [currentUser]);

  return (
    <div className="w-full px-4 sm:px-6 py-6 font-sans">
      {/* Slow spin keyframe */}
      <style>{`@keyframes slowspin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {/* Outer gradient border */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative w-full rounded-[20px] p-[1.5px]"
        style={{
          background:
            "linear-gradient(135deg, rgba(245,158,11,0.5) 0%, rgba(255,255,255,0.06) 45%, rgba(20,184,166,0.4) 100%)",
        }}>
        {/* Dark card */}
        <div className="relative  w-full rounded-[18.5px] bg-[#090E1C] overflow-hidden">
          {/* Grid texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.035]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 28px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 28px)",
            }}
          />

          {/* Glow blobs */}
          <div
            className="absolute -bottom-16 -left-10 w-56 h-56 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(20,184,166,0.09) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute -top-12 right-6 w-44 h-44 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)",
            }}
          />

          {/* ── Content wrapper ── */}
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10 p-5 sm:p-7 md:p-8 lg:p-10">
            {/* ══ LEFT ══ */}
            <div className="flex-1 flex flex-col gap-0 min-w-0">
              {/* Top meta row */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                {/* Icon */}
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/4 border border-white/8 flex items-center justify-center shrink-0 text-teal-400">
                  <Library size={20} />
                </div>

                {/* Labels */}
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="font-mono text-[10px] tracking-[0.14em] text-white/30 uppercase truncate">
                    MYWA Library Pass
                  </span>
                  <div className="flex items-center gap-1.5 text-white/45 font-mono text-[12px] sm:text-[13px] tracking-[0.05em] flex-wrap">
                    <span>MBR-2024</span>
                    <span className="text-white/20">·</span>
                    <MapPin size={11} className="text-white/30 shrink-0" />
                    <span>{currentUser.branch}</span>
                  </div>
                </div>

                {/* Status pill — pushed right on sm+, new line on xs */}
                <div className="  flex items-center gap-1.5 bg-amber-500/8 border border-amber-500/20 rounded-full px-3 py-1 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
                  <span className="text-amber-400 text-[11px] sm:text-[11.5px] font-semibold tracking-[0.04em]">
                    Access Paused
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-2.5 mb-4 sm:mb-5">
                <div className="flex-1 h-px bg-white/6" />
                <span className="font-mono text-[9px] tracking-[0.16em] text-white/18 uppercase whitespace-nowrap">
                  Access Status
                </span>
                <div className="flex-1 h-px bg-white/6" />
              </div>

              {/* Heading */}
              <h3 className="text-lg sm:text-xl md:text-[22px] font-bold text-slate-100 leading-snug tracking-tight mb-2.5">
                Your library pass is on hold
              </h3>

              {/* Body */}
              <p className="text-sm sm:text-[14px] md:text-[14.5px] text-white/40 leading-relaxed max-w-lg">
                You're an{" "}
                <span className="text-white/65 font-medium">
                  active MYWA member
                </span>{" "}
                — but your library access is currently paused. Re-activate to
                track attendance, reserve seats, and issue books at both
                branches.
              </p>

              {/* ── Mobile-only CTA (shows below body on small screens) ── */}
              <div className="flex flex-col gap-3 mt-6 lg:hidden">
                <motion.button
                  whileHover={
                    !requested
                      ? { y: -1, boxShadow: "0 8px 28px rgba(20,184,166,0.22)" }
                      : {}
                  }
                  whileTap={!requested ? { scale: 0.97 } : {}}
                  onClick={() => !requested ? handleRequestAccess(): undefined}
                  disabled={requested}
                  className={`
                    w-full sm:w-auto sm:self-start flex items-center justify-center gap-2
                    px-7 py-3.5 rounded-[13px] text-[14px] sm:text-[14.5px] font-bold
                    tracking-[0.01em] transition-all duration-300
                    ${
                      requested
                        ? "bg-teal-500/10 border border-teal-500/30 text-teal-400 cursor-default"
                        : "bg-linear-to-br from-teal-500 to-green-500 text-[#042F2E] cursor-pointer"
                    }
                  `}>
                  {requested ? <Check size={15} /> : <Send size={15} />}
                  {requested ? "Request Sent" : "Request Library Access"}
                </motion.button>

                <AnimatePresence>
                  {requested && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 bg-teal-500/8 border border-teal-500/20 rounded-xl px-4 py-2.5 text-teal-400 text-[13px] font-medium">
                      <CircleCheck size={15} className="shrink-0" />
                      Admin will review your request within 24 hrs.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ══ RIGHT — hidden on mobile, visible lg+ ══ */}
            <div className="hidden lg:flex flex-col items-center gap-4 shrink-0">
              {/* Stamp */}
              <div className="relative w-[118px] h-[118px] flex items-center justify-center">
                <div
                  className="absolute inset-0 rounded-full border-2 border-dashed border-amber-500/20"
                  style={{ animation: "slowspin 20s linear infinite" }}
                />
                <div className="w-22 h-22 rounded-full bg-amber-500/6 border-2 border-amber-500/16 flex flex-col items-center justify-center gap-1">
                  <BookOpen size={24} className="text-amber-400 opacity-80" />
                  <span className="font-mono text-[7.5px] tracking-[0.2em] text-amber-400/60 uppercase">
                    Paused
                  </span>
                </div>
              </div>

              {/* CTA */}
              <motion.button
                whileHover={
                  !requested
                    ? { y: -1, boxShadow: "0 8px 28px rgba(20,184,166,0.22)" }
                    : {}
                }
                whileTap={!requested ? { scale: 0.97 } : {}}
                onClick={() => (!requested ? handleRequestAccess() : undefined)}
                disabled={requested}
                className={`
                  w-full flex items-center justify-center gap-2
                  px-7 py-3.5 rounded-[13px] text-[14px] font-bold
                  tracking-[0.01em] transition-all duration-300 whitespace-nowrap
                  ${
                    requested
                      ? "bg-teal-500/10 border border-teal-500/30 text-teal-400 cursor-default"
                      : "bg-linear-to-br from-teal-500 to-green-500 text-[#042F2E] cursor-pointer"
                  }
                `}>
                {requested ? <Check size={15} /> : <Send size={15} />}
                {requested ? "Request Sent" : "Request Access"}
              </motion.button>

              <span className="font-mono text-[11px] tracking-[0.05em] text-white/20 text-center">
                Sent to branch admin
              </span>
            </div>
          </div>

          {/* Toast — desktop only (lg+) */}
          <AnimatePresence>
            {requested && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 3 }}
                transition={{ duration: 0.28 }}
                className="hidden lg:flex relative z-10 mx-8 mb-7 items-center justify-center gap-2 bg-teal-500/8 border border-teal-500/20 rounded-xl px-4 py-2.5 text-teal-400 text-[13.5px] font-medium">
                <CircleCheck size={16} className="shrink-0" />
                Request sent! Admin will review within 24 hrs."
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ReactivateLibraryCard;
