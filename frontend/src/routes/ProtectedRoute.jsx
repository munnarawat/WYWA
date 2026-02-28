import { Loader } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticate, isLoading } = useSelector((state) => state.auth);

  if(isLoading){
    return (
        <div className="h-screen flex items-center justify-center bg-[#121212] text-white">
            <Loader size={40} className=" animate-spin text-green-400" />
        </div>
    )
  }
  if(!isAuthenticate) return <Navigate to='/login' />

  return children;
};

export default ProtectedRoute;
