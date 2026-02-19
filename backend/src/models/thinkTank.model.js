const mongoose = require("mongoose");

const thinkTankSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    roleOrContribution: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    contact: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const thinkTankModel = mongoose.model("ThinkTank", thinkTankSchema);
module.exports = thinkTankModel;
