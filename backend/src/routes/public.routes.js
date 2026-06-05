const express = require("express");

const { getPublicData, getAllAchievements } = require("../controllers/public.controller");
const router = express.Router();

router.get("/landing-stats", getPublicData);

// get all achievement (public)
router.get("/all-achievement", getAllAchievements)

module.exports = router;