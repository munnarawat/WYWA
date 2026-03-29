const User = require("../models/user.model");

// 1, get my profile
const getMyProfileController = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -refreshToken -resetPasswordToken -resetPasswordExpire",
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// update profile
const updateProfile = async (req, res) => {
  try {
    const { userName, fullName,branch, personal, academic, contact } = req.body;
    const firstName = fullName?.firstName;
    const lastName = fullName?.lastName;

    const user = await User.findById(req.user._id);
    if(!user){
        return res.status(404).json({
            success:false,
            message:"user not found"
        });
    }
    // 1. UPDATE ROOT FIELDS
    if(userName) user.userName = userName;
    if(firstName) user.fullName.firstName = firstName;
    if(lastName) user.fullName.lastName = lastName;
    if(branch) user.branch = branch;

    //  2. UPDATE NESTED PROFILE FIELDS (Deep Merge);
    if(!user.profile) user.profile ={};
    if(personal)user.profile.personal ={...user.profile.personal, ...personal};
    if(academic)user.profile.academic ={...user.profile.academic, ...academic};
    if(contact)user.profile.contact = {...user.profile.contact, ...contact};

    // 3. save the database
    await user.save();

    const updateUser = await User.findById(req.user._id).select(
      "-password -refreshToken -resetPasswordToken -resetPasswordExpire",
    );
    res.status(200).json({
      message:" profile Update successfully 🎉",
      success:true,
      user:updateUser,
    })
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
    getMyProfileController,
    updateProfile
}