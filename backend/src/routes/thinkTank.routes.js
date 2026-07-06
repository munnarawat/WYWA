const express = require("express");
const {createThinkTank, getAllThinkTank , updateThinkTank, deleteThinkTank, getMainThinkTank} =require("../controllers/thinkTank.controller");
const {authMiddleware, adminMiddleware} = require("../middleware/auth.middleware");
const multer = require("multer");

const upload = multer({storage:multer.memoryStorage()})

const router = express.Router();

// get allThinkTank;
router.get("/",getAllThinkTank);

// main 4 thinkTank
router.get("/main", getMainThinkTank )

// create allThinkTank (admin only)
router.post("/create", authMiddleware, adminMiddleware, upload.single("image"), createThinkTank);

// update allThinkTank (admin only)
router.put("/:id", authMiddleware, adminMiddleware ,upload.single("image"), updateThinkTank);

// delete allThinkTank (admin only)
router.delete("/:id", authMiddleware, adminMiddleware , deleteThinkTank);
module.exports = router;