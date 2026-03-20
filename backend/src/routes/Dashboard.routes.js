const express = require("express");
const {getDashboardOverview, getStudentDashboardStats} = require("../controllers/dashboard.controller");
const {authMiddleware, adminMiddleware} = require("../middleware/auth.middleware");

const router = express.Router();

// router dashboard overView 
router.get("/overview", authMiddleware , adminMiddleware, getDashboardOverview);

// student dashboard overview
router.get("/student/attendance", authMiddleware , getStudentDashboardStats);



module.exports = router;