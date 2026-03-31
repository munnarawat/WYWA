import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Clock, ImageIcon } from "lucide-react";

// Due status helper
export const getDueStatus = (dueDate, status) => {
  if (status === "returned") return {
    text: "Returned ✅",
    className: "bg-emerald-400/[0.08] border-emerald-400/20 text-emerald-400",
    Icon: CheckCircle,
  };

  const diffDays = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return {
    text: `Overdue by ${Math.abs(diffDays)} days`,
    className: "bg-rose-400/[0.08] border-rose-400/20 text-rose-400",
    Icon: AlertCircle,
  };
  if (diffDays <= 3) return {
    text: `Due in ${diffDays} day${diffDays !== 1 ? "s" : ""}`,
    className: "bg-amber-400/[0.08] border-amber-400/20 text-amber-400",
    Icon: Clock,
  };
  return {
    text: `Due: ${new Date(dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`,
    className: "bg-teal-400/[0.08] border-teal-400/20 text-teal-400",
    Icon: Clock,
  };
};

const IssuedBookCard = ({ issue, index }) => {
  const { text, className, Icon } = getDueStatus(issue.dueDate, issue.status);
  const book = issue.book;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, delay: index * 0.05 } },
      }}
      whileHover={{ y: -5 }}
      className="relative rounded-[20px] p-px cursor-pointer"
      style={{
        background: "linear-gradient(135deg, rgba(132,204,22,0.22), rgba(255,255,255,0.04), rgba(20,184,166,0.12))",
      }}
    >
      <div className="bg-[#0d1117] rounded-[19px] overflow-hidden flex flex-col h-full">

        {/* Cover */}
        <div className="w-full h-[150px] relative overflow-hidden bg-[#131920] flex items-center justify-center border-b border-white/5">
          {book?.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover opacity-60 transition-opacity"
              style={{ filter: "grayscale(0.3)" }}
            />
          ) : (
            <span
              className="font-extrabold text-[52px] leading-none bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, rgba(132,204,22,0.4), rgba(20,184,166,0.2))",
              }}
            >
              {book?.title?.charAt(0)}
            </span>
          )}

          <div className="absolute inset-0 bg-linear-to-b from-transparent to-[#0d1117]/70 pointer-events-none" />

          {/* Issued date overlay */}
          <div className="absolute top-2 left-2">
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border bg-black/50 text-white/60 border-white/10 backdrop-blur-md">
              Issued: {new Date(issue.issuedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1 relative">
          <div
            className="absolute bottom-0 right-0 w-14 h-14 pointer-events-none rounded-br-[19px]"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "8px 8px",
            }}
          />
          <span className="text-[9px] font-extrabold tracking-widest uppercase text-lime-500/70 mb-1.5">
            {book?.category || "General"}
          </span>
          <h3
            className="text-[14px] font-bold text-slate-100 mb-1 line-clamp-1"
            title={book?.title}
          >
            {book?.title}
          </h3>
          <p className="text-[11px] text-slate-500 line-clamp-1 mb-3">
            By {book?.author}
          </p>

          {/* Due status */}
          <div className={`mt-auto flex items-center gap-2 px-3 py-2.5 rounded-xl border text-[10px] font-extrabold tracking-wider uppercase ${className}`}>
            <Icon size={13} />
            {text}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default IssuedBookCard;