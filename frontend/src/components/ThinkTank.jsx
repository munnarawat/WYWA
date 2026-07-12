import React, { useState } from "react";
import { motion } from "framer-motion";
import { Instagram, Twitter, Mail, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";
const ThinkTank = () => {
  // const [visionaries, setVisionaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const visionaries = [
    {
      id: 1,
      name: "Dr. Ramesh Singh",
      role: "Chief Mentor & Founder",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&auto=format&fit=crop",
      bio: "The guiding light behind MYWA. His vision for accessible education in Munsyari laid the foundation for our organization.",
      accent: "from-teal-500 to-teal-700",
      glow: "bg-teal-500/20",
    },
    {
      id: 2,
      name: "Priya Rawat",
      role: "Strategy & Operations",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop",
      bio: "Instrumental in scaling our libraries across Dehradun and Haldwani. She turns our community ideas into ground reality.",
      accent: "from-lime-500 to-green-700",
      glow: "bg-lime-500/20",
    },
    {
      id: 3,
      name: "Amit Kumar",
      role: "Community Leader",
      image:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=256&auto=format&fit=crop",
      bio: "A relentless force connecting the youth. Amit ensures that every student gets the right guidance and mentorship.",
      accent: "from-amber-500 to-orange-700",
      glow: "bg-amber-500/20",
    },
  ];

  const fetchVisionaries = async ()=>{
    try{
      const res = await api.get("/thinkTank/main")
      if(res.data.success){
        
      }
    }catch(error){
      console.error(error);
    }finally{
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };
  return (
    <section className="w-full py-24 px-4 overflow-hidden relative">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-teal-500/10 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            <span className="text-teal-400 font-mono text-sm tracking-wider uppercase mb-3 block flex items-center justify-center gap-2">
              <Quote size={14} /> The Birth of MYWA <Quote size={14} />
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6">
              Our Think Tank
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Meet the visionaries and relentless supporters who believed in the
              dream of empowering the youth and made MYWA a reality.
            </p>
          </motion.div>
        </div>

        {/* Profile Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visionaries.map((person) => (
            <motion.div
              key={person.id}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="relative group rounded-2xl border border-white/10 bg-white/5 p-8 overflow-hidden transition-all duration-300 hover:border-white/20 hover:bg-white/10 flex flex-col ease-out items-center text-center">
              {/* Ambient Hover Glow behind card */}
              <div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${person.glow} -z-10`}
              />

              {/* Profile Image with Gradient Ring */}
              <div className="relative mb-6">
                <div
                  className={`absolute -inset-1.5 bg-linear-to-br ${person.accent} rounded-full blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-500`}
                />
                <div className="relative w-32 h-32 rounded-full border-2 border-zinc-900 overflow-hidden bg-zinc-800">
                  <img
                    src={person.image}
                    alt={person.name}
                    loading="lazy"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Info */}
              <h3 className="text-2xl font-bold text-white mb-1">
                {person.name}
              </h3>
              <p className="text-sm font-mono tracking-wide text-teal-400 mb-5">
                {person.role}
              </p>

              <p className="text-zinc-400 text-sm leading-relaxed mb-8 flex-grow">
                "{person.bio}"
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-4 mt-auto">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all">
                  <Instagram size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all">
                  <Twitter size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all">
                  <Mail size={18} />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
        {/* redirect to think-tank page */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex mx-auto justify-center w-full">
          <Link
            to="/all-thinkTank"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white transition-all flex items-center gap-2 group">
            View All ThinkTank
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ThinkTank;
