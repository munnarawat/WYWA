import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { Save, Loader2, Pencil, X } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import api from "../../utils/api";
import { setUser } from "../../store/slice/authSlice";

import ProfileHeader from "./ProfileHeader";
import BasicInfoTab from "./tabs/BasicInfoTab";
import AcademicInfoTab from "./tabs/AcademicInfoTab";
import ContactInfoTab from "./tabs/ContactInfoTab";
import { Helmet } from "react-helmet-async";

const ProfileSkeleton = () => (
  <div className="animate-pulse space-y-5 max-w-[860px] mx-auto p-4 sm:p-8">
    <div className="h-[140px] rounded-[20px] bg-white/4" />
    <div className="h-14 w-72 rounded-2xl bg-white/4" />
    <div className="h-[380px] rounded-[20px] bg-white/4" />
  </div>
);

const mapUserToFormValues = (userData = {}) => {
  const formattedDob = userData.profile?.personal?.dob
    ? new Date(userData.profile.personal.dob).toISOString().split("T")[0]
    : "";

  return {
    userName: userData.userName || "",
    fullName: userData.fullName || { firstName: "", lastName: "" },
    branch: userData.branch || "",
    personal: {
      gender: "",
      bloodGroup: "",
      imageUrl: "",
      fatherName: "",
      motherName: "",
      ...(userData.profile?.personal || {}),
      dob: formattedDob,
    },
    academic: {
      studentId: "",
      course: "",
      batch: "",
      semester: "",
      ...(userData.profile?.academic || {}),
    },
    contact: {
      phone: "",
      currentAddress: "",
      permanentAddress: "",
      ...(userData.profile?.contact || {}),
    },
  };
};

const Profile = () => {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("basic");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    defaultValues: {
      userName: "",
      fullName: { firstName: "", lastName: "" },
      branch: "",
      personal: {
        gender: "",
        dob: "",
        bloodGroup: "",
        imageUrl: "",
        fatherName: "",
        motherName: "",
      },
      academic: { studentId: "", course: "", batch: "", semester: "" },
      contact: { phone: "", currentAddress: "", permanentAddress: "" },
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/profile");
        if (res.data.success) {
          const userData = res.data.user;
          dispatch(setUser(userData));
          reset(mapUserToFormValues(userData));
        }
      } catch (error) {
        toast.error("Failed to fetch profile");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [dispatch, reset]);

  const onSubmit = async (data) => {
    const toastId = toast.loading("Updating profile...");
    try {
      const personalPayload = { ...data.personal };
      delete personalPayload.imageUrl;
      delete personalPayload.imageId;

      const formData = new FormData();
      formData.append("userName", data.userName);
      formData.append("branch", data.branch);
      formData.append("fullName", JSON.stringify(data.fullName));
      formData.append("personal", JSON.stringify(personalPayload));
      formData.append("academic", JSON.stringify(data.academic));
      formData.append("contact", JSON.stringify(data.contact));

      if (avatarFile) {
        formData.append("image", avatarFile);
      }
      const res = await api.put("/auth/profile/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        toast.success("Profile updated! 🎉", { id: toastId });
        dispatch(setUser(res.data.user));
        reset(mapUserToFormValues(res.data.user));
        if (avatarPreview) URL.revokeObjectURL(avatarPreview);
        setAvatarFile(null);
        setAvatarPreview(null);
        setIsEditMode(false); 
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    reset(mapUserToFormValues(authUser));
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(null);
    setAvatarPreview(null);
    setIsEditMode(false);
  };

  const tabs = [
    { id: "basic", label: "Basic Info", emoji: "👤" },
    ...(authUser?.role === "student"
      ? [{ id: "academic", label: "Academic Info", emoji: "📚" }]
      : []),
    { id: "contact", label: "Contact Info", emoji: "📞" },
  ];

  if (isLoading) return <ProfileSkeleton />;

  const firstName =
    authUser?.fullName?.firstName || authUser?.userName || "User";

  const hasChange = isDirty || avatarFile !== null;

  return (
    <div className="w-full relative mx-auto p-4 sm:p-8 pb-24 flex flex-col gap-5">
      <Helmet>
        <title>{firstName ? `${firstName} Profile | MYWA` : "Profile"}</title>
      </Helmet>

      <div className="sticky top-0 gap-2  flex items-center justify-between bg-background/80 backdrop-blur-sm  border-white/10 z-10  sm:px-8 py-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] font-semibold tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />{" "}
          MYWA · Profile Settings
        </div>

        {!isEditMode ? (
          <motion.button
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsEditMode(true)}
            className="flex  items-center gap-2 px-2 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[13px] font-semibold text-teal-400 bg-teal-500/10 border border-teal-500/20 hover:bg-teal-500/15 transition-colors">
            <Pencil size={14} /> Edit Profile
          </motion.button>
        ) : (
          <motion.button
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleCancel}
            className="flex items-center gap-2 px-2 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[13px] font-semibold text-slate-400 bg-white/5 border border-white/10 hover:bg-white/8 transition-colors">
            <X size={14} /> Cancel
          </motion.button>
        )}
      </div>

      <ProfileHeader
        authUser={authUser}
        firstName={firstName}
        handleAvatarUpload={isEditMode ? handleAvatarUpload : undefined}
        avatarPreview={avatarPreview}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-1.5 p-1.5 rounded-2xl w-full sm:w-fit overflow-x-auto border border-white/[0.07] bg-white/3">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold whitespace-nowrap transition-all duration-300 ${isActive ? "text-teal-400" : "text-slate-500 hover:text-slate-200"}`}>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-xl -z-10 bg-teal-500/10 border border-teal-500/20"
                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  />
                )}
                <span>{tab.emoji}</span> {tab.label}
              </button>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-[20px] p-px"
          style={{
            background:
              "linear-gradient(135deg, rgba(20,184,166,0.2), rgba(255,255,255,0.04), rgba(132,204,22,0.1))",
          }}>
          <div className="bg-[#0d1117] rounded-[19px] p-6 sm:p-8 relative overflow-hidden min-h-[360px]">
            <div
              className="absolute bottom-0 right-0 w-36 h-36 pointer-events-none rounded-br-[19px]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
                backgroundSize: "14px 14px",
              }}
            />
            <AnimatePresence mode="wait">
              {activeTab === "basic" && (
                <BasicInfoTab
                  key="basic"
                  register={register}
                  errors={errors}
                  isEditMode={isEditMode}
                />
              )}
              {activeTab === "academic" && (
                <AcademicInfoTab
                  key="academic"
                  register={register}
                  errors={errors}
                  isEditMode={isEditMode}
                />
              )}
              {activeTab === "contact" && (
                <ContactInfoTab
                  key="contact"
                  register={register}
                  errors={errors}
                  isEditMode={isEditMode}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {isEditMode && (
          <div className="flex justify-end pt-1">
            <motion.button
              type="submit"
              disabled={!hasChange || isSubmitting}
              whileHover={hasChange && !isSubmitting ? { y: -3 } : {}}
              whileTap={hasChange && !isSubmitting ? { scale: 0.97 } : {}}
              className={`flex items-center gap-2 px-7 py-3.5 rounded-[14px] font-bold text-[14px] transition-all duration-300 ${hasChange && !isSubmitting ? "text-[#080c10] shadow-[0_0_24px_rgba(20,184,166,0.3)] hover:shadow-[0_0_36px_rgba(20,184,166,0.45)] cursor-pointer" : "bg-white/4 border border-white/8 text-slate-600 cursor-not-allowed"}`}
              style={
                hasChange && !isSubmitting
                  ? { background: "linear-gradient(135deg, #14b8a6, #84cc16)" }
                  : undefined
              }>
              {isSubmitting ? (
                <>
                  <Loader2 size={17} className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save size={17} /> Save Changes
                </>
              )}
            </motion.button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;
