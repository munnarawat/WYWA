import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  HeartHandshake,
  Mountain,
  Users,
  Briefcase,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { updateMywaAccess, updateMywaRequestStatus } from "../../store/slice/authSlice";

const NonMemberView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRequestPending = currentUser?.hasRequestedMywaFamily;
  const ref = useRef(null);

  console.log(currentUser);
  
  const handleJoinFamily = async () => {
    const hasPhone = currentUser?.profile?.contact?.phone;
    const hasAddress = currentUser?.profile?.contact?.permanentAddress;

    if (!hasPhone || !hasAddress) {
      toast.error("Please complete your profile (Phone & Address) first!");
      navigate("/student/profile");
      return;
    }
    try {
      setIsSubmitting(true);

      const response = await api.post("/auth/request-mywa");
      if (response.data.success) {
        toast.success(
          response.data.message ||
            "Request sent to Admin! Please wait for approval.",
        );
        dispatch(updateMywaRequestStatus(true));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 280, damping: 24 },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 bg-[#070a0f] relative overflow-hidden">
      {/* Ambient Orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-teal-500/10 blur-[100px] animate-pulse" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-lime-500/10 blur-[100px] animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-indigo-500/8 blur-[80px]" />

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(20,184,166,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 70%)",
        }}
      />

      {/* Gradient Border Card */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 24 }}
        className="relative w-full max-w-140 rounded-[28px] p-[1.5px]"
        style={{
          background:
            "linear-gradient(135deg, rgba(20,184,166,0.6), rgba(255,255,255,0.06), rgba(132,204,22,0.5), rgba(99,102,241,0.3))",
          boxShadow:
            "0 0 80px rgba(20,184,166,0.08), 0 40px 80px rgba(0,0,0,0.5)",
        }}>
        <div
          className="rounded-[27px] px-8 py-12 md:px-12 text-center relative overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, #0e1520 0%, #080d14 60%, #060a10 100%)",
          }}>
          {/* Top Glow */}
          <div
            className="absolute -top-14 left-1/2 -translate-x-1/2 w-80 h-48 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse, rgba(20,184,166,0.12) 0%, transparent 70%)",
            }}
          />

          <motion.div variants={stagger} initial="hidden" animate="show">
            {/* Icon */}
            <motion.div
              variants={item}
              className="relative w-22 h-22 mx-auto mb-8">
              <motion.div
                animate={{ scale: [1, 1.14, 1], opacity: [0.15, 0.08, 0.15] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-[22px]"
                style={{
                  background: "linear-gradient(135deg, #14b8a6, #84cc16)",
                }}
              />
              <div
                className="absolute inset-1.5 rounded-[18px] opacity-30"
                style={{
                  background: "linear-gradient(135deg, #14b8a6, #84cc16)",
                }}
              />
              <div
                className="absolute inset-3 rounded-[14px] flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #14b8a6, #10b981, #84cc16)",
                  boxShadow: "0 8px 32px rgba(20,184,166,0.4)",
                }}>
                <HeartHandshake size={32} className="text-white" />
              </div>
            </motion.div>

            {/* Live Badge */}
            <motion.div
              variants={item}
              className="flex items-center justify-center gap-2 mb-5">
              <span
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase"
                style={{
                  background: "rgba(20,184,166,0.12)",
                  border: "1px solid rgba(20,184,166,0.25)",
                  color: "#5eead4",
                }}>
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                Munsyari Youth welfare Association
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              variants={item}
              className="text-[clamp(28px,5vw,38px)] font-black text-slate-100 mb-5 leading-tight tracking-tight">
              Your Home,&nbsp;
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #5eead4 0%, #14b8a6 40%, #84cc16 100%)",
                }}>
                Away From Home.
              </span>
            </motion.h2>

            {/* Body */}
            <motion.p
              variants={item}
              className="text-slate-500 text-[15px] leading-relaxed mb-5 max-w-100 mx-auto">
              Leaving Munsyari to chase your dreams doesn't mean doing it alone.
              <span className="text-slate-300 font-semibold block mt-2">
                MYWA is not just an association — it's your family.
              </span>
            </motion.p>

            {/* Divider */}
            <motion.div
              variants={item}
              className="w-10 h-0.5 mx-auto mb-6 rounded-full"
              style={{ background: "linear-gradient(90deg, #14b8a6, #84cc16)" }}
            />

            {/* Stats */}
            <motion.div variants={item} className="flex justify-center mb-8">
              {[
                ["500+", "Members"],
                ["2", "Cities"],
                ["5 yrs", "Together"],
              ].map(([num, label], i) => (
                <div
                  key={i}
                  className={`px-6 ${i > 0 ? "border-l border-white/[0.07]" : ""}`}>
                  <p
                    className="text-[22px] font-extrabold bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, #5eead4, #84cc16)",
                    }}>
                    {num}
                  </p>
                  <p className="text-[11px] text-slate-600 font-medium uppercase tracking-widest mt-0.5">
                    {label}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Pills */}
            <motion.div
              variants={item}
              className="flex flex-wrap justify-center gap-2 mb-8">
              {[
                ["🏔️", "Stay Connected"],
                ["🤝", "Brotherhood"],
                ["💼", "Career Growth"],
              ].map(([icon, label]) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-400 transition-all duration-200 hover:-translate-y-0.5 hover:text-teal-300"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}>
                  {icon} {label}
                </span>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div variants={item}>
              <motion.button
                whileHover={
                  !isRequestPending && {
                    y: -3,
                    boxShadow:
                      "0 0 40px rgba(20,184,166,0.45), 0 16px 40px rgba(0,0,0,0.3)",
                  }
                }
                whileTap={!isRequestPending && { scale: 0.97 }}
                onClick={handleJoinFamily}
                disabled={isRequestPending || isSubmitting} // Disable condition
                className={`relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-extrabold text-[15px] w-full sm:w-auto justify-center overflow-hidden transition-all duration-300 ${
                  isRequestPending
                    ? "bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700" // Pending Style
                    : "text-emerald-950" // Normal Style
                }`}
                style={
                  !isRequestPending
                    ? {
                        background:
                          "linear-gradient(135deg, #f0fdf4 0%, #5eead4 30%, #14b8a6 65%, #84cc16 100%)",
                        letterSpacing: "-0.01em",
                      }
                    : {}
                }>
                {/* Shimmer (sirf tab dikhao jab pending na ho) */}
                {!isRequestPending && (
                  <motion.span
                    className="absolute inset-0 pointer-events-none"
                    // ... (tera shimmer animation wala code)
                  />
                )}

                {/* Dynamic Text and Icon */}
                {isSubmitting ? (
                  "Sending Request..."
                ) : isRequestPending ? (
                  <>
                    Request Pending <span className="text-xl">⏳</span>
                  </>
                ) : (
                  <>
                    Join the MYWA Family
                    <span className="w-7 h-7 rounded-full bg-emerald-900/20 flex items-center justify-center">
                      <ArrowRight size={15} />
                    </span>
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default NonMemberView;
