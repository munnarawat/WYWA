import { Loader } from "lucide-react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children,allowedRoles }) => {
  const { isAuthenticate, isLoading,user } = useSelector((state) => state.auth);

  if(isLoading){
    return (
        <div className="h-screen flex items-center justify-center bg-[#121212] text-white">
            <Loader size={40} className=" animate-spin text-green-400" />
        </div>
    )
  }
  // authentication check 
  if(!isAuthenticate) return <Navigate to='/login' replace />

  // Role based authentication check 
  if(allowedRoles && !allowedRoles.includes(user?.role)){
    if(user?.role === 'admin'){
      return <Navigate to="/admin/dashboard" replace />
    }
    else if(user?.role === "student"){
      return <Navigate to="/student/dashboard" replace />
    }
    else{
      return <Navigate to='/' replace />
    }
  }

  return children;
};

export default ProtectedRoute;
