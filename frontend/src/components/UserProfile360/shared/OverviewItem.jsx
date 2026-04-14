import { motion } from "framer-motion";
import { meshStyle } from "./helpers";

const OverviewItem = ({ emoji, label, value, fullWidth = false }) => (
  <motion.div
    whileHover={{ y: -3 }}
    className={`relative rounded-[14px] p-px ${fullWidth ? "col-span-full" : ""}`}
    style={{
      background:
        "linear-gradient(135deg, rgba(20,184,166,0.15), rgba(255,255,255,0.03))",
    }}>
    <div className="bg-[#0d1117] rounded-[13px] px-4 py-3.5 flex items-center gap-3 relative overflow-hidden">
      <div
        className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none rounded-br-[13px]"
        style={meshStyle("8px")}
      />
      <div className="w-9 h-9 rounded-[10px] bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[15px] shrink-0">
        {emoji}
      </div>
      <div>
        <p className="text-[10px] font-bold tracking-widest uppercase text-slate-600 mb-0.5">
          {label}
        </p>
        <p className="text-[13px] font-semibold text-slate-200">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  </motion.div>
);

export default OverviewItem;
