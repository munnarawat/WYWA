import React from "react";
import { motion } from "framer-motion";
import { Edit2, Trash2, ExternalLink, Star } from "lucide-react";

const ThinkTankCard = ({ member, onEdit, onDelete }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: {
          opacity: 1,
          y: 0,
          transition: { type: "spring", stiffness: 280 },
        },
      }}
      className="group relative rounded-[20px] p-px overflow-hidden cursor-pointer h-full"
      style={{
        background:
          "linear-gradient(135deg, rgba(20,184,166,0.2), rgba(255,255,255,0.03), rgba(132,204,22,0.1))",
      }}>
      <div className="bg-[#0d1117] rounded-[19px] flex flex-col h-full relative z-10 p-6">
        {/* Decorative Mesh Background */}
        <div
          className="absolute top-0 right-0 w-32 h-32 pointer-events-none rounded-tr-[19px] opacity-20 transition-opacity group-hover:opacity-100"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(20,184,166,0.25) 1px, transparent 1px)",
            backgroundSize: "12px 12px",
          }}
        />

        {/* Profile Avatar */}
        <div className="w-20 h-20 mx-auto rounded-full bg-zinc-900 border-2 border-teal-500/30 p-1 mb-5 relative group-hover:border-teal-400 group-hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all duration-300">
          {member.imageUrl ? (
            <img
              src={member.imageUrl}
              alt={member.name}
              className="w-full h-full rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full rounded-full bg-linear-to-br from-teal-900/50 to-zinc-900 flex items-center justify-center text-teal-400 text-2xl font-bold">
              {member.name.charAt(0)}
            </div>
          )}
          {/* Status Glow Dot */}
          <div className="absolute bottom-0 right-1 w-4 h-4 bg-teal-400 border-2 border-[#0d1117] rounded-full"></div>
        </div>

        {/* Info */}
        <div className="text-center flex-1 flex flex-col relative z-10">
          <h3
            className="text-[17px] font-black text-slate-100 mb-1 line-clamp-1 group-hover:text-teal-400 transition-colors"
            title={member.name}>
            {member.name}
          </h3>

          <div className="inline-flex mx-auto items-center justify-center gap-1.5 text-[10px] font-extrabold tracking-widest uppercase text-teal-400/90 mb-4 bg-teal-500/10 px-2.5 py-1 rounded-md border border-teal-500/20">
            <Star size={11} className="fill-teal-400/50" />{" "}
            {member.roleOrContribution}
          </div>

          <p className="text-zinc-400 text-[13px] line-clamp-3 leading-relaxed flex-1">
            "
            {member.description ||
              "Expert guiding the vision of the organization."}
            "
          </p>
        </div>

        {/* Footer Controls */}
        <div className="w-full flex items-center justify-between pt-4 mt-4 border-t border-white/5 relative z-10">
          <div>
            {member.contact && (
              <a
                href={
                  member.contact.startsWith("http")
                    ? member.contact
                    : `mailto:${member.contact}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-teal-400 transition flex items-center justify-center"
                title="Contact Info">
                <ExternalLink size={15} />
              </a>
            )}
          </div>

          {/* Admin Actions */}
          <div className="flex items-center gap-2 lg:opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(member)}
              className="p-2 rounded-xl bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 transition hover:scale-105"
              title="Edit">
              <Edit2 size={15} />
            </button>
            <button
              onClick={() => onDelete(member._id)}
              className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition hover:scale-105"
              title="Delete">
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ThinkTankCard;
