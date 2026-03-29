import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

// Status config
const STATUS_CONFIG = {
  returned: {
    label: "Returned",
    className: "bg-teal-400/10 border-teal-400/20 text-teal-400",
  },
  issued: {
    label: "Issued",
    className: "bg-amber-400/10 border-amber-400/20 text-amber-400",
  },
  overdue: {
    label: "Overdue ⚠️",
    className: "bg-rose-400/10 border-rose-400/20 text-rose-400",
  },
};

// Checks if book is overdue
const getStatus = (record) => {
  if (record.status === "returned") return "returned";
  if (record.dueDate && new Date(record.dueDate) < new Date()) return "overdue";
  return "issued";
};

const BookCard = ({ record, index }) => {
  const status = getStatus(record);
  const { label, className } = STATUS_CONFIG[status];
  const dateLabel = status === "returned" ? "Returned On" : "Issued On";
  const date = new Date(record.returnedAt || record.issuedAt || record.createdAt)
    .toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, delay: index * 0.06 } },
      }}
      whileHover={{ y: -4 }}
      className="relative rounded-2xl p-[1px] cursor-pointer"
      style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(255,255,255,0.04))" }}
    >
      <div className="bg-[#0d1117] rounded-[15px] p-[18px] relative overflow-hidden">

        {/* Mesh */}
        <div
          className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none rounded-br-[15px]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "10px 10px",
          }}
        />

        {/* Book icon */}
        <div className="w-9 h-9 rounded-[11px] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
          <BookOpen size={16} />
        </div>

        <h4
          className="font-bold text-[14px] text-slate-100 mb-1 line-clamp-1"
          
        >
          {record.book?.title || "Unknown Book"}
        </h4>
        <p className="text-[11px] text-slate-500 mb-3">
          By {record.book?.author || "Unknown"}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
          <div>
            <p className="text-[9px] font-bold tracking-widest uppercase text-slate-600">{dateLabel}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{date}</p>
          </div>
          <span className={`text-[9px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-md border ${className}`}>
            {label}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const IssuedBooks = ({ issuedBooks = [] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="relative rounded-[20px] p-[1px]"
      style={{
        background: "linear-gradient(135deg, rgba(20,184,166,0.28), rgba(255,255,255,0.05), rgba(132,204,22,0.15))",
      }}
    >
      <div className="bg-[#0d1117] rounded-[19px] p-6 relative overflow-hidden">

        {/* Mesh */}
        <div
          className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none rounded-br-[19px]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        />

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3
            className="text-[17px] font-bold text-slate-100 flex items-center gap-2"
          >
            📚 My Library Books
          </h3>
          {issuedBooks.length > 0 && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/[0.05] text-slate-500">
              {issuedBooks.filter((b) => b.status !== "returned").length} Active
            </span>
          )}
        </div>

        {/* Divider label */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[10px] font-bold tracking-widest uppercase text-slate-600">Currently issued</span>
          <div className="flex-1 h-px bg-white/[0.05]" />
        </div>

        {/* Empty state */}
        {issuedBooks.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-white/[0.08] rounded-2xl">
            <BookOpen size={32} className="mx-auto text-slate-700 mb-3" />
            <p className="text-slate-500 text-sm">You haven't issued any books yet.</p>
          </div>
        ) : (
          <motion.div
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {issuedBooks.map((record, i) => (
              <BookCard key={record._id} record={record} index={i} />
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default IssuedBooks;