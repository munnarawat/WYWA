import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ACTIONS = [
  {
    label: "Add Book",
    emoji: "📚",
    path: "/admin/library",
    color: "rgba(20,184,166,0.08)",
    border: "rgba(20,184,166,0.2)",
    text: "#2dd4bf",
  },
  {
    label: "New Notice",
    emoji: "📣",
    path: "/admin/noticeboard",
    color: "rgba(132,204,22,0.08)",
    border: "rgba(132,204,22,0.2)",
    text: "#a3e635",
  },
  {
    label: "View Tickets",
    emoji: "🎫",
    path: "/admin/studentIssue",
    color: "rgba(251,113,133,0.08)",
    border: "rgba(251,113,133,0.2)",
    text: "#fb7185",
  },
  {
    label: "Add Student",
    emoji: "👤",
    path: "/admin/students",
    color: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.2)",
    text: "#fbbf24",
  },
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-2.5 flex-wrap">
      {ACTIONS.map(({ label, emoji, path, color, border, text }, i) => (
        <motion.button
          key={label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, type: "spring", stiffness: 300 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate(path)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-[13px] border text-[12px] font-bold transition-colors "
          style={{ background: color, borderColor: border, color: text }}>
          <span>{emoji}</span>
          {label}
        </motion.button>
      ))}
    </div>
  );
};

export default QuickActions;
