const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const noticeRouters = require("./routes/notice.routes");
const achievementRouters = require("./routes/achievement.routes");
const thinkTankRouters = require("./routes/thinkTank.routes");
const libraryRouters = require("./routes/library.routes");
const attendanceRouters = require("./routes/attendance.routes");
const dashboardRouter = require("./routes/Dashboard.routes");
const resetPasswordRouter = require("./routes/passwordReset.route");
const ticketRouter = require("./routes/ticket.routes");
const notificationRouter = require("./routes/notification.routes");
const thinkTankDashboardRouter = require("./routes/thinkTankDashboard.routes");
const publicRouter = require("./routes/public.routes");
const cookieParser = require("cookie-parser");
const app = express();

// middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      "https://wywa.vercel.app",
    ],
    credentials: true,
    headers: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  }),
);
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notice", noticeRouters);
app.use("/api/achievements", achievementRouters);
app.use("/api/thinkTank", thinkTankRouters);
app.use("/api/library", libraryRouters);
app.use("/api/attendance", attendanceRouters);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/password", resetPasswordRouter);
app.use("/api/ticket", ticketRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/thinkTankDashboard", thinkTankDashboardRouter);
app.use("/api/public", publicRouter);

module.exports = app;
