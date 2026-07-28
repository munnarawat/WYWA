import React, { useEffect, useState } from "react";
import MainRouter from "./routes/MainRouter";
import { useDispatch, useSelector } from "react-redux";
import api from "./utils/api";
import {
  clearUser,
  setUser,
  updateLibraryAccess,
  updateMywaAccess,
  updateMywaRequestStatus,
} from "./store/slice/authSlice";
import { Loader } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { io } from "socket.io-client";
import MywaLoader from "./components/loader/MywaLoader";
const socket = io("http://localhost:3000", {
  withCredentials: true,
});

const App = () => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

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
  // socket io
  useEffect(() => {
    if (currentUser?._id) {
      // console.log("Socket ID:", socket.id);

      socket.emit("join_user_room", currentUser._id.toString());
      // console.log("Room join request sent for ID:", currentUser._id);

      // mywaFamilyMember role update
      socket.on("role_updated", (data) => {
        if (data.isMywaFamilyMember) {
          toast.success(data.message || "Welcome to MYWA family❤️");
        } else {
          toast.error(
            data.message || "You are no longer a member of MYWA family",
          );
        }
        dispatch(updateMywaAccess(data.isMywaFamilyMember));

        if (data.hasRequestedMywaFamily !== undefined) {
          dispatch(updateMywaRequestStatus(data.hasRequestedMywaFamily));
        }
      });

      // libraryMember role update
      socket.on("library_role_updated", (data) => {
        if (data.isLibraryMember) {
          toast.success(data.message || "Welcome to Library family❤️");
        } else {
          toast.error(
            data.message || "You are no longer a member of Library family",
          );
        }
        dispatch(updateLibraryAccess(data.isLibraryMember));
      });
    }
    return () => {
      socket.off("role_updated");
      socket.off("library_role_updated");
    };
  }, [currentUser, dispatch]);

  if (showLoader) {
    return <MywaLoader onComplete={() => setShowLoader(false)} />;
  }
  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin" />
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
            backdropFilter: "blur(10px)",
            borderRadius: "10px",
            borderRightWidth: "3px",
            borderLeftWidth: "3px",
            borderColor: "oklch(77.7% 0.152 181.912)",
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
