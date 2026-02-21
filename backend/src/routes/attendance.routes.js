const express = require("express");
const {markAttendance} = require("../controllers/attendance.controller");
const {authMiddleware, adminMiddleware} = require("../middleware/auth.middleware");

const router = express.Router();


// mark student 
router.post("/mark", authMiddleware, adminMiddleware, markAttendance);




module.exports = router