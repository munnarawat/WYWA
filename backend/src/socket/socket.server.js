const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const UserModel = require("../models/user.model");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:4173",
        "https://wywa.vercel.app",
      ],
      credentials: true,
    },
  });

io.use(async (socket, next) => {
  try {
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    const token = cookies.accessToken || socket.handshake.auth?.token;
    if (!token) return next(new Error("unauthorized"));

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await UserModel.findById(decoded.id).select("_id isActive");
    if (!user || !user.isActive) return next(new Error("unauthorized"));

    socket.userId = String(user._id);
    next();
  } catch (err) {
    next(new Error(err.name === "TokenExpiredError" ? "token_expired" : "unauthorized"));
  }
});
  io.on("connection", (socket) => {
    socket.on("join_user_room", () => {
      socket.join(socket.userId);
    });

    // admin room
    socket.on("join_admin_room", async () => {
      try {
        const u = await UserModel.findById(socket.userId).select(
          "role isActive",
        );
        if (u && u.isActive && u.role === "admin") {
          socket.join("admin-room");
        }
      } catch (err) {
        console.error("join_admin_room error:", err);
      }
    });

    // branch room
    socket.on("join_branch", async () => {
      try {
        const u = await UserModel.findById(socket.userId).select(
          "branch isActive",
        );
        if (u && u.isActive && u.branch) {
          socket.join(String(u.branch));
        }
      } catch (err) {
        console.error("join_branch error:", err);
      }
    });

    socket.on("disconnect", () => {});
  });

  return io;
}

module.exports = initSocketServer;
