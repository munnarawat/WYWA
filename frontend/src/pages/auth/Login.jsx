import React from "react";

const Login = () => {
  return (
    <div className=" relative w-full min-h-screen overflow-hidden">
      {/* Background Gradients (The Dark Premium Vibe) */}
      <div className="absolute inset-0 bg-slate-950">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-emerald-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob"></div>
        <div className="absolute top-40 -right-40 w-96 h-96 bg-teal-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob animation-delay-2000"></div>
      </div>
    </div>
  );
};

export default Login;
