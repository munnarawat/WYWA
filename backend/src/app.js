const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const noticeRouters = require("./routes/notice.routes");
const achievementRouters = require("./routes/achievement.routes");
const thinkTankRouters = require("./routes/thinkTank.routes");
const libraryRouters = require("./routes/library.routes");
const attendanceRouters = require("./routes/attendance.routes");
const cookieParser = require("cookie-parser");
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/notice", noticeRouters);
app.use("/api/achievements", achievementRouters);
app.use("/api/thinkTank", thinkTankRouters);
app.use("/api/library", libraryRouters);
app.use("/api/attendance", attendanceRouters)

module.exports = app;