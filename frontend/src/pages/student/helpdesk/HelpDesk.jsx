import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LifeBuoy, Plus } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../utils/api";

import TicketStatsGrid from "./TicketStatsGrid";
import TicketCard from "./TicketCard";
import RaiseTicketModal from "./RaiseTicketModal";

// ─────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────
const TicketSkeleton = () => (
  <div className="flex flex-col gap-3">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="h-24 rounded-[18px] animate-pulse"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.05)",
          animationDelay: `${i * 0.1}s`,
        }}
      />
    ))}
  </div>
);

// ─────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────
const EmptyState = ({ onRaise }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative rounded-[20px] p-px"
    style={{
      background:
        "linear-gradient(135deg, rgba(20,184,166,0.15), rgba(255,255,255,0.03))",
    }}>
    <div className="bg-[#0d1117] rounded-[19px] py-14 flex flex-col items-center text-center border border-dashed border-white/8">
      <div className="text-4xl mb-4">🛟</div>
      <p className="text-[15px] font-semibold text-slate-400 mb-1">
        No tickets raised yet
      </p>
      <p className="text-[13px] text-slate-600 mb-6">
        If you face any issue, feel free to raise a ticket.
      </p>
      <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={onRaise}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-[#080c10]"
        style={{
          background: "linear-gradient(135deg, #14b8a6, #84cc16)",
        }}>
        <Plus size={16} /> Raise First Ticket
      </motion.button>
    </div>
  </motion.div>
);

// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────
const HelpDesk = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ── Fetch tickets ──────────────────────
  const fetchMyTickets = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/ticket/my");
      if (res.data.success) setTickets(res.data.tickets || []);
    } catch (error) {
      console.error("Fetch tickets error:", error);
      toast.error("Failed to load your tickets.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyTickets();
  }, [fetchMyTickets]);

  return (
    <div className="w-full min-h-screen text-white p-4 md:p-8 pb-24 overflow-y-auto flex flex-col gap-6">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-6 border-b border-white/5">
        <div>
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] font-semibold tracking-widest uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            MYWA · Student Support
          </div>

          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-extrabold bg-clip-text text-transparent mb-2"
            style={{
              fontSize: "clamp(26px, 3.5vw, 40px)",
              backgroundImage:
                "linear-gradient(135deg, #f0fdf4 0%, #14b8a6 50%, #84cc16 100%)",
            }}>
            Help Desk
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[14px] text-slate-500">
            Report issues, ask for help, and track your complaints.
          </motion.p>
        </div>

        {/* Raise Ticket Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          whileHover={{ y: -3 }}
          className="relative rounded-[14px] p-px shrink-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(20,184,166,0.5), rgba(132,204,22,0.4))",
          }}>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-[13px] font-bold text-[14px] text-[#080c10] transition-opacity hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #14b8a6, #84cc16)",
            }}>
            <Plus size={17} />
            Raise Ticket
          </button>
        </motion.div>
      </div>
      {/* ── STATS ── */}
      <TicketStatsGrid tickets={tickets} />

      {/* Section label */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-bold tracking-widest uppercase text-slate-600 whitespace-nowrap">
          Your tickets
        </span>
        <div className="flex-1 h-px bg-white/5" />
        {!isLoading && tickets.length > 0 && (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/4 text-slate-600 border border-white/6">
            {tickets.length} Total
          </span>
        )}
      </div>

      {/* ── TICKET LIST ── */}
      {isLoading ? (
        <TicketSkeleton />
      ) : tickets.length === 0 ? (
        <EmptyState onRaise={() => setIsModalOpen(true)} />
      ) : (
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.07 } },
          }}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-3">
          {tickets.map((ticket, i) => (
            <TicketCard key={ticket._id} ticket={ticket} index={i} />
          ))}
        </motion.div>
      )}

      {/* ── MODAL ── */}
      <RaiseTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchMyTickets}
      />
    </div>
  );
};
export default HelpDesk;
