const express = require("express");
const {
  getAllUser,
  toggleBlockUser,
  makeAdmin,
  makeThinkTank,
  getLibraryStudents,
  toggleLibraryAccess,
  toggleMywaFamilyMember,
} = require("../controllers/admin.controller");
const {
  adminMiddleware,
  authMiddleware,
} = require("../middleware/auth.middleware");

const router = express.Router();

// all router
router.get("/users", authMiddleware, adminMiddleware, getAllUser);
router.patch(
  "/user/:id/block",
  authMiddleware,
  adminMiddleware,
  toggleBlockUser,
);
router.patch(
  "/user/:id/make-admin",
  authMiddleware,
  adminMiddleware,
  makeAdmin,
);
router.patch(
  "/user/:id/make-thinkTank",
  authMiddleware,
  adminMiddleware,
  makeThinkTank,
);
router.get(
  "/user/getAccess",
  authMiddleware,
  adminMiddleware,
  getLibraryStudents,
);

// toggle Library access
router.patch(
  "/user/:id/toggle-library",
  authMiddleware,
  adminMiddleware,
  toggleLibraryAccess,
);

// toggle MYWA member access
router.patch(
  "/user/:id/toggle-member",
  authMiddleware,
  adminMiddleware,
  toggleMywaFamilyMember,
);
module.exports = router;
