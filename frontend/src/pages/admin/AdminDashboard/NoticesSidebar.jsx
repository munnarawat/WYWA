// NoticesSidebar.jsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";

const NoticesSidebar = ({ notices = [] }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.24, type: "spring", stiffness: 260 }}
      className="relative rounded-[20px] p-px"
      style={{
        background:
          "linear-gradient(135deg, rgba(132,204,22,0.22), rgba(255,255,255,0.04), rgba(20,184,166,0.1))",
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
            🔔 Latest Notices
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/5 border border-white/[0.07] text-slate-500">
            {notices.length} Recent
          </span>
        </div>

        {notices.length === 0 ? (
          <div className="flex flex-col items-center py-6 text-slate-600">
            <Bell size={28} className="mb-2 opacity-40" />
            <p className="text-sm">No recent announcements.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notices.map((notice, i) => (
              <motion.div
                key={notice._id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.28 + i * 0.06 }}
                whileHover={{ x: 3 }}
                onClick={() => navigate("/admin/noticeboard")}
                className="flex items-start gap-3 px-3.5 py-3 rounded-[13px] border border-white/5 bg-white/2 hover:bg-lime-400/4 hover:border-lime-400/20 transition-all cursor-pointer">
                <span className="w-2 h-2 rounded-full bg-lime-400/40 border border-lime-400/60 shrink-0 mt-1.25" />
                <div>
                  <p className="text-[12px] font-semibold text-slate-200 leading-snug line-clamp-1 mb-1">
                    {notice.title}
                  </p>
                  <p className="text-[10px] text-slate-600">
                    {new Date(notice.createdAt).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
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

export default NoticesSidebar;
