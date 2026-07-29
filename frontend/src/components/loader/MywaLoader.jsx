import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const MYWA_LETTERS = ["M", "Y", "W", "A"];

const MywaLoader = ({ onComplete }) => {
  const loaderRef = useRef(null);
  const glowRef = useRef(null);
  const lettersRef = useRef([]);
  const shineRef = useRef(null);
  const underlineRef = useRef(null);
  const subtitleRef = useRef(null);

  lettersRef.current = [];

  const addLetter = (el) => {
    if (el && !lettersRef.current.includes(el)) {
      lettersRef.current.push(el);
    }
  };

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          gsap.to(loaderRef.current, {
            opacity: 0,
            scale: 1.04,
            y: -20,
            duration: 0.7,
            filter: "blur(12px)",
            ease: "power2.out",
            onComplete: () => {
              gsap.set(loaderRef.current, {
                visibility: "hidden",
                pointerEvents: "none",
              });
              onComplete?.();
            },
          });
        },
      });

      // Initial state
      gsap.set(glowRef.current, { opacity: 0, scale: 0.7 });
      gsap.set(lettersRef.current, {
        opacity: 0,
        y: 60,
        rotationX: -90,
        scale: 0.6,
        filter: "blur(14px)",
        transformPerspective: 600,
        transformOrigin: "50% 100%",
      });
      gsap.set(shineRef.current, { x: "-120%", opacity: 0.2 });
      gsap.set(underlineRef.current, { scaleX: 0, transformOrigin: "left" });
      gsap.set(subtitleRef.current, { opacity: 0, y: 15 });

      // Infinite animation
      gsap.to(glowRef.current, {
        opacity: 0.8,
        scale: 1.5,
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: "sine.inOut",
      });

      // Letters — one by one, 3D flip + scale + blur reveal
      lettersRef.current.forEach((el, i) => {
        const start = 0.2 + i * 0.16;

        tl.to(
          el,
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.6,
            ease: "back.out(2.2)",
          },
          start,
        );

        // Glow pulse per letter as it lands
        tl.fromTo(
          el,
          { textShadow: "0 0 0px rgba(94,234,212,0)" },
          {
            textShadow: "0 0 24px rgba(94,234,212,0.65)",
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            ease: "sine.inOut",
          },
          start,
        );
      });

      // Shine sweep across the wordmark
      tl.to(
        shineRef.current,
        { x: "220%", duration: 1, opacity: 1, ease: "power2.inOut" },
        "-=0.3",
      );
      // Underline draw
      tl.to(
        underlineRef.current,
        { scaleX: 1, duration: 0.5, ease: "power3.out" },
        "-=0.7",
      );

      // Subtitle
      tl.to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4");

      // Hold before exit
      tl.to({}, { duration: 0.7 });
    },
    { scope: loaderRef, revertOnUpdate: true },
  );

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#05080D] overflow-hidden px-6">
      {/* Ambient glow */}
      <div
        ref={glowRef}
        className="
          pointer-events-none
          absolute
          h-95
          w-95
          sm:h-125
          sm:w-125
          rounded-full
          bg-teal-400/15
          blur-[90px]
        "
      />

      <div className="relative text-center">
        {/* MYWA */}
        <div className="relative inline-block">
          <h1
            className="
              flex
              text-6xl
              sm:text-7xl
              md:text-8xl
              font-black
              tracking-[0.8em]
              sm:tracking-widest
              md:tracking-[0.14em]
              uppercase
              bg-linear-to-r
              from-teal-300
              via-cyan-300
              to-lime-300
              bg-clip-text
              text-transparent
            ">
            {MYWA_LETTERS.map((letter, index) => (
              <span
                key={letter + index}
                ref={addLetter}
                className="inline-block will-change-transform">
                {letter}
              </span>
            ))}
          </h1>

          {/* Shine sweep */}
          <div
            ref={shineRef}
            className="
              absolute
              top-0
              left-0
              h-full
              w-24
              -skew-x-12
              bg-linear-to-r
              from-transparent
              via-white/70
              to-transparent
              blur-md
            "
          />
          {/* Underline */}
          <div
            ref={underlineRef}
            className="
              absolute
              -bottom-2
              left-0
              shadow-[0_0_12px_rgba(45,212,191,.7)]
              h-0.5
              w-full
              bg-linear-to-r
              from-teal-400
              to-lime-400
            "
          />
        </div>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="
            mt-8
            text-[10px]
            sm:text-xs
            md:text-sm
            uppercase
            tracking-[0.28em]
            sm:tracking-[0.35em]
            text-slate-400
            text-balance
          ">
          Munsyari Youth Welfare Association
        </p>
      </div>
    </div>
  );
};

export default MywaLoader;
