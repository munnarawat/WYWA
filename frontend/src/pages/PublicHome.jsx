import { lazy, Suspense } from "react";
import Hero from "../components/Hero";

const WhatWeDo = lazy(() => import("../components/WhatWeDo"));
const OurImpact = lazy(() => import("../components/OurImpact"));
const Achievements = lazy(() => import("../components/Achievements"));
const Gallery = lazy(() => import("../components/Gallery"));
const ThinkTank = lazy(() => import("../components/ThinkTank"));

const SectionSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto  h-87.5 rounded-3xl bg-white/5 animate-pulse my-10" />
  );
};
const PublicHome = () => {
  return (
    <div className="w-full min-h-screen text-white relative px-0  md:px-8 py-6 ">
      {/* hero section */}
      <Hero />

      <Suspense fallback={<SectionSkeleton />}>
        <WhatWeDo />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <OurImpact />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <Achievements />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <Gallery />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <ThinkTank />
      </Suspense>
    </div>
  );
};

export default PublicHome;
