const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      required: true,
      default: "General",
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    available: {
      type: Number,
      required: true,
      min: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    branch: {
      type: String,
      enum: ["dehradun", "haldwani"],
      required: true,
    },
    coverImage: {
      type: String,
      default: "",
    },
    imageId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
