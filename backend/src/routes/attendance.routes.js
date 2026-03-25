const express = require("express");
const {markAttendance, getMonthlyAttendance, getLeaderboard, getMyStreaks} = require("../controllers/attendance.controller");
const {authMiddleware, adminMiddleware, } = require("../middleware/auth.middleware");

const router = express.Router();


// mark student 
router.post("/mark", authMiddleware, adminMiddleware, markAttendance);

// Student/Admin: view monthly attendance
router.get("/monthly",authMiddleware, getMonthlyAttendance);

// public / student
router.get("/leaderboard", authMiddleware, getLeaderboard)

// get my streak
router.get("/streak/me", authMiddleware, getMyStreaks)


module.exports = router