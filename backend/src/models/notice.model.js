const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category:{
      type:String,
      enum:['urgent', 'event', "important","meeting", "announcement"],
      default:"announcement",
      required:true,
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
  },
  {
    timestamps: true,
  },
);

const noticeModel = mongoose.model("Notice", noticeSchema);

module.exports = noticeModel;
