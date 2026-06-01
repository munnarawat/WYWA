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
module.exports={
    getPublicData
}
