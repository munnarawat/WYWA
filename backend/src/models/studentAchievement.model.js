const mongoose = require("mongoose");

const studentAchievementSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  branch: {
    type: String,
    enum: ["dehradun", "haldwani"],
    required: true,
  },
  title:{
    type:String,
    required:true,
  },
  description:{
    type:String,
    required:true
  },
  badgeType: {
      type: String,
      enum: ["attendance", "reading", "special"],
      default: "attendance",
    }
},{
    timestamps:true,
});

const studentAchievementModel = mongoose.model("StudentAchievement", studentAchievementSchema);
module.exports =studentAchievementModel; 
