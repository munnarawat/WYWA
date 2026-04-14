import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import UserProfile360 from "../UserProfile360/UserProfile360";

const UserProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchUserprofileData = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/auth/student/${id}/profile360`);
        if (res.data.success) {
          setProfileData(res.data.data);
        } else {
          setError("Failed to load profile data");
        }
      } catch (error) {
        console.error(error);
        toast.error("failed to fetch profileData");
        setError(err.response?.data?.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchUserprofileData(id);
    }
  }, [id]);
  
  return (
    <div className="min-h-screen bg-[#0d1117] text-white p-4 md:p-8">
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back to Dashboard
      </button>

      {/* ⚠️ Error Message Handle */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl max-w-5xl mx-auto mb-6 text-center">
          {error}
        </div>
      )}

      {/* 🌟 3️⃣ Call The Component! */}
      <UserProfile360 profileData={profileData} isLoading={isLoading} />
    </div>
  );
};

export default UserProfilePage;
