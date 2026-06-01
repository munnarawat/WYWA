const express = require("express");

const { getPublicData } = require("../controllers/public.controller");
const router = express.Router();

router.get("/landing-stats", getPublicData);


module.exports = router;