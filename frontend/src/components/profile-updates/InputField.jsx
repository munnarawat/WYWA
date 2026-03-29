import React from "react";

const InputField = ({ label, icon, error, required, children }) => {
  const isTextarea = children.type === "textarea";

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-bold tracking-widest uppercase text-slate-600 flex items-center gap-1.5">
        {label}
        {required && <span className="text-rose-500">*</span>}
      </label>

      <div className="relative group">
        <div
          className={`absolute left-3.5 text-slate-600 group-focus-within:text-teal-400 transition-colors duration-300 pointer-events-none
            ${isTextarea ? "top-3.5" : "top-1/2 -translate-y-1/2"}`}>
          {React.cloneElement(icon, { size: 16 })}
        </div>

        {React.cloneElement(children, {
          className: `w-full bg-white/[0.03] border rounded-[13px] py-3 pl-10 pr-4
            text-[16px] text-slate-100 placeholder:text-slate-700
            outline-none transition-all duration-300 
            ${
              error
                ? "border-rose-500/40 focus:border-rose-500/70"
                : "border-white/[0.07] focus:border-teal-500/40 focus:bg-teal-500/[0.02]"
            }
            ${children.type === "select" ? "appearance-none cursor-pointer " : ""}
            ${children.type === "textarea" ? "resize-none" : ""}
            ${children.props.className || ""}`,
        })}
      </div>

      {error && <p className="text-[11px] text-rose-400 ml-0.5">{error.message}</p>}
    </div>
  );
};

export default InputField;