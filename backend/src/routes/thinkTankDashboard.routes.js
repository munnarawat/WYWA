const express = require("express");
const {
  getDashboardStats,
  getAllStudentsList,
  getAttendanceChartData,
  getLibraryOverview,
} = require("../controllers/thinkTankDashboard.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();

// get stats
router.get("/stats", authMiddleware, getDashboardStats);

router.get("/chart",authMiddleware, getAttendanceChartData );
router.get("/students", authMiddleware, getAllStudentsList);
router.get("/library", authMiddleware, getLibraryOverview);

module.exports = router;
