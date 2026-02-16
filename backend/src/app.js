const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const cookieParser = require("cookie-parser");
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes)

module.exports = app;