const express = require("express");
const {getDashboardOverview} = require("../controllers/dashboard.controller");
const {authMiddleware, adminMiddleware} = require("../middleware/auth.middleware");

const router = express.Router();

// router dashboard overView 
router.get("/overview", authMiddleware , adminMiddleware, getDashboardOverview);



module.exports = router;