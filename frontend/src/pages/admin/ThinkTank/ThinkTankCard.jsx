import React from "react";
import { motion } from "framer-motion";
import { Edit2, Trash2, Link as LinkIcon } from "lucide-react";

const ThinkTankCard = ({ member, onEdit, onDelete }) => {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
      className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-indigo-500/40 transition-all hover:-translate-y-2 hover:shadow-2xl flex flex-col items-center text-center h-full"
    >
      {/* Profile Avatar */}
      <div className="w-24 h-24 rounded-full bg-zinc-900 border-2 border-indigo-500/30 p-1 mb-4 relative group-hover:border-indigo-400 transition-colors">
        {member.imageUrl ? (
          <img src={member.imageUrl} alt={member.name} className="w-full h-full rounded-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = ""; }} />
        ) : (
          <div className="w-full h-full rounded-full bg-linear-to-br from-indigo-900 to-zinc-900 flex items-center justify-center text-indigo-400 text-2xl font-bold">
            {member.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Name and Role */}
      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors line-clamp-1" title={member.name}>
        {member.name}
      </h3>
      <p className="text-indigo-400 font-medium text-sm mb-3 line-clamp-1">
        {member.roleOrContribution}
      </p>

      {/* Description */}
      <p className="text-zinc-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
        {member.description || "No description provided."}
      </p>

      {/* Footer Controls & Contact */}
      <div className="w-full flex items-center justify-center gap-2 pt-4 border-t border-white/10">
        {member.contact && (
          <a href={member.contact.startsWith('http') ? member.contact : `mailto:${member.contact}`} target="_blank" rel="noopener noreferrer" 
             className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition" title="Contact / LinkedIn">
            <LinkIcon size={16} />
          </a>
        )}
        
        {/* Admin Actions */}
        <div className="flex items-center gap-2 lg:opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(member)} className="p-2 rounded-lg bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 transition" title="Edit">
            <Edit2 size={16} />
          </button>
          <button onClick={() => onDelete(member._id)} className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition" title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ThinkTankCard;