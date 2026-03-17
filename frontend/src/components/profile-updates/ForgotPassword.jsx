import React from "react";
import { motion } from "motion/react";
import { Mail, ArrowLeft, Loader, KeyRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../../utils/api";
import toast from "react-hot-toast";
const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/password/forget", data);
      if (res.data.success) {
        toast.success(res.data.message || "Reset link sent to your email! ✉️");
      }
    } catch (error) {
      console.error("reset password error", error);
      toast.error(error.response?.data?.message || "Failed to send reset link");
    }
  };
  return (
    <div className="min-h-screen bg-[#0a0a0c] pt-28 px-4 pb-12 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
        {/* Icon & Heading */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center border border-teal-500/30 shadow-lg shadow-teal-500/10">
            <KeyRound size={32} className="text-teal-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Forgot Password?</h2>
        <p className="text-gray-400 text-sm mb-8">
          No worries! Enter your registered email address and we'll send you a
          link to reset your password.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-500" />
              </div>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                placeholder="Enter your registered email"
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs ml-1 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
            {isSubmitting ? (
              <Loader size={20} className="animate-spin" />
            ) : (
              "Send Reset Link"
            )}
          </motion.button>
        </form>

        {/* Back to Login Link */}
        <div className="mt-8">
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-teal-400 transition-colors">
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
