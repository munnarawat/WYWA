const express = require("express");

const {
  userRegisterController,
  loginController,
  getCurrentUser,
  logoutController,
  refreshController,
} = require("../controllers/auth.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
const {
  getMyProfileController,
  updateProfile,
} = require("../controllers/profile.controller");
const multer = require("multer");

const upload = multer({storage:multer.memoryStorage()})

const router = express.Router();

// user register route
router.post("/register", userRegisterController);

// user login
router.post("/login", loginController);

// fetched user
router.get("/me", authMiddleware, getCurrentUser);

// refresh access token
router.post("/refresh", refreshController);

// get my profile
router.get("/profile", authMiddleware, getMyProfileController);

// update profile
router.put("/profile/update", authMiddleware, upload.single("image"), updateProfile);

// logout user
router.post("/logout", logoutController);

module.exports = router;
