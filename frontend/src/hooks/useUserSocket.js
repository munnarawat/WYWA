import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { clearUser, updateUser } from "../store/slice/authSlice"; 

const useUserSocket = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) return;

    const socketUrl = new URL(import.meta.env.VITE_MYWA_API_URL).origin;
    const socket = io(socketUrl, { withCredentials: true });

    const onConnect = () => socket.emit("join_user_room");

    const onBlocked = (data) => {
      toast.error(data.message);
      dispatch(clearUser());
      navigate("/login");
    };

    const onUnblocked = (data) => toast.success(data.message);

    const onRoleUpdated = (data) => {
      switch (data.type) {
        case "ADMIN":
          dispatch(updateUser({ role: "admin" }));
          break;
        case "THINK_TANK":
          dispatch(updateUser({ role: "thinkTank" }));
          break;
        case "MYWA_MEMBER":
          dispatch(updateUser({ isMywaFamilyMember: data.isMywaFamilyMember }));
          break;
        default:
          return;
      }
      toast.success(data.message);
    };

    const onLibraryUpdated = (data) => {
      dispatch(updateUser({ isLibraryMember: data.isLibraryMember }));
      toast(data.message);
    };

    socket.on("connect", onConnect);
    socket.on("account_blocked", onBlocked);
    socket.on("account_unblocked", onUnblocked);
    socket.on("role_updated", onRoleUpdated);
    socket.on("library_role_updated", onLibraryUpdated);

    return () => {
      socket.off("connect", onConnect);
      socket.off("account_blocked", onBlocked);
      socket.off("account_unblocked", onUnblocked);
      socket.off("role_updated", onRoleUpdated);
      socket.off("library_role_updated", onLibraryUpdated);
      socket.disconnect();
    };
  }, [user?._id, dispatch, navigate]);
};

export default useUserSocket;