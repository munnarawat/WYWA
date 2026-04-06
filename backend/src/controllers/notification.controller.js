const Notification = require("../models/notification.model");

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = notifications.filter((n) => n.isRead === false).length;

    return res.status(200).json({ success: true, notifications, unreadCount });
  } catch (error) {
    console.error("Fetch notifications error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const deletedNotification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: req.user._id,
    });
    if (!deletedNotification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }
    return res
      .status(200)
      .json({ success: true, message: "Notification delete" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ recipient: req.user._id });
    return res
      .status(200)
      .json({ success: true, message:"All notifications cleared" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getMyNotifications,
  deleteNotification,
  clearAllNotifications,
};
