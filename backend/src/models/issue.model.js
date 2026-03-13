const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    issuedAr: {
      type: Date,
      default: Date.now,
    },
    returnedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["issued", "returned"],
      default: "issued",
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

const Issue = mongoose.model("Issue", issueSchema);

module.exports = Issue;
