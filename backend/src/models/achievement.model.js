const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    examName: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    branch: {
      type: String,
      enum: ["dehradun", "haldwani"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const achievementModel = mongoose.model("Achievement", achievementSchema);

module.exports = achievementModel;
