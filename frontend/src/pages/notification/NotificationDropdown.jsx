import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle2 } from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../../utils/api";



const NotificationDropdown = ({socket}) => {
  const { user } = useSelector((state) => state.auth);
  // notification state
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchNotification = async () => {
      if (!user?._id) return;
      try {
        const res = await api.get("/notification/me");
        if (res.data.success) {
          setNotifications(res.data.notifications);
          setUnreadCount(res.data.unreadCount);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    fetchNotification();
  }, [user]);

  // handle read (delete single);
  const handleReadNotification = async (id) => {
    // optimistic ui update
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await api.delete(`/notification/${id}`);
    } catch (error) {
      console.error("Failed to delete notification", error);
    }
  };

  // 3. Click Outside to Close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  //   HANDLE CLEAR ALL
  const handleClearAll = async () => {
    setNotifications([]);
    setUnreadCount(0);
    try {
      await api.delete("/notification/clear-all/me");
    } catch (error) {
      console.error("Failed to clear notifications", error);
    }
  };
  // socket io
  useEffect(() => {
    if (!user?._id) return;

    const setupRooms = () => {
      // console.log("✅ Socket Connected! Joining rooms...");
      socket.emit("join_user_room", user._id);

      if (user.branch) {
        const cleanBranch = user.branch.trim().toLowerCase();
        // console.log(`✅ Joining Branch: '${cleanBranch}'`);
        socket.emit("join_branch", cleanBranch);
      }
    };
    if (socket.connected) {
      setupRooms();
    }
    socket.on("connect", setupRooms);

    const handleNotification = (data) => {
      //   console.log("🚀 BINGO! Notification Received:", data);

      toast.success(data.message, {
        icon: "🔥",
        duration: 6000,
        style: {
          borderRadius: "10px",
          background: "#18181b",
          color: "#fff",
          border: "1px solid #14b8a6",
        },
      });

      const newNotify = {
        id: data._id || Date.now().toString(),
        title: data.title || "Notification",
        message: data.message,
        createdAt: new Date().toISOString(),
        type: data.type || "info",
      };

      setNotifications((prev) => [newNotify, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("receive_notification", handleNotification);

    return () => {
      socket.off("connect", setupRooms);
      socket.off("receive_notification", handleNotification);
    };
  }, [user]);
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-zinc-400 hover:text-white p-2 transition-colors">
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white border-2 border-zinc-950 animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed mono top-20 left-4 right-4 sm:absolute sm:top-14 sm:left-auto sm:right-0 sm:w-88 bg-zinc-900/95 border border-white/10 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] backdrop-blur-3xl overflow-hidden ring-1 ring-white/5 z-50 origin-top sm:origin-top-right">
            <div className="px-5 py-4 border-b border-white/10 bg-zinc-950/50 flex justify-between items-center backdrop-blur-xl">
              <h3 className="text-sm font-bold text-white flex items-center gap-2.5">
                <div className="p-1.5 bg-teal-500/20 rounded-lg">
                  <Bell size={14} className="text-teal-400" />
                </div>
                Notifications
                {notifications.length > 0 && (
                  <span className="bg-white/10 text-zinc-300 text-[10px] px-2 py-0.5 rounded-full font-mono">
                    {notifications.length}
                  </span>
                )}
              </h3>
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-xs font-medium text-zinc-500 hover:text-rose-400 transition-colors">
                  Clear All
                </button>
              )}
            </div>

            <div className="max-h-[60vh] sm:max-h-88 overflow-y-auto custom-scrollbar p-2">
              {notifications.length === 0 ? (
                <div className="py-12 px-6 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/5 shadow-inner">
                    <CheckCircle2 size={24} className="text-zinc-600" />
                  </div>
                  <p className="text-sm font-medium text-zinc-300">
                    You're all caught up!
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    No new announcements right now.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notify) => (
                    <div
                      key={notify._id}
                      onClick={() => handleReadNotification(notify._id)}
                      className="group relative p-4 bg-transparent hover:bg-white/4 rounded-xl transition-all duration-200 cursor-pointer flex gap-3.5">
                      <div className="shrink-0 mt-0.5">
                        <div className="w-8 h-8 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-teal-500/20 transition-all duration-300">
                          {notify.title.includes("Announcement") ||
                          notify.title.includes("Notice") ? (
                            <span className="text-sm">📢</span>
                          ) : notify.title.includes("Streak") ? (
                            <span className="text-sm">🔥</span>
                          ) : notify.title.includes("Badge") ||
                            notify.title.includes("Welcome") ? (
                            <span className="text-sm">🏆</span>
                          ) : (
                            <Bell size={14} className="text-teal-400" />
                          )}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <h4 className="text-sm font-bold text-zinc-100 truncate pr-2 group-hover:text-teal-400 transition-colors">
                            {notify.title}
                          </h4>
                          <p className="shrink-0 text-[10px] font-medium text-zinc-500 mt-0.5 whitespace-nowrap">
                            {new Date(notify.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                          {notify.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
