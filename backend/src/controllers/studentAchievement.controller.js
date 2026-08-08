const stdAchievement = require("../models/studentAchievement.model");

const autoAwardBadge = async (
  studentId,
  branch,
  title,
  description,
  badgeType,
) => {
  try {
    const alreadyExists = await stdAchievement.findOne({ student: studentId , title:title });

    if (!alreadyExists) {
      await stdAchievement.create({
        student: studentId,
        branch,
        title,
        description,
        badgeType,
      });
      // console.log(`🏆 Auto-Awarded: ${title} to student ${studentId}`);
    }
  } catch (error) {
    console.error("Auto Award Error:", error);
  }
};

const getMyAchievements = async (req, res) => {
  try {
    const achievements = await stdAchievement
      .find({ student: req.user._id })
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, achievements });
  } catch (error) {
    console.error("Get my achievements error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  autoAwardBadge,
  getMyAchievements,
};
