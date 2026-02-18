const express = require("express");
const {createNotice, getAllNotice , deleteNotice} = require("../controllers/notice.controller");
const {authMiddleware, adminMiddleware} = require("../middleware/auth.middleware")

const router = express.Router();

// public student 
router.get("/", getAllNotice);

// create notice admin only
router.post("/create", authMiddleware, adminMiddleware, createNotice);

// delete notice (admin only);
router.patch("/:id", authMiddleware, adminMiddleware, deleteNotice)

module.exports = router;