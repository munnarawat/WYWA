import { Book } from "lucide-react";
import React from "react";
import Hero from "../components/Hero";
import WhatWeDo from "../components/WhatWeDo";

const PublicHome = () => {
  return (
    <div className="w-full min-h-screen text-white relative px-2  md:px-8 py-6 ">
      {/* hero section */}
      <Hero />
      <WhatWeDo/>
    </div>
  );
};

export default PublicHome;
