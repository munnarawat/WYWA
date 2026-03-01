const UserModel = require("../models/user.model");

// getAll user
const getAllUser = async (req, res) => {
  try {
    const users = await UserModel.find({branch:req.user.branch}).select("-password");
    return res.status(200).json({
      message: "user Fetched successfully ✅",
      users,
    });
  } catch (error) {
    console.error("get user error", error);
    res.status(500).json({ message: "internal server error in getAllUser" });
  }
};

//block unblock user

const toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;
    // Prevent admin from blocking himself
    if (req.user.id.toString() === id) {
      return res.status(400).json({
        message: "you cannot block yourself",
      });
    }
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    if(user.branch !== req.user.branch){
      return res.status(403).json({
        message: "you can only block users from your branch",
      })
    }
    user.isActive = !user.isActive;
    await user.save();
    return res.status(200).json({
      message: `user ${user.isActive ? "unblocked" : "blocked"} successfully `,
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive,
        branch:user.branch
      },
    });
  } catch (error) {
    console.error("Block/unblock error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// make admin
const makeAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    // branch Security check
    if(user.branch !== req.user.branch){
      return res.status(403).json({
        message:"you can only make admin users from your branch",
      })
    }
    if (user.role === "admin") {
      return res.status(400).json({
        message: "user is already admin",
      });
    }
    user.role = "admin";
    await user.save();

    return res.status(200).json({
      message: "user prompt to admin successfully 🎉",
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
        branch:user.branch
      },
    });
  } catch (error) {
    console.error("Make admin error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  getAllUser,
  toggleBlockUser,
  makeAdmin
};
