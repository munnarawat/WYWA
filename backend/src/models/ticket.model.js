const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
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
    status:{
        type:String,
        enum:["pending", "in-progress", "resolved", "closed"],
        default:"pending",
    },

},{timestamps:true});

const ticketModel = mongoose.model("Ticket", ticketSchema);

module.exports = ticketModel;