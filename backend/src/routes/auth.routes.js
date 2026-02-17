const express = require("express");

const { userRegisterController, loginController, getCurrentUser, logoutController } = require("../controllers/auth.controller");
const {authMiddleware} = require("../middleware/auth.middleware")
const router = express.Router();


// user register route
router.post("/register", userRegisterController);

// user login 
router.post("/login", loginController)

// fetched user
router.get("/me",authMiddleware , getCurrentUser )

// logout user
router.post("/logout", logoutController)


module.exports = router;