import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Calendar } from "lucide-react";
import InputField from "../InputField";

const AcademicInfoTab = ({ register, errors }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
    <div className="flex items-center gap-3 mb-6">
      <span className="text-[10px] font-bold tracking-widest uppercase text-slate-600 whitespace-nowrap">Academic details</span>
      <div className="flex-1 h-px bg-white/[0.05]" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField label="Student ID / Roll No" icon={<BookOpen />}>
        <input {...register("academic.studentId")} placeholder="e.g. CS2024001" />
      </InputField>
      <InputField label="Branch" icon={<BookOpen />}>
        <input {...register("branch")} placeholder="e.g. CSE, IT, MECH" />
      </InputField>
      <InputField label="Course" icon={<BookOpen />}>
        <input {...register("academic.course")} placeholder="e.g. B.Tech" />
      </InputField>
      <InputField label="Batch (Year)" icon={<Calendar />}>
        <input {...register("academic.batch")} placeholder="e.g. 2024-2028" />
      </InputField>
      <InputField label="Current Semester" icon={<BookOpen />}>
        <input {...register("academic.semester")} placeholder="e.g. 4th" />
      </InputField>
    </div>
  </motion.div>
);

export default AcademicInfoTab;