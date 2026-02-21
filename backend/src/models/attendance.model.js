const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    date:{
        type:Date,
        require:true,
    },
    status:{
        type:String,
        enum:["present", "absent"],
        default:"present",
    },
    markedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User" , //admin
        required:true,
    },
},{
    timestamps:true,
});

// One record per student per day
attendanceSchema.index({student:1, date:1},{unique:true});

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;