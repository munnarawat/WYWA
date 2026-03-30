import { motion } from "framer-motion";
import { ArrowRight, Calendar, User, Edit2, Trash2 } from "lucide-react";  

const BADGE_STYLES = {
  urgent: "bg-red-500/10 border-red-500/20 text-red-400",
  event: "bg-teal-500/10 border-teal-500/20 text-teal-400",
  important: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  meeting: "bg-purple-500/10 border-purple-500/20 text-purple-400",
  announcement: "bg-teal-500/10 border-teal-500/20 text-teal-400",
};

const isNew = (date) =>
  (Date.now() - new Date(date)) / (1000 * 60 * 60 * 24) <= 3;

const NoticeCard = ({ notice, index, isAdmin, onEdit, onDelete }) => {
  const category = notice.category?.toLowerCase() || "announcement";
  const badgeClass = BADGE_STYLES[category] || BADGE_STYLES.announcement;

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 28 },
        show: {
          opacity: 1,
          y: 0,
          transition: { type: "spring", stiffness: 280, delay: index * 0.07 },
        },
      }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="group relative rounded-[20px] p-px cursor-pointer"
      style={{
        background:
          "linear-gradient(135deg, rgba(20,184,166,0.3), rgba(255,255,255,0.05), rgba(132,204,22,0.15))",
      }}
    >
      <div className="relative bg-[#0d1117] rounded-[19px] p-6 flex flex-col justify-between min-h-[230px] overflow-hidden">
        {/* Hover glow */}
        <div
          className="absolute top-0 right-0 w-48 h-48 rounded-full -mr-16 -mt-16 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(circle, rgba(20,184,166,0.12), transparent 70%)",
          }}
        />

        <div className="relative z-10">
          {/* Top: badge + NEW tag */}
          <div className="flex justify-between items-start mb-4">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${badgeClass}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {notice.category || "Announcement"}
            </span>
            {isNew(notice.createdAt) && (
              <span
                className="text-[9px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-full text-[#0d1117]"
                style={{ background: "linear-gradient(135deg, #14b8a6, #84cc16)" }}
              >
                New
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className="font-bold text-[17px] leading-snug text-slate-100 mb-2.5 group-hover:text-teal-400 transition-colors duration-300"
          >
            {notice.title}
          </h3>

          {/* Description */}
          <p className="text-[13.5px] text-slate-500 leading-relaxed line-clamp-2">
            {notice.description}
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-[11.5px] text-slate-500">
              <Calendar size={12} className="text-slate-400" />
              {new Date(notice.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
            <div className="flex items-center gap-2 text-[11.5px] text-slate-500">
              <User size={12} className="text-slate-400" />
              <span className="capitalize">
                {notice.createdBy?.userName || "Admin"}
              </span>
            </div>
          </div>

          {/*admin*/}
          {isAdmin ? (
            <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation(); 
                  onEdit(notice);
                }}
                className="p-2 rounded-lg bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 transition"
                title="Edit"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(notice._id);
                }}
                className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full flex items-center justify-center border border-white/10 bg-white/[0.04] group-hover:bg-teal-500/15 group-hover:border-teal-500/40 transition-all duration-300">
              <ArrowRight
                size={15}
                className="text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all duration-300"
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NoticeCard;