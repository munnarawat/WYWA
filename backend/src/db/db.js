const mongoose = require("mongoose");

const ConnectedToDB = async () => {
  try {
    mongoose.connect(process.env.MONGOOSE_URI);
    console.log("connected to DB✅");
  } catch (error) {
    console.log("failed to connected to DB❌");
    process.exit(1);
  }
};

module.exports = ConnectedToDB;
