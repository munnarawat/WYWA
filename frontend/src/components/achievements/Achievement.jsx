import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Trophy, Calendar } from "lucide-react";
import axios from "axios";

// 🪄 Spotlight Hover Effect Component (The Magic Card)
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
      className={`relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 transition-all duration-500 hover:-translate-y-2 hover:border-white/20 group ${className}`}
    >
      {/* Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(45,212,191,0.15), transparent 40%)`,
        }}
      />
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

// 🏆 Main Achievement Section
const Achievement = () => {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const mockData = [
      {
        _id: "1",
        studentName: "Aarav Sharma",
        examName: "TCS Ninja / Digital",
        year: 2025,
        description: "Secured top rank in the national level coding hackathon and cracked the interview with flying colors.",
        imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop",
        branch: "dehradun",
      },
      {
        _id: "2",
        studentName: "Neha Gupta",
        examName: "Wipro Elite",
        year: 2025,
        description: "Successfully cleared all 4 rounds including the tough system design interview.",
        imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
        branch: "haldwani",
      },
      {
        _id: "3",
        studentName: "Rohan Verma",
        examName: "Infosys DSE",
        year: 2024,
        description: "Specialized in backend architecture and landed the Specialist Programmer role.",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
        branch: "dehradun",
      },
      {
        _id: "4",
        studentName: "Priya Singh",
        examName: "Google Summer of Code",
        year: 2024,
        description: "Contributed to major open-source web3 projects and got fully funded.",
        imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop",
        branch: "haldwani",
      },
      {
        _id: "5",
        studentName: "Arjun Patel",
        examName: "Amazon SDE Internship",
        year: 2024,
        description: "Secured a 6-month internship at Amazon with a focus on software development.",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
        branch: "dehradun",
      },
      {
        _id: "6",
        studentName: "Sanya Kapoor",
        examName: "Microsoft Explore Internship",
        year: 2024,
        description: "Landed a prestigious internship at Microsoft, working on cutting-edge AI projects.",
        imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
        branch: "haldwani",  
      },
      {
        _id: "7",
        studentName: "Karan Mehta",
        examName: "Adobe Research Internship",
        year: 2024,
        description: "Secured an internship at Adobe Research, contributing to innovative projects in computer vision.",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
        branch: "haldwani",
      }
    ];
    setAchievements(mockData);
  }, []);

  return (
    <section className="w-full py-24 px-4 md:px-8  overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-teal-400 font-bold tracking-widest uppercase text-sm bg-teal-500/10 px-4 py-1.5 rounded-full border border-teal-500/20 inline-flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4" /> Wall of Fame
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            Our Top <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-blue-500">Achievers</span>
          </h2>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto text-lg">
            Celebrating the brilliant minds who cracked top exams and placements through sheer dedication and hard work.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {achievements.map((item, index) => {
            const isFeatured = index === 0;

            return (
              <SpotlightCard 
                key={item._id} 
                className={isFeatured ? "md:col-span-2 md:row-span-2" : "col-span-1"}
              >
                <div className={`p-6 h-full flex flex-col ${isFeatured ? "justify-between" : ""}`}>
                  
                  {/* Top Section: Photo & Badge */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="relative overflow-hidden rounded-2xl w-20 h-20 border border-white/10 shrink-0">
                      {item.imageUrl ? (
                        <img 
                          src={item.imageUrl} 
                          alt={item.studentName} 
                          className="w-full h-full object-cover lg:grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-800 flex items-center justify-center text-2xl font-bold text-slate-500">
                          {item.studentName.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border ${
                      item.branch === "dehradun" 
                        ? "bg-teal-500/10 text-teal-400 border-teal-500/20" 
                        : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    }`}>
                      <MapPin className="w-3 h-3" />
                      {item.branch.charAt(0).toUpperCase() + item.branch.slice(1)}
                    </div>
                  </div>

                  {/* Bottom Section: Details */}
                  <div className="space-y-3 grow">
                    <div>
                      <h3 className={`${isFeatured ? 'text-3xl' : 'text-xl'} font-bold text-white mb-1 group-hover:text-teal-300 transition-colors`}>
                        {item.studentName}
                      </h3>
                      <p className="text-transparent bg-clip-text bg-linear-to-r from-amber-200 to-amber-500 font-semibold inline-flex items-center gap-2">
                        {item.examName} 
                        <span className="text-slate-500 text-sm flex items-center gap-1 font-normal">
                          <Calendar className="w-3 h-3" /> {item.year}
                        </span>
                      </p>
                    </div>
                    
                    <p className={`text-slate-400 ${isFeatured ? 'text-base line-clamp-3' : 'text-sm line-clamp-2'}`}>
                      "{item.description}"
                    </p>
                  </div>
                  
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Achievement;

