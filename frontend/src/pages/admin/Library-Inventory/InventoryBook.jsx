import { motion } from "framer-motion";
import { Edit2, ImageIcon, Trash2 } from "lucide-react";
import React from "react";

const InventoryBook = ({ book, index, openEditModal, confirmDelete }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: {
          opacity: 1,
          y: 0,
          transition: { type: "spring", stiffness: 280, delay: index * 0.05 },
        },
      }}
      whileHover={{ y: -6 }}
      className="relative group rounded-[20px] p-px cursor-pointer"
      style={{
        background:
          "linear-gradient(135deg, rgba(20,184,166,0.28), rgba(255,255,255,0.04), rgba(132,204,22,0.12))",
      }}>
      <div className="bg-[#0d1117] rounded-[19px] overflow-hidden flex flex-col h-full">
        {/* Cover */}
        <div className="w-full h-45 relative overflow-hidden bg-[#131920] flex items-center justify-center border-b border-white/5">
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <span
                className="font-extrabold text-[56px] leading-none bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, rgba(20,184,166,0.5), rgba(132,204,22,0.3))",
                }}>
                {book.title?.charAt(0)}
              </span>
              <ImageIcon size={16} className="text-slate-700" />
            </div>
          )}

          {/* Bottom gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#0d1117]/70 pointer-events-none" />

          {/* Availability badge */}
          <div className="absolute top-2.5 right-2.5">
            <span
              className={`text-[9px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-[7px] border backdrop-blur-md
              ${
                book.available > 0
                  ? "bg-lime-400/15 border-lime-400/30 text-lime-400"
                  : "bg-rose-400/15 border-rose-400/30 text-rose-400"
              }`}>
              {book.available > 0
                ? `${book.available} Available`
                : "Unavailable"}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="px-4 py-4 flex flex-col flex-1 relative">
          {/* Mesh */}
          <div
            className="absolute bottom-0 right-0 w-14 h-14 pointer-events-none rounded-br-[19px]"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "8px 8px",
            }}
          />
          <span className="text-[9px] font-extrabold tracking-widest uppercase text-teal-500/70 mb-1.5">
            {book.category || "General"}
          </span>
          <h3
            className="text-[14px] font-bold text-slate-100 mb-1 line-clamp-1 group-hover:text-teal-400 transition-colors"
            title={book.title}>
            {book.title}
          </h3>
          <p className="text-[11px] text-slate-500 line-clamp-1">
            By {book.author}
          </p>
          {/* hover edit icon */}
          <div className="flex mt-2 items-center justify-between gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => openEditModal(book)}
              className="p-1.5 rounded-md bg-teal-500/10 text-teal-400/80 hover:bg-teal-500/20 transition">
              <Edit2 size={14} />
            </button>
            <button
              onClick={() => confirmDelete(book._id)}
              className="p-1.5 rounded-md bg-rose-500/10 text-rose-400/80 hover:bg-rose-500/20 transition">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InventoryBook;
