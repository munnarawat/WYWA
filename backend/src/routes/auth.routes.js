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

const {
  getUserProfile360,
  requestLibraryAccess,
} = require("../controllers/user.controller");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

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
router.put(
  "/profile/update",
  authMiddleware,
  upload.single("image"),
  updateProfile,
);

// profile 360 view
router.get("/student/:id/profile360", authMiddleware, getUserProfile360);

// requestLibraryMember
router.post("/requestLibraryMember", authMiddleware, requestLibraryAccess);
// logout user
router.post("/logout", logoutController);

module.exports = router;
