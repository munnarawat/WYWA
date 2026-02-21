const express = require("express");
const {markAttendance, getMonthlyAttendance, getLeaderboard} = require("../controllers/attendance.controller");
const {authMiddleware, adminMiddleware, } = require("../middleware/auth.middleware");

const router = express.Router();


// mark student 
router.post("/mark", authMiddleware, adminMiddleware, markAttendance);

// Student/Admin: view monthly attendance
router.get("/monthly",authMiddleware, getMonthlyAttendance);

// public / student
router.get("/leaderboard", getLeaderboard)


module.exports = router