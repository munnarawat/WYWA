import {
  AlertCircle,
  ArrowRight,
  Banknote,
  Lock,
  Mail,
  Mountain,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../images/logo.png";
import api from "../../utils/api";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/slice/authSlice";
const Register = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async (data) => {
    setServerError("");
    setIsLoading(true);
    const payload = {
      fullName: {
        firstName: data.firstName,
        lastName: data.lastName,
      },
      userName: data.userName,
      email: data.email,
      branch: data.branch,
      password: data.password,
    };
    try {
      const response = await api.post("/auth/register", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.user) {
        dispatch(setUser(response.data.user));
        navigate("/");
      }
    } catch (error) {
      setServerError(error.response?.data?.message || "Something went wrong");
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
              <img className="w-full h-full object-cover" src={logo} alt="" />
            </div>
          </div>
          <h2 className="text-3xl heading font-bold tracking-tight">
            Create Account
          </h2>
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
          {/* fullName */}
          <div className="fullName-box flex gap-4">
            {/* firstName fields */}
            <div className="firstName">
              <div
                className={`relative group ${errors.firstName ? "text-red-400" : "text-white"}`}>
                <User
                  className="absolute left-4 top-3.5 text-white/40 group-focus-within:text-teal-400"
                  size={18}
                />
                <input
                  {...register("firstName", {
                    required: "firstName are required",
                  })}
                  placeholder="firstName"
                  type="text"
                  className={`w-full placeholder:text-sm  placeholder:text-zinc-500  bg-black/20 border rounded-xl py-3 pl-12 pr-4 focus:outline-none transition-all
                    ${
                      errors.firstName
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-white/10 focus:border-teal-500/50"
                    }
                `}
                />
              </div>
              {/* Error Message */}
              {errors.firstName && (
                <p className="text-red-400 text-xs mt-1 ml-2 flex items-center gap-1">
                  <AlertCircle size={10} /> {errors.firstName.message}
                </p>
              )}
            </div>
            {/* lastName */}
            <div className="lastName">
              <div
                className={`relative group ${errors.lastName ? "text-red-400" : "text-white"}`}>
                <User
                  className="absolute left-4 top-3.5 text-white/40 group-focus-within:text-teal-400"
                  size={18}
                />
                <input
                  {...register("lastName", {
                    required: "lastName are required",
                  })}
                  type="text"
                  placeholder="lastName"
                  className={`w-full bg-black/20 placeholder:text-sm  placeholder:text-zinc-500  border rounded-xl py-3 pl-12 pr-4 focus:outline-none transition-all
                    ${
                      errors.lastName
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-white/10 focus:border-teal-500/50"
                    }
                `}
                />
              </div>
              {/* Error Message */}
              {errors.lastName && (
                <p className="text-red-400 text-xs mt-1 ml-2 flex items-center gap-1">
                  <AlertCircle size={10} /> {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
          {/* userName field */}
          <div>
            <div
              className={`relative group ${
                errors.userName ? "text-red-400" : "text-white"
              }`}>
              <User
                className="absolute left-4 top-3.5 text-white/40 group-focus-within:text-teal-400"
                size={20}
              />
              <input
                {...register("userName", { required: "User Name is required" })}
                placeholder="Enter UserName"
                className={`w-full placeholder:text-sm  placeholder:text-zinc-500 bg-black/20 border rounded-xl py-3 pl-12 pr-4 focus:outline-none transition-all
                    ${
                      errors.userName
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-white/10 focus:border-teal-500/50"
                    }
                `}
              />
            </div>
            {/* Error Message */}
            {errors.userName && (
              <p className="text-red-400 text-xs mt-1 ml-2 flex items-center gap-1">
                <AlertCircle size={10} /> {errors.userName.message}
              </p>
            )}
          </div>
          {/* email field */}
          <div>
            <div className="relative group">
              <Mail
                className="absolute left-4 top-3.5 text-white/40 group-focus-within:text-teal-400"
                size={20}
              />
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Invalid email address",
                  },
                })}
                placeholder=" enter Email Address"
                className={`w-full placeholder:text-sm  placeholder:text-zinc-500  bg-black/20 border rounded-xl py-3 pl-12 pr-4 focus:outline-none transition-all
                    ${
                      errors.email
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-white/10 focus:border-teal-500/50"
                    }
                `}
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs mt-1 ml-2 flex items-center gap-1">
                <AlertCircle size={10} /> {errors.email.message}
              </p>
            )}
          </div>
          {/* branch */}
          <div className="space-y-2">
            <select
              {...register("branch", { required: "Branch is required" })}
              className="w-full text-sm bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white/60 focus:outline-none focus:border-teal-500 transition-colors appearance-none">
              <option value="" className="bg-black/70   ">
                Select Branch
              </option>
              <option value="dehradun" className="bg-black">
                Dehradun
              </option>
              <option value="haldwani" className="bg-black">
                Haldwani
              </option>
            </select>
            {errors.branch && (
              <span className="text-red-400 text-xs flex items-center gap-1">
                <AlertCircle size={10} /> {errors.branch.message}
              </span>
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
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Must be at least 6 chars" },
                })}
                placeholder="enter a Password"
                className={`w-full placeholder:text-sm placeholder:text-zinc-500 bg-black/20 border rounded-xl py-3 pl-12 pr-4 focus:outline-none transition-all
                    ${
                      errors.password
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-white/10 focus:border-teal-500/50"
                    }
                `}
              />
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1 ml-2 flex items-center gap-1">
                <AlertCircle size={10} /> {errors.password.message}
              </p>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className={`w-full bg-linear-to-r from-teal-600 to-lime-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-teal-600/40 transition-all flex items-center justify-center gap-2 ${isLoading ? "opacity-70 cursor-not-allowed" : " "}`}>
            Sign Up <ArrowRight size={18} />
          </motion.button>
        </form>
        {/* if account have already exits  */}
        <p className="text-center text-white/40 text-sm mt-8">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-400 hover:text-teal-300">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
