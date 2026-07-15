import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";

const Gallery = () => {
  const galleryData = [
    {
      id: 1,
      title: "Career Counseling 2025",
      category: "Education",
      image: "https://ik.imagekit.io/fmkamttxp/MYWA/Workshop%20Dehradun.jpeg",
      span: "md:col-span-2 md:row-span-2",
    },
    {
      id: 2,
      title: "Health Checkup Camp",
      category: "Infrastructure",
      image: "https://ik.imagekit.io/fmkamttxp/MYWA/health-checkUp.jpeg",
      span: "md:col-span-1 md:row-span-1",
    },
    {
      id: 3,
      title: "Dehradun Branch celebrate holi 2024 ",
      category: "Community",
      image:
        "https://ik.imagekit.io/fmkamttxp/MYWA/mywa-2.jpeg?updatedAt=1772889783372",
      span: "md:col-span-1 md:row-span-1",
    },
    {
      id: 4,
      title: "Book Distribution",
      category: "Education",
      image:
        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2073&auto=format&fit=crop",
      span: "md:col-span-2 md:row-span-2", // Lumbi (Vertical) image
    },
    {
      id: 5,
      title: "Haldwani  Workshop",
      category: "Workshop",
      image: "https://ik.imagekit.io/fmkamttxp/MYWA/Workshop%20haldwani.jpeg",
      span: "md:col-span-2 md:row-span-1",
    },
  ];

  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedIndex, setSelectedIndex] = useState(null);

  const filters = [
    "All",
    "Education",
    "Infrastructure",
    "Community",
    "Workshop",
  ];

  const filteredGallery =
    activeFilter === "All"
      ? galleryData
      : galleryData.filter((item) => item.category === activeFilter);

  // Slider Navigation Functions
  const handleNext = useCallback(
    (e) => {
      e?.stopPropagation();
      setSelectedIndex((prev) =>
        prev === filteredGallery.length - 1 ? 0 : prev + 1,
      );
    },
    [filteredGallery.length],
  );

  // handle previous button click
  const handlePrev = useCallback(
    (e) => {
      e?.stopPropagation();
      setSelectedIndex((prev) =>
        prev === 0 ? filteredGallery.length - 1 : prev - 1,
      );
    },
    [filteredGallery.length],
  );

  const closeModal = () => setSelectedIndex(null);

  // Keyboard Navigation Support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return; // if no image is selected, ignore key presses
      if (e.key === "ArrowRight") handleNext();
      else if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleKeyDown);

    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [selectedIndex, handleNext, handlePrev]);
  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="w-full py-24 px-4 overflow-hidden relative">
      {/* Ambient Background */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-lime-500/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            <span className="text-lime-400 font-mono text-sm  tracking-wider uppercase mb-3 block">
              Gallery
            </span>
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6">
              Capturing the Journey
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Every photograph tells the story of a community growing together
              through education, service and leadership.
            </p>
          </motion.div>
        </div>

        {/* Filter Buttons (Optional but looks premium) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setActiveFilter(filter);
                setSelectedIndex(null); // Close modal when filter changes
              }}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === filter
                  ? "bg-linear-to-r from-teal-500 to-lime-500 text-black shadow-lg shadow-teal-500/20"
                  : "bg-white/5 border border-white/10   text-zinc-400 hover:text-white hover:bg-white/10 hover:scale-105  "
              }`}>
              {filter}
            </button>
          ))}
        </motion.div>

        {/* Bento Grid Gallery */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 auto-rows-[250px] gap-4">
          <AnimatePresence mode="popLayout">
            {filteredGallery.map((item, index) => (
              <motion.div
                layout // Smooth layout changes during filtering
                variants={itemVariants}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, scale: 0.9 }}
                key={item.id}
                onClick={() => setSelectedIndex(index)}
                className={`relative group rounded-2xl overflow-hidden cursor-pointer ${item.span} bg-zinc-900 border border-white/10`}>
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  fetchpriority={index === 0 ? "high" : "auto"}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  {/* Category Pill */}
                  <span className="w-fit text-xs font-mono uppercase tracking-wider bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full border border-teal-500/30 mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {item.category}
                  </span>

                  {/* Title & Icon */}
                  <div className="flex items-center justify-between transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                    <h3 className="text-xl font-semibold text-white">
                      {item.title}
                    </h3>
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                      <Maximize2
                        size={18}
                        className="text-white group-hover:rotate-12 transition"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
      {/* lightBox model (full screen image viewer) */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 z-9999 flex items-center justify-center p-4 md:p-12 bg-black/90 backdrop-blur-sm cursor-zoom-out">
            {/* Top Bar with Counter & Close Button */}
            <div className="absolute top-0 left-0 w-full p-6 flex items-center justify-between z-50">
              <div className="text-zinc-400 font-mono text-sm tracking-wider">
                {selectedIndex + 1} / {filteredGallery.length}
              </div>
              <button
                onClick={closeModal}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-md transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Previous Button */}
            <button
              onClick={handlePrev}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-teal-500 flex items-center justify-center text-white backdrop-blur-md transition-all hover:scale-110 z-50">
              <ChevronLeft size={28} />
            </button>

            {/* Slider Content */}
            <div
              className="relative max-w-6xl w-full max-h-screen p-4 md:p-12 flex flex-col items-center justify-center cursor-default"
              onClick={(e) => e.stopPropagation()}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center">
                  <img
                    src={filteredGallery[selectedIndex].image}
                    alt={filteredGallery[selectedIndex].title}
                    loading="lazy"
                    className="max-h-[75vh] w-auto object-contain rounded-xl shadow-2xl shadow-black select-none"
                  />
                  <div className="mt-6 text-center">
                    <span className="inline-block text-xs font-mono uppercase tracking-wider bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full border border-teal-500/30 mb-3">
                      {filteredGallery[selectedIndex].category}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-semibold text-white">
                      {filteredGallery[selectedIndex].title}
                    </h3>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-teal-500 flex items-center justify-center text-white backdrop-blur-md transition-all hover:scale-110 z-50">
              <ChevronRight size={28} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
