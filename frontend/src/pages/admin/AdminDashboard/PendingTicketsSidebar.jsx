// PendingTicketsSidebar.jsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const PendingTicketsSidebar = ({ tickets = [] }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18, type: "spring", stiffness: 260 }}
      className="relative rounded-[20px] p-px"
      style={{
        background:
          "linear-gradient(135deg, rgba(251,113,133,0.3), rgba(255,255,255,0.04), rgba(249,115,22,0.15))",
      }}>
      <div className="bg-[#0d1117] rounded-[19px] p-5 relative overflow-hidden">
        <div
          className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none rounded-br-[19px]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "12px 12px",
          }}
        />

        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-[15px] font-bold text-slate-100 flex items-center gap-2">
            🚨 Pending Tickets
          </h3>
          {tickets.length > 0 && (
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border"
              style={{
                background: "rgba(251,113,133,0.08)",
                borderColor: "rgba(251,113,133,0.2)",
                color: "#fb7185",
              }}>
              {tickets.length} Urgent
            </span>
          )}
        </div>

        {tickets.length === 0 ? (
          <p className="text-sm text-slate-600 text-center py-6">
            ✅ No pending tickets!
          </p>
        ) : (
          <div className="space-y-2">
            {tickets.map((ticket, i) => (
              <motion.div
                key={ticket._id}
                onClick={() => navigate("/admin/studentIssue")}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.22 + i * 0.06 }}
                whileHover={{ x: 3 }}
                className="flex items-center gap-3 px-3.5 py-3 rounded-[13px] border border-rose-400/15 bg-rose-400/4 hover:border-rose-400/30 transition-all cursor-pointer">
                <div className="w-8 h-8 rounded-[10px] bg-rose-400/10 border border-rose-400/20 flex items-center justify-center text-sm shrink-0">
                  🎫
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-slate-200 line-clamp-1">
                    {ticket.title}
                  </p>
                  <p className="text-[10px] text-slate-600 mt-0.5">
                    {ticket.student?.userName} ·{" "}
                    {new Date(ticket.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PendingTicketsSidebar;
