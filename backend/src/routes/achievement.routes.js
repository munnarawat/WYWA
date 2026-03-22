const express = require("express");
const {createAchievement, getAllAchievement, deleteAchievement, updateAchievement} = require("../controllers/achievement.controller");
const {authMiddleware, adminMiddleware} = require("../middleware/auth.middleware");
const {getMyAchievements} = require("../controllers/studentAchievement.controller")
const router = express.Router();

// get api (public / student )
router.get("/all", getAllAchievement);

// student achievement
router.get("/student",authMiddleware , getMyAchievements);
// create achievement (admin only);
router.post("/create", authMiddleware, adminMiddleware, createAchievement);

// update achievement (admin only);
router.put("/:id", authMiddleware, adminMiddleware, updateAchievement);

// delete achievement (admin only);
router.delete("/:id", authMiddleware, adminMiddleware, deleteAchievement);

module.exports = router;