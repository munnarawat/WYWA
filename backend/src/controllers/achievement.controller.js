const achievementModel = require("../models/achievement.model");
const { uploadFile, deleteFile } = require("../service/storage.service");
// createAchievement (admin only);
const createAchievement = async (req, res) => {
  try {
    const { studentName, examName, year } = req.body;
    let imageUrl = "";
    let imageId = "";
    if (!studentName || !examName || !year) {
      return res
        .status(400)
        .json({ message: "studentName, examName, year are required" });
    }

    if (req.file) {
      const uploadResult = await uploadFile(req.file, "MYWA_Achievements");
      imageUrl = uploadResult.url;
      imageId = uploadResult.fileId;
    }

    const achievement = await achievementModel.create({
      studentName,
      examName,
      year,
      imageUrl,
      imageId,
      createdBy: req.user._id,
      branch: req.user.branch,
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
    const { branch } = req.query;
    const query = branch ? { branch: branch } : {};
    const achievement = await achievementModel
      .find(query)
      .populate("createdBy", "userName email")
      .sort({ year: -1, createdAt: -1 });

    return res.status(200).json({
      success:true,
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
    if (achievement.branch !== req.user.branch) {
      return res.status(403).json({ message: "Unauthorized branch access" });
    }
    // delete from imageKit
    if (achievement.imageId) {
      try {
        await deleteFile(achievement.imageId);
      } catch (error) {
        console.error("ImageKit delete error", error);
      }
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
    const { studentName, examName, year } = req.body;

    const achievement = await achievementModel.findById(id);
    if (!achievement) {
      return res.status(404).json({
        message: "achievement not found",
      });
    }
    if (achievement.branch !== req.user.branch) {
      return res.status(403).json({ message: "Unauthorized branch access" });
    }

    if (req.file) {
      if (achievement.imageId) {
        try {
          await deleteFile(achievement.imageId);
        } catch (error) {
          console.error("Old Image Delete Error:", err);
        }
      }
      // upload new image
      const uploadResult = await uploadFile(req.file, "MYWA-Achievements");
      achievement.imageUrl = uploadResult.url;
      achievement.imageId = uploadResult.fileId;
    }

    if (studentName) achievement.studentName = studentName;
    if (examName) achievement.examName = examName;
    if (year) achievement.year = year;

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
  updateAchievement,
};
