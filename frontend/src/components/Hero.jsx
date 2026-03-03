import { Book } from "lucide-react";
import React from "react";
import munsyari from "../images/munsyari.jpeg";

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden ">
      <div className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
        {/* Left Content */}
        <div className="w-full md:w-1/2 space-y-6">
          {/* Badge */}
          <div className="w-fit flex items-center gap-2 border border-white/10 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2">
            <Book size={18} className="text-teal-400" />
            <span className="text-sm text-zinc-300 tracking-wide">
              Empowering Education
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
            <span className="text-white">Munsyari Youth</span>
            <br />
            <span className="bg-gradient-to-r from-teal-400 to-lime-400 bg-clip-text text-transparent">
              Welfare Association
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-zinc-300 md:w-4/5">
            Building disciplined minds and empowering futures through education,
            leadership, and community excellence.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <button className="px-6 py-3 rounded-md bg-gradient-to-r from-teal-500 to-lime-500 text-black font-semibold hover:scale-105 transition-all duration-300 shadow-lg shadow-teal-500/20">
              Join Your Branch
            </button>

            <button className="px-6 py-3 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 text-white">
              Explore Impact
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-1/2 h-80 md:h-[420px] rounded-2xl overflow-hidden shadow-2xl shadow-black/40 group">
          <img
            src={munsyari}
            alt="Munsyari"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
