import React from "react";
import { motion } from "framer-motion";
import { Phone, MapPin } from "lucide-react";
import InputField from "../InputField";

const ContactInfoTab = ({ register, errors }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
    <div className="flex items-center gap-3 mb-6">
      <span className="text-[10px] font-bold tracking-widest uppercase text-slate-600 whitespace-nowrap">Contact details</span>
      <div className="flex-1 h-px bg-white/[0.05]" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <InputField label="Phone Number" icon={<Phone />}>
        <input type="tel" {...register("contact.phone")} placeholder="+91 XXXXX XXXXX" />
      </InputField>
    </div>
    <div className="grid grid-cols-1 gap-4">
      <InputField label="Current Address" icon={<MapPin />}>
        <textarea rows={3} {...register("contact.currentAddress")} placeholder="Hostel/PG address..." />
      </InputField>
      <InputField label="Permanent Address" icon={<MapPin />}>
        <textarea rows={3} {...register("contact.permanentAddress")} placeholder="Home address..." />
      </InputField>
    </div>
  </motion.div>
);

export default ContactInfoTab;