const express = require("express");
const {createTicket, getMyTicket} = require("../controllers/ticket.controller");
const {authMiddleware} = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/", authMiddleware, getMyTicket);

router.post("/create", authMiddleware , createTicket);

module.exports = router;