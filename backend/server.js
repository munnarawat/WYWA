require("dotenv").config();
const app = require("./src/app");
const ConnectedToDB = require("./src/db/db");

// data base call
ConnectedToDB()

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`server running on port ${port}`));
