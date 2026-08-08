require("dotenv").config();
const app = require("./src/app");
const ConnectedToDB = require("./src/db/db");
const initSocketServer = require("./src/socket/socket.server");
const startCornJobs = require("./src/jobs/cron");

const httpServer = require("http").createServer(app);
// data base call
ConnectedToDB().then(() => {
  startCornJobs();
});

const io = initSocketServer(httpServer);
app.set("io", io);

const port = process.env.PORT || 3000;

httpServer.listen(port, "0.0.0.0", () =>
  console.log(`server running on port ${port}`),
);
