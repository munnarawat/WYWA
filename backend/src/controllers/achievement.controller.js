const achievementModel = require("../models/achievement.model");

// createAchievement (admin only);
const createAchievement = async (req, res) => {
  try {
    const { studentName, examName, year, description } = req.body;

    if (!studentName || !examName || !year) {
      return res
        .status(400)
        .json({ message: "studentName, examName, year are required" });
    }

    const achievement = await achievementModel.create({
      studentName,
      examName,
      year,
      description,
      createdBy: req.user._id,
    });
    return res.status(201).json({
      message: "create Achievement successfully 🎉",
      achievement,
    });
  } catch (error) {
    console.error("achievement create error", error);
    res.status(500).json({ message: "internal server error" });
  }
};

// get all Achievement (public / student)
const getAllAchievement = async (req, res) => {
  try {
    const achievement = await achievementModel
      .find()
      .populate("createdBy", "userName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "getAll achievement fetched successfully 🎉",
      achievement,
    });
  } catch (error) {
    console.error(" getAll achievement  error", error);
    res.status(500).json({ message: "internal server error" });
  }
};

// delete achievement(admin only)
const deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params;

    const achievement = await achievementModel.findById(id);
    if (!achievement) {
      return res.status(404).json({ message: "achievement not found" });
    }
    await achievement.deleteOne();
    return res.status(200).json({
      message: "achievement deleted successfully 🎉",
    });
  } catch (error) {
    console.error(" delete achievement  error", error);
    res.status(500).json({ message: "internal server error" });
  }
};

//update achievement (admin only)
const updateAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentName, examName, year, description } = req.body;

    const achievement = await achievementModel.findById(id);
    if (!achievement) {
      return res.status(404).json({
        message: "achievement not found",
      });
    }
    if (studentName) achievement.studentName = studentName;
    if (examName) achievement.examName = examName;
    if (year) achievement.year = year;
    if (description) achievement.description = description;

    await achievement.save();
    return res.status(200).json({
      message: "achievement update successfully 🎉",
      achievement,
    });
  } catch (error) {
    console.error(" update achievement  error", error);
    res.status(500).json({ message: "internal server error" });
  }
};
module.exports = {
  createAchievement,
  getAllAchievement,
  deleteAchievement,
  updateAchievement
};
