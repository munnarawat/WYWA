const User = require("../models/user.model");
const { uploadFile, deleteFile } = require("../service/storage.service");

// 1, get my profile
const getMyProfileController = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -refreshToken -resetPasswordToken -resetPasswordExpire",
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 2, update profile
const updateProfile = async (req, res) => {
  try {
    const { userName, fullName, branch, personal, academic, contact } =
      req.body;

    // Parse JSON strings if data comes from FormData
    const parsedFullName =
      typeof fullName === "string" ? JSON.parse(fullName) : fullName;
    const parsedPersonal =
      typeof personal === "string" ? JSON.parse(personal) : personal;
    const parsedAcademic =
      typeof academic === "string" ? JSON.parse(academic) : academic;
    const parsedContact =
      typeof contact === "string" ? JSON.parse(contact) : contact;

    const firstName = parsedFullName?.firstName;
    const lastName = parsedFullName?.lastName;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }
    if (req.file) {
      if (user.profile?.personal?.imageId) {
        try {
          await deleteFile(user.profile.personal.imageId);
        } catch (error) {
          console.error("Old Image Delete Error:", error);
        }
      }

      const uploadResult = await uploadFile(req.file, "MYWA_Profile");

      // Ensure 'profile.personal' object exists before assigning
      if (!user.profile) user.profile = {};
      if (!user.profile.personal) user.profile.personal = {};

      user.profile.personal.imageUrl = uploadResult.url;
      user.profile.personal.imageId = uploadResult.fileId;
    }

    // 1. UPDATE ROOT FIELDS
    if (userName) user.userName = userName;
    if (firstName) user.fullName.firstName = firstName;
    if (lastName) user.fullName.lastName = lastName;
    if (branch) user.branch = branch;

    // 2. UPDATE NESTED PROFILE FIELDS
    if (!user.profile) user.profile = {};
    if (parsedPersonal) {
      const safePersonalUpdates = { ...parsedPersonal };

      // Ignore client-side image fields so the uploaded ImageKit values are not overwritten.
      delete safePersonalUpdates.imageUrl;
      delete safePersonalUpdates.imageId;

      if (safePersonalUpdates.gender === "")
        delete safePersonalUpdates.gender;
      if (safePersonalUpdates.bloodGroup === "")
        delete safePersonalUpdates.bloodGroup;

      user.profile.personal = {
        ...user.profile.personal,
        ...safePersonalUpdates,
      };
    }
    if (parsedAcademic)
      user.profile.academic = { ...user.profile.academic, ...parsedAcademic };
    if (parsedContact)
      user.profile.contact = { ...user.profile.contact, ...parsedContact };

    // 3. Save the database
    await user.save();

    const updateUser = await User.findById(req.user._id).select(
      "-password -refreshToken -resetPasswordToken -resetPasswordExpire",
    );

    res.status(200).json({
      message: "Profile updated successfully 🎉",
      success: true,
      user: updateUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getMyProfileController,
  updateProfile,
};
