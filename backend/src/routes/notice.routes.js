const express = require("express");
const {createNotice, getAllNotice , deleteNotice,updateNotice} = require("../controllers/notice.controller");
const {authMiddleware, adminMiddleware} = require("../middleware/auth.middleware")

const router = express.Router();

// public student 
router.get("/",authMiddleware,  getAllNotice);

// create notice admin only
router.post("/create", authMiddleware, adminMiddleware, createNotice);

// update notice (admin only)
router.put("/:id",authMiddleware, adminMiddleware, updateNotice);
// delete notice (admin only);
router.delete("/:id", authMiddleware, adminMiddleware, deleteNotice)

module.exports = router;