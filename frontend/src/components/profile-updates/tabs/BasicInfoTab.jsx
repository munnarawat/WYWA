import React from "react";
import { motion } from "framer-motion";
import { User, Shield, Calendar, Droplet } from "lucide-react";
import InputField from "../InputField";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const BasicInfoTab = ({ register, errors }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
    <div className="flex items-center gap-3 mb-6">
      <span className="text-[10px] font-bold tracking-widest uppercase text-slate-600 whitespace-nowrap">Personal information</span>
      <div className="flex-1 h-px bg-white/5" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField label="First Name" icon={<User />} error={errors.fullName?.firstName} required>
        <input {...register("fullName.firstName", { required: "First name is required" })} placeholder="John" />
      </InputField>
      <InputField label="Last Name" icon={<User />} error={errors.fullName?.lastName} required>
        <input {...register("fullName.lastName", { required: "Last name is required" })} placeholder="Doe" />
      </InputField>
      <InputField label="Username" icon={<Shield />} error={errors.userName} required>
        <input {...register("userName", { required: "Username is required" })} placeholder="johndoe123" />
      </InputField>
      <InputField label="Date of Birth" icon={<Calendar />}>
        <input type="date" {...register("personal.dob")} />
      </InputField>
      <InputField label="Gender" icon={<User />}>
        <select {...register("personal.gender")}>
          <option value="" className="bg-[#0d1117] text-slate-100">Select Gender</option>
          <option value="Male" className="bg-[#0d1117] text-slate-100">Male</option>
          <option value="Female" className="bg-[#0d1117] text-slate-100">Female</option>
          <option value="Other" className="bg-[#0d1117] text-slate-100">Other</option>
        </select>
      </InputField>
      <InputField label="Blood Group" icon={<Droplet />}>
        <select {...register("personal.bloodGroup")}>
          <option value="" className="bg-[#0d1117] text-slate-100">Select Blood Group</option>
          {BLOOD_GROUPS.map((bg) => (
            <option key={bg} value={bg} className="bg-[#0d1117] text-slate-100">{bg}</option>
          ))}
        </select>
      </InputField>
    </div>
  </motion.div>
);

export default BasicInfoTab;