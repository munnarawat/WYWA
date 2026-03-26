const express = require("express");
const {getMyNotifications, deleteNotification, clearAllNotifications} = require("../controllers/notification.controller");

const {authMiddleware} = require("../middleware/auth.middleware");


const router  = express.Router();

router.get("/me", authMiddleware, getMyNotifications);

router.patch("/:id", authMiddleware, deleteNotification);

router.patch("/clear-all/me", authMiddleware, clearAllNotifications);

module.exports = router;