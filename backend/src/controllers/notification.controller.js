const Notification = require("../models/notification.model");

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({recipient:req.user._id})
    .sort({createdAt:-1})
    .limit(20);

    return res.status(200).json({ success: true, notifications, unreadCount:notifications.length });
  } catch (error) {
    console.error("Fetch notifications error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteNotification = async (req,res)=>{
    try {
        await Notification.findByIdAndDelete(req.user._id, {isRed:true});
        return res.status(200).json({ success: true, message: "Marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const clearAllNotifications = async (req,res) => {
    try {
    await Notification.deleteMany({ recipient: req.user._id, isRead: false }, { isRead: true });
    return res.status(200).json({ success: true, message: "All marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}


module.exports ={
    getMyNotifications,
    deleteNotification,
    clearAllNotifications
}