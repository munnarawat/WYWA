const express = require("express");
const {forgotPassword, resetPassword} = require("../controllers/password.controller")

const router = express.Router();

router.post("/forget", forgotPassword);

router.put("/reset/:token", resetPassword);

module.exports = router;