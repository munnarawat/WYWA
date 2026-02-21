const express = require("express");
const {markAttendance, getMonthlyAttendance} = require("../controllers/attendance.controller");
const {authMiddleware, adminMiddleware} = require("../middleware/auth.middleware");

const router = express.Router();


// mark student 
router.post("/mark", authMiddleware, adminMiddleware, markAttendance);

// Student/Admin: view monthly attendance
router.get("/monthly",authMiddleware, getMonthlyAttendance);

// 


module.exports = router