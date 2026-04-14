export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatShortDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const ROLE_CONFIG = {
  admin: {
    label: "Admin",
    emoji: "🛡️",
    className: "bg-violet-500/[0.08] border-violet-500/20 text-violet-400",
  },
  thinkTank: {
    label: "Think-Tank",
    emoji: "💡",
    className: "bg-blue-500/[0.08] border-blue-500/20 text-blue-400",
  },
  student: {
    label: "Student",
    emoji: "🎓",
    className: "bg-teal-500/[0.08] border-teal-500/20 text-teal-400",
  },
};

// Dot mesh background style — reuse everywhere
export const meshStyle = (size = "14px") => ({
  backgroundImage:
    "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
  backgroundSize: `${size} ${size}`,
});
