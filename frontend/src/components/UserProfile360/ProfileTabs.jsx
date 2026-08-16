import { motion } from "framer-motion";

const ProfileTabs = ({ tabs, activeTab, onTabChange }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.15 }}
    className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl w-fit overflow-x-auto"
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
    }}>
    {tabs.map((tab) => {
      const isActive = activeTab === tab.id;
      return (
        <motion.button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all whitespace-nowrap"
          style={
            isActive
              ? {
                  background: "linear-gradient(135deg, #14b8a6, #84cc16)",
                  color: "#080c10",
                }
              : { color: "#64748b" }
          }>
          <span>{tab.emoji}</span>
          {tab.label}
        </motion.button>
      );
    })}
  </motion.div>
);

export default ProfileTabs;
