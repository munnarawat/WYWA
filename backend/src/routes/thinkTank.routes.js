const express = require("express");
const {createThinkTank, getAllThinkTank , updateThinkTank, deleteThinkTank} =require("../controllers/thinkTank.controller");
const {authMiddleware, adminMiddleware} = require("../middleware/auth.middleware");


const router = express.Router();

// get allThinkTank;
router.get("/",getAllThinkTank);

// create allThinkTank (admin only)
router.post("/create", authMiddleware, adminMiddleware, createThinkTank);

// update allThinkTank (admin only)
router.put("/:id", authMiddleware, adminMiddleware , updateThinkTank);

// delete allThinkTank (admin only)
router.delete("/:id", authMiddleware, adminMiddleware , deleteThinkTank);
module.exports = router;