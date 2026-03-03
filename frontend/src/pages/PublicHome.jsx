import { Book } from "lucide-react";
import React from "react";
import Hero from "../components/Hero";

const PublicHome = () => {
  return (
    <div className="w-full min-h-screen text-white relative px-6  md:px-8 py-10 ">
      {/* hero section */}
      <Hero />
    </div>
  );
};

export default PublicHome;
