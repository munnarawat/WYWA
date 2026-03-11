import React, { useEffect, useState } from "react";
import MainRouter from "./routes/MainRouter";
import { useDispatch } from "react-redux";
import api from "./utils/api";
import { clearUser, setUser } from "./store/slice/authSlice";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const dispatch = useDispatch();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        dispatch(setUser(res.data.user));
      } catch (error) {
        dispatch(clearUser());
      } finally {
        setIsAuthChecking(false);
      }
    };
    checkAuth();
  }, [dispatch]);
  if (isAuthChecking) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center text-white">
        <Loader size={48} className="text-teal-400 animate-spin" />
      </div>
    );
  }
  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "rgba(9, 9, 11, 0.9)", // bg-zinc-950 with opacity
            color: "#fff",
            backdropFilter: "blur(10px)", // Glassmorphism
            border: "1px solid rgba(255,255,255,0.1)", // Subtle border
            borderRadius: "16px",
          },
          success: {
            iconTheme: {
              primary: "#2dd4bf", // Teal-400
              secondary: "#09090b",
            },
          },
          error: {
            iconTheme: {
              primary: "#f43f5e", // Rose-500
              secondary: "#09090b",
            },
          },
        }}
      />
      <MainRouter />
    </>
  );
};

export default App;
