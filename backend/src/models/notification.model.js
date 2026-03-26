const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    enum: ["success", "warning", "info", "motivation"],
    default: "info",
  },
  isRed:{
    type:Boolean,
    default:false
  }
},{
    timestamps:true,
});

const notificationModel = mongoose.model("Notification",notificationSchema );


module.exports = notificationModel;
