import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const PARTICLE_COUNT = 22;

const MywaLoader = () => {
  const containerRef = useRef(null);
  const skylineRef = useRef(null);
  const iconRingsRef = useRef(null);
  const iconBoxRef = useRef(null);
  const ringOuterRef = useRef(null);
  const ringInnerRef = useRef(null);
  const wordmarkRef = useRef(null);
  const subtitleRef = useRef(null);
  const progressWrapRef = useRef(null);
  const progressFillRef = useRef(null);
  const pctRef = useRef(null);
  const particlesRef = useRef([]);
  particlesRef.current = [];

  const addParticleRef = (el) => {
    if (el && !particlesRef.current.includes(el)) {
      particlesRef.current.push(el);
    }
  };

  // stable random particle layout (computed once)
  const [particles] = useState(() =>
    Array.from({ length: PARTICLE_COUNT }, () => ({
      size: 2 + Math.random() * 3,
      left: Math.random() * 100,
      top: 60 + Math.random() * 40,
      baseOpacity: 0.15 + Math.random() * 0.35,
      driftY: 120 + Math.random() * 180,
      driftX: (Math.random() - 0.5) * 60,
      duration: 4 + Math.random() * 4,
      delay: Math.random() * 4,
    }))
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      // --- mountain skyline draw ---
      const skyline = skylineRef.current;
      const length = skyline.getTotalLength();
      gsap.set(skyline, { strokeDasharray: length, strokeDashoffset: length });

      // --- floating mist particles (continuous) ---
      particlesRef.current.forEach((el, i) => {
        const p = particles[i];
        gsap.to(el, {
          y: -p.driftY,
          x: p.driftX,
          opacity: 0,
          duration: p.duration,
          repeat: -1,
          delay: p.delay,
          ease: "power1.out",
        });
      });

      // --- continuous ring rotation ---
      gsap.to(ringOuterRef.current, { rotate: 360, duration: 6, repeat: -1, ease: "none" });
      gsap.to(ringInnerRef.current, { rotate: -360, duration: 4.5, repeat: -1, ease: "none" });

      // --- letter refs ---
      const letters = wordmarkRef.current.querySelectorAll("span");

      // --- main entrance timeline ---
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(skyline, { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut" }, 0)
        .from(iconRingsRef.current, { scale: 0, opacity: 0, duration: 0.7, ease: "back.out(2)" }, 0.3)
        .to(
          iconBoxRef.current,
          {
            boxShadow: "0 0 46px rgba(45,212,191,0.55)",
            duration: 1.1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          },
          0.9
        )
        .fromTo(
          letters,
          { y: -46, opacity: 0, rotateX: -60 },
          { y: 0, opacity: 1, rotateX: 0, duration: 0.9, stagger: 0.09, ease: "elastic.out(1,0.6)" },
          0.55
        )
        .to(
          letters,
          {
            backgroundPosition: "200% 50%",
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          },
          1.5
        )
        .to(subtitleRef.current, { opacity: 1, duration: 0.7 }, 1.15)
        .to(progressWrapRef.current, { opacity: 1, duration: 0.5 }, 1.35);

      // --- progress counter synced with fill bar ---
      const counter = { val: 0 };
      gsap.to(counter, {
        val: 100,
        duration: 1.5,
        delay: 1.1,
        ease: "power1.inOut",
        onUpdate: () => {
          const rounded = Math.round(counter.val);
          if (pctRef.current) pctRef.current.textContent = `${rounded}%`;
          if (progressFillRef.current) progressFillRef.current.style.width = `${counter.val}%`;
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [particles]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-9999 flex flex-col items-center justify-center overflow-hidden bg-[#070a0f]"
      style={{
        background:
          "radial-gradient(ellipse at center, #0a0f1e 0%, #070a0f 70%)",
      }}
    >
      {/* grid texture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(45,212,191,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,191,0.035) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
          maskImage: "radial-gradient(ellipse at center, black 0%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 0%, transparent 72%)",
        }}
      />

      {/* ambient glows */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[46vw] w-[46vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-400/[0.14] blur-[90px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[28vw] w-[28vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-400/10 blur-[90px]" />

      {/* mountain skyline contour */}
      <div className="absolute bottom-0 left-0 h-[46%] w-full opacity-90">
        <svg viewBox="0 0 1000 260" preserveAspectRatio="none" className="h-full w-full">
          <defs>
            <linearGradient id="contourGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0" />
              <stop offset="50%" stopColor="#5eead4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#a3e635" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="contourFillGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            fill="url(#contourFillGrad)"
            opacity={0.05}
            d="M0,260 L0,150 L60,110 L130,160 L210,90 L290,140 L360,60 L430,120 L500,40 L560,100 L640,70 L710,130 L790,80 L860,150 L930,100 L1000,140 L1000,260 Z"
          />
          <path
            ref={skylineRef}
            fill="none"
            stroke="url(#contourGradient)"
            strokeWidth="1.4"
            d="M0,150 L60,110 L130,160 L210,90 L290,140 L360,60 L430,120 L500,40 L560,100 L640,70 L710,130 L790,80 L860,150 L930,100 L1000,140"
          />
        </svg>
      </div>

      {/* floating mist particles */}
      <div className="pointer-events-none absolute inset-0">
        {particles.map((p, i) => (
          <div
            key={i}
            ref={addParticleRef}
            className="absolute rounded-full bg-teal-300/50"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.left}%`,
              top: `${p.top}%`,
              opacity: p.baseOpacity,
            }}
          />
        ))}
      </div>

      {/* center stage */}
      <div className="relative z-10 flex flex-col items-center">
        {/* icon rings */}
        <div ref={iconRingsRef} className="relative mb-10 flex h-29 w-29 items-center justify-center">
          <div
            ref={ringOuterRef}
            className="absolute h-29 w-29 rounded-full border border-transparent"
            style={{ borderTopColor: "rgba(45,212,191,0.4)", borderRightColor: "rgba(45,212,191,0.15)" }}
          />
          <div
            ref={ringInnerRef}
            className="absolute h-20.5 w-20.5 rounded-full border border-transparent"
            style={{ borderBottomColor: "rgba(163,230,53,0.45)", borderLeftColor: "rgba(163,230,53,0.15)" }}
          />
          <div
            ref={iconBoxRef}
            className="relative flex h-14.5 w-14.5 items-center justify-center rounded-2xl border border-white/10"
            style={{
              background: "linear-gradient(145deg, #0d1420 0%, #0a0f1a 100%)",
              boxShadow: "0 0 30px rgba(45,212,191,0.25)",
            }}
          >
            <div
              className="absolute inset-0 rounded-2xl"
              style={{ background: "linear-gradient(135deg, rgba(45,212,191,0.18), rgba(163,230,53,0.18))" }}
            />
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="relative z-10">
              <path
                d="M3 19L9 8L13 15L16 10L21 19H3Z"
                stroke="#5eead4"
                strokeWidth="1.6"
                strokeLinejoin="round"
                strokeLinecap="round"
                fill="rgba(94,234,212,0.12)"
              />
              <circle cx="17.5" cy="6.5" r="1.6" fill="#a3e635" />
            </svg>
          </div>
        </div>

        {/* MYWA wordmark */}
        <div ref={wordmarkRef} className="mb-4 flex gap-[0.05em] text-5xl font-bold tracking-[0.16em]">
          {["M", "Y", "W", "A"].map((letter, i) => (
            <span
              key={i}
              className="inline-block bg-clip-text text-transparent opacity-0"
              style={{
                backgroundImage: "linear-gradient(135deg, #5eead4 0%, #14b8a6 45%, #84cc16 100%)",
                backgroundSize: "220% 220%",
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* subtitle */}
        <div
          ref={subtitleRef}
          className="mb-9 font-mono text-[0.68rem] tracking-[0.42em] text-slate-500 uppercase opacity-0"
        >
          Learning <span className="text-teal-400">·</span>Leadership{" "}
          <span className="text-teal-400">·</span>  Community
        </div>

        {/* progress */}
        <div ref={progressWrapRef} className="flex flex-col items-center gap-3 opacity-0">
          <div className="relative h-0.75 w-55 overflow-hidden rounded-full bg-white/[0.07]">
            <div
              ref={progressFillRef}
              className="absolute top-0 left-0 bottom-0 w-0 rounded-full"
              style={{ background: "linear-gradient(90deg, #2dd4bf, #a3e635)" }}
            />
          </div>
          <div className="flex items-center gap-2 font-mono text-[0.66rem] tracking-[0.28em] text-slate-600 uppercase">
            <span className="h-1 w-1 rounded-full bg-teal-400" />
            <span>Loading</span>
            <span ref={pctRef} className="min-w-[2.4em] text-right font-bold text-teal-400">
              0%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MywaLoader;