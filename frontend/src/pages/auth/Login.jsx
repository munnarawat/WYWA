import { AlertCircle, ArrowRight, Lock, User, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/slice/authSlice";
import toast from "react-hot-toast";
const Login = () => {
  const dispatch = useDispatch();
  const {user: currentUser} = useSelector((state)=>state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // when user are already login navigate to this dashboard
  useEffect(()=>{
    if(currentUser){
      if(currentUser.role === "admin"){
        navigate("/admin/dashboard")
      }else if(currentUser.role === "thinkTank"){
        navigate("/thinkTank/dashboard")
      }else{
        navigate("/student/dashboard");
      }
    }
  },[currentUser, navigate]);
  
  const onSubmit = async (data) => {
    setServerError("");
    setIsLoading(true);
    const payload = {
      identifier: data.identifier,
      password: data.password,
    };
    try {
      const response = await api.post("/auth/login", payload);
      if (response.data.user) {
        dispatch(setUser(response.data.user));

        const userRole = response.data.user.role;
        if (userRole === "admin") {
          navigate("/admin/dashboard");
        } else if (userRole === "student") {
          navigate("/student/dashboard");
        } else {
          navigate("/");
        }
        toast.success(response.data.message || "Login successfully 🎉");
      }
    } catch (error) {
      // console.log(error);
      const errorMessage =
        error.response?.data?.message ||
        "Network error. Please try again later.";
      setServerError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className=" relative w-full text-white px-4 flex items-center justify-center min-h-screen overflow-hidden pb-10">
      {/* Background Gradients */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-[-20%] left-[-10%] w-150 h-150 bg-teal-600/30 rounded-full blur-[120px]"
      />
      {/* glass card */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 w-full  max-w-md p-8 mt-20 md:mt-30 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_40px_-10px_rgba(129,140,248,0.3)]">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className=" w-40">
              <img
                className="w-full h-full object-cover"
                src="https://ik.imagekit.io/fmkamttxp/MYWA/logo.png"
                alt="logo"
                loading="lazy"
              />
            </div>
          </div>
          <h2 className="text-3xl  bg-clip-text text-transparent bg-linear-to-r from-teal-500 to-lime-500 heading font-bold tracking-tight">
            Welcome Back
          </h2>
          <p className="text-white/40 mt-2 text-sm">
            Start your bright future with MYWA
          </p>
        </div>
        {/* form data */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/*error handling print  */}
          {serverError && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle size={16} />
              <span>{serverError}</span>
            </div>
          )}
          {/* username and email Field */}
          <div>
            <div className="relative group">
              <User
                className="absolute left-4 top-3.5 text-white/40 group-focus-within:text-teal-400 transition-colors"
                size={20}
              />
              <input
                {...register("identifier", {
                  required: "userName or email is required",
                })}
                placeholder="Enter userName or Email address"
                className={`w-full placeholder:text-sm placeholder:text-zinc-500 bg-black/20 border rounded-xl py-3 pl-12 pr-4 focus:outline-none transition-all
                  ${
                    errors.identifier
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-white/10 focus:border-teal-500/50"
                  }
                `}
              />
            </div>
            {errors.identifier && (
              <p className="text-red-400 text-xs mt-1 ml-2 flex items-center gap-1">
                <AlertCircle size={10} /> {errors.identifier.message}
              </p>
            )}
          </div>
          {/* Password Field */}
          <div>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-3.5 text-white/40 group-focus-within:text-teal-400"
                size={20}
              />
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Must be at least 6 chars" },
                })}
                placeholder="Enter a Password"
                className={`w-full placeholder:text-sm placeholder:text-zinc-500 bg-black/20 border rounded-xl py-3 pl-12 pr-4 focus:outline-none transition-all
                    ${
                      errors.password
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-white/10 focus:border-teal-500/50"
                    }
                `}
              />
              {/* Show/Hide Password Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-zinc-500 hover:text-teal-400 transition-colors focus:outline-none">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1 ml-2 flex items-center gap-1">
                <AlertCircle size={10} /> {errors.password.message}
              </p>
            )}
          </div>

          <motion.button
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className={`w-full bg-linear-to-r from-teal-600 to-lime-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-teal-600/40 transition-all flex items-center justify-center gap-2 ${isLoading ? "opacity-70 cursor-not-allowed" : " "}`}>
            {isLoading ? "Logging in..." : "Log In"}
            {!isLoading && <ArrowRight size={18} />}
          </motion.button>
        </form>
        {/* if account have already exits  */}
        <p className="text-center text-white/40 text-sm mt-8">
          Don't have a account?{" "}
          <Link to="/register" className="text-teal-400 hover:text-teal-300">
            Sign Up
          </Link>
        </p>
        {/* forget password */}
        <div className="w flex items-center pt-4 justify-center">
          <Link to="/forgot-password" className="text-teal-500/80  underline hover:text-teal-500  ">
            Forgot Password
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
