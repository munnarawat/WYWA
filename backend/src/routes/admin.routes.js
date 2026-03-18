const express = require("express");
const {getAllUser, toggleBlockUser, makeAdmin, makeThinkTank} = require("../controllers/admin.controller");
const {adminMiddleware , authMiddleware} = require("../middleware/auth.middleware")

const router = express.Router();

// all router 
router.get("/users", authMiddleware, adminMiddleware, getAllUser);
router.patch("/user/:id/block", authMiddleware, adminMiddleware, toggleBlockUser);
router.patch("/user/:id/make-admin", authMiddleware, adminMiddleware, makeAdmin);
router.patch("/user/:id/make-thinkTank", authMiddleware, adminMiddleware, makeThinkTank);

module.exports = router;