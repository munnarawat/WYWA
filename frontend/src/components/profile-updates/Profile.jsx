import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { BookOpen, Phone, Save, User, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import api from "../../utils/api";
import { setUser } from "../../store/slice/authSlice";

// Sub-components Import
import ProfileHeader from "./ProfileHeader";
import BasicInfoTab from "./tabs/BasicInfoTab";
import AcademicInfoTab from "./tabs/AcademicInfoTab";
import ContactInfoTab from "./tabs/ContactInfoTab";

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
      dob: formattedDob,
      bloodGroup: "",
      imageUrl: "",
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
      personal: { gender: "", dob: "", bloodGroup: "", imageUrl: "" },
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

          // Sync Redux with the full profile so the header uses the latest image URL.
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

      // Do not send stale image fields from the form state.
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
        // Keep the UI and Redux store aligned with the saved backend response.
        dispatch(setUser(res.data.user));
        reset(mapUserToFormValues(res.data.user));
        setAvatarFile(null);
        setAvatarPreview(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
    }
  };

  const handleAvatarUpload = (e) =>{
    const file = e.target.files[0];
    if(file){
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

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
    <div className="w-full mx-auto p-4 sm:p-8 pb-24 flex flex-col gap-5">
      {/* Eyebrow */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] font-semibold tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />{" "}
          MYWA · Profile Settings
        </div>
      </div>

      <ProfileHeader
        authUser={authUser}
        firstName={firstName}
        handleAvatarUpload={handleAvatarUpload}
        avatarPreview={avatarPreview}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Tab Buttons */}
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

        {/* Tab Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-[20px] p-px"
          style={{
            background:
              "linear-gradient(135deg, rgba(20,184,166,0.2), rgba(255,255,255,0.04), rgba(132,204,22,0.1))",
          }}>
          <div className="bg-[#0d1117] rounded-[19px] p-6 sm:p-8 relative overflow-hidden min-h-90">
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
                <BasicInfoTab key="basic" register={register} errors={errors} />
              )}
              {activeTab === "academic" && (
                <AcademicInfoTab
                  key="academic"
                  register={register}
                  errors={errors}
                />
              )}
              {activeTab === "contact" && (
                <ContactInfoTab
                  key="contact"
                  register={register}
                  errors={errors}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Save Button */}
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
      </form>
    </div>
  );
};

export default Profile;
