const UserModel = require("../models/user.model");
const IssueBook = require("../models/issue.model");
const Achievement = require("../models/achievement.model");

const getPublicData = async (req, res) => {
  try {
    const [totalStudents, totalBookIssued, selectedStudentsCount] =
      await Promise.all([
        // total student (all branch)
        UserModel.countDocuments({ role: "student" }),

        // total issuedBook (all branch)
        IssueBook.countDocuments(),

        // total selected student (all branch)
        Achievement.countDocuments(),
      ]);

    return res.status(200).json({
      success: true,
      data: {
        students: totalStudents,
        bookIssued: totalBookIssued,
        selectedStudents:
          selectedStudentsCount > 0 ? selectedStudentsCount : 100,
      },
    });
  } catch (error) {
    console.error("landing status error", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching landing stats",
    });
  }
};
const getAllAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find()
      .populate("studentName")
      .sort({ year: -1, createdAt: -1 });
    return res.status(200).json({
      success: true,
      achievements,
    });
  } catch (error) {
    console.error("get public achievements error", error);
    res.status(500).json({
      message: "Server error while fetching public achievements",
    });
  }
};
module.exports = {
  getPublicData,
  getAllAchievements
};
