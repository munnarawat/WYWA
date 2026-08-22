const { Server } = require("socket.io");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:4173", "https://wywa.vercel.app"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // console.log("a user connected", socket.id);

    // admin joins the admin room
    socket.on("join_admin_room",(adminId)=>{
      socket.join("admin-room");
    })
    // when student send a id and get a room
    socket.on("join_user_room", (userId) => {
      socket.join(userId);
      // console.log(`User ${userId} joined their personal room`);
    });
    socket.on("join_branch", (branch) => {
      socket.join(branch);
      // console.log(`User joined branch room: ${branch}`);
    });

    socket.on("disconnect", () => {
      // console.log("User disconnected");
    });
  });
  return io;
}

module.exports = initSocketServer;
