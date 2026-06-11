const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    fullName: {
      firstName: {
        type: String,
        required: true,
        trim: true,
      },
      lastName: {
        type: String,
        required: true,
        trim: true,
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "student", "thinkTank"],
      default: "student",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    refreshToken: {
      type: String,
    },
    branch: {
      type: String,
      enum: ["dehradun", "haldwani"],
      required: true,
    },
    isLibraryMember: {
      type: Boolean,
      default: false, // Default false
    },
    isMywaFamilyMember:{
      type:Boolean,
      default:false,
    },
    mywaApplicationStatus:{
      type:String,
      enum:["none","pending", "approved", "rejected"],
      default:"none",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // profile details section
    profile: {
      personal: {
        dob: { type: Date },
        gender: { type: String, enum: ["Male", "Female", "Other"] },
        bloodGroup: {
          type: String,
          enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        },
        imageUrl: {
          type: String,
          default: "", // Default dummy image
        },
        imageId: {
          type: String,
          default: "",
        },
      },
      academic: {
        studentId: { type: String },
        course: { type: String },
        batch: { type: String },
        semester: { type: String },
      },
      contact: {
        phone: { type: String },
        currentAddress: { type: String },
        permanentAddress: { type: String },
      },
    },
  },
  {
    timestamps: true,
  },
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
