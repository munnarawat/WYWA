import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { User, Mail, Save, Loader, Type } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { setUser } from "../../store/slice/authSlice";
import { useForm } from "react-hook-form";
const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  useEffect(() => {
    if (user) {
      reset({
        userName: user.userName || "",
        email: user.email || "",
        firstName: user.fullName?.firstName || "",
        lastName: user.fullName?.lastName || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
        const formattedData = {
        userName: data.userName,
        email: data.email,
        fullName: {
          firstName: data.firstName,
          lastName: data.lastName,
        }
      };
      const res = await api.put("/auth/profile/update", formattedData);

      if (res.data.success) {
        toast.success("profile update successfully 🎉");
        dispatch(setUser(res.data.user));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed");
    }
  };
  return (
    <div className="min-h-screen bg-[#0a0a0c] pt-28 px-4 pb-12 flex justify-center items-start">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
          <div className="w-16 h-16 rounded-full bg-linear-to-tr from-teal-500 to-lime-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
            {user?.userName?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">My Profile</h2>
            <p className="text-gray-400 text-sm">
              Update your personal details
            </p>
          </div>
        </div>
        {/* form data */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* First Name & Last Name (Grid layout for better UI) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">
                First Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Type size={18} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  placeholder="First Name"
                />
              </div>
              {errors.fullName?.firstName && (
                <p className="text-red-400 text-xs ml-1 mt-1">
                  {errors.fullName.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">
                Last Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Type size={18} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  {...register("lastName")}
                  className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  placeholder="Last Name"
                />
              </div>
              {errors.fullName?.lastName && (
                <p className="text-red-400 text-xs ml-1 mt-1">
                  {errors.fullName.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Username Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-500" />
              </div>
              <input
                type="text"
                {...register("userName", { required: "Username is required" })}
                className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                placeholder="Enter your username"
              />
            </div>
            {errors.userName && (
              <p className="text-red-400 text-xs ml-1 mt-1">
                {errors.userName.message}
              </p>
            )}
          </div>

          {/* Email Field */}
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
                placeholder="Enter your email"
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
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-4">
            {isSubmitting ? (
              <Loader size={20} className="animate-spin" />
            ) : (
              <>
                <Save size={20} />
                Save Changes
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Profile;
