const express = require("express");
const {createTicket, getMyTicket, getAllTicket, updateTicketStatus} = require("../controllers/ticket.controller");
const {authMiddleware, adminMiddleware} = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/", authMiddleware, getMyTicket);

// admin routes
router.get("/all", authMiddleware, adminMiddleware,getAllTicket );
router.patch("/:id/status", authMiddleware, adminMiddleware, updateTicketStatus)


router.post("/create", authMiddleware , createTicket);

module.exports = router;