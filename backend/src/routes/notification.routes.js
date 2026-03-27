const express = require("express");
const {getMyNotifications, deleteNotification, clearAllNotifications} = require("../controllers/notification.controller");

const {authMiddleware} = require("../middleware/auth.middleware");


const router  = express.Router();

router.get("/me", authMiddleware, getMyNotifications);

router.delete("/:id", authMiddleware, deleteNotification);

router.delete("/clear-all/me", authMiddleware, clearAllNotifications);

module.exports = router;