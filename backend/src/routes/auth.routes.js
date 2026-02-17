const express = require("express");

const { userRegisterController, loginController, getCurrentUser } = require("../controllers/auth.controller");

const router = express.Router();


// user register route
router.post("/register", userRegisterController);

// user login 
router.post("/login", loginController)

// fetched user
router.get("/me",getCurrentUser )

module.exports = router;