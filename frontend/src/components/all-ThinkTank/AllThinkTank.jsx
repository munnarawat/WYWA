import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Trophy, Calendar } from "lucide-react";
import api from "../../utils/api";
import toast from "react-hot-toast";

const SpotlightCard = ({ children, className = "" }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 transition-all duration-500 hover:-translate-y-2 hover:border-white/20 group ${className}`}>
      {/* Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(45,212,191,0.15), transparent 40%)`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

// skelton ui
const ThinkTankSkelton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((item, index) => {
        const isFeatured = index === 0;
        return (
          <div
            key={item._id}
            className={
              isFeatured
                ? "md:col-span-2 md:row-span-2 rounded-2xl "
                : "col-span-1"
            }>
            <div className="p-6 h-full bg-white/5 rounded-2xl flex flex-col justify-between animate-pulse">
              <div className="flex justify-between items-start mb-6">
                <div className="relative overflow-hidden rounded-2xl w-20 h-20 bg-slate-800 border border-white/10 shrink-0" />
                <div className=" rounded-3xl bg-slate-800 h-6 w-24" />
              </div>
              <div className="space-y-3 grow">
                <div className="w-1/2 h-6 rounded-lg animate-pulse bg-slate-800" />
                <div className="w-2/6 h-6 rounded-lg animate-pulse bg-slate-800" />
                <div className="w-3/4 h-6 rounded-lg animate-pulse bg-slate-800" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
// 🏆 Main AllThinkTank Section
const AllThinkTank = () => {
  const [AllThinkTank, setAllThinkTank] = useState([]);

  useEffect(() => {
    const fetchAllThinkTank = async () => {
      try {
        const res = await api.get("/thinkTank");
        if (res.data.success) {
          setAllThinkTank(res.data.members);
        }
      } catch (error) {
        console.error("Error fetching AllThinkTank:", error);
        toast.error("Failed to load AllThinkTank.");
      }
    };
    fetchAllThinkTank();
  }, []);
  console.log(AllThinkTank);

  return (
    <section className="w-full py-24 px-4 md:px-8  overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16">
          <span className="text-teal-400 font-bold tracking-widest uppercase text-sm bg-teal-500/10 px-4 py-1.5 rounded-full border border-teal-500/20 inline-flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4" />
            Think Tank
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            Our
            <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-blue-500">
              Our Think Tank
            </span>
          </h2>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto text-lg">
            Meet the visionaries and relentless supporters who believed in the
            dream of empowering the youth and made MYWA a reality.
          </p>
        </motion.div>

        {/* Bento Grid */}
        {AllThinkTank.length === 0 ? (
          <ThinkTankSkelton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {AllThinkTank.map((item, index) => {
              const isFeatured = index === 0;
              return (
                <SpotlightCard
                  key={item._id}
                  className={
                    isFeatured ? "md:col-span-2 md:row-span-2" : "col-span-1"
                  }>
                  <div
                    className={`p-6 h-full flex flex-col ${isFeatured ? "justify-between" : ""}`}>
                    {/* Top Section: Photo & Badge */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="relative overflow-hidden rounded-2xl w-20 h-20 border border-white/10 shrink-0">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover lg:grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-800 flex items-center justify-center uppercase text-2xl font-bold text-slate-500">
                            {item.name.charAt(0)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Section: Details */}
                    <div className="space-y-3 grow">
                      <div>
                        <h3
                          className={`${isFeatured ? "text-3xl" : "text-xl"} font-bold text-white mb-1 capitalize group-hover:text-teal-300 transition-colors`}>
                          {item.name}
                        </h3>
                        <p className="text-transparent bg-clip-text bg-linear-to-r from-amber-200 to-amber-500 font-semibold inline-flex items-center gap-2">
                          {item.roleOrContribution}
                        </p>
                      </div>

                      <p
                        className={`text-slate-400 ${isFeatured ? "text-base line-clamp-3" : "text-sm line-clamp-2"}`}>
                        "{item.description}"
                      </p>
                    </div>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default AllThinkTank;
