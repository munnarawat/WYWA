import { Book } from "lucide-react";
import React from "react";
import Hero from "../components/Hero";

const PublicHome = () => {
  return (
    <div className="w-full min-h-[200vh] text-white relative px-6  md:px-8 py-6 ">
      {/* hero section */}
      <Hero />
    </div>
  );
};

export default PublicHome;
