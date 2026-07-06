const thinkTankModel = require("../models/thinkTank.model");
const { uploadFile, deleteFile } = require("../service/storage.service");
// createThinkTank (admin only)
const createThinkTank = async (req, res) => {
  try {
    const { name, roleOrContribution, description, contact } = req.body;
    let imageUrl = "";
    let imageId = "";
    if (!name || !roleOrContribution) {
      return res
        .status(400)
        .json({ message: "name and roleOrContribution are required" });
    }
    if (req.file) {
      const uploadResult = await uploadFile(req.file, "MYWA_ThinkThank");
      imageUrl = uploadResult.url;
      imageId = uploadResult.fileId;
    }
    const member = await thinkTankModel.create({
      name,
      roleOrContribution,
      description,
      contact,
      imageUrl,
      imageId,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      message: "ThinkTank created successfully 🎉",
      member,
    });
  } catch (error) {
    console.error("create thinkTank error", error);
    res.status(500).json({ message: "internal server error" });
  }
};

// getAllThinkTank (public /student)
const getAllThinkTank = async (req, res) => {
  try {
    const members = await thinkTankModel
      .find()
      .populate("createdBy", "userName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "fetched all ThinkTank members 🎉 ",
      members,
    });
  } catch (error) {
    console.error("create thinkTank error", error);
    res.status(500).json({ message: "internal server error" });
  }
};

// update thinkTank member (admin only)
const updateThinkTank = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing" });
    }
    const { id } = req.params;
    const { name, roleOrContribution, description, contact, imageUrl } =
      req.body;

    const member = await thinkTankModel.findById(id);

    if (!member) {
      return res.status(404).json({ message: "Think Tank member not found" });
    }
    // image upload
    if (req.file) {
      if (thinkTankModel(imageUrl)) {
        try {
          await deleteFile(member.imageId);
        } catch (error) {
          console.error("Old Image Delete Error:", err);
        }
      }
    }
    const resultUpload = await uploadFile(req.file, "MYWA_ThinkThank");
    member.imageUrl = resultUpload.url;
    member.imageId = resultUpload.fileId;

    if (name) member.name = name;
    if (roleOrContribution) member.roleOrContribution = roleOrContribution;
    if (description !== undefined) member.description = description;
    if (contact !== undefined) member.contact = contact;

    await member.save();

    return res.status(200).json({
      message: " ThinkTank member updated successfully 🎉",
      member,
    });
  } catch (error) {
    console.error("update thinkTank error", error);
    res.status(500).json({ message: "internal server error" });
  }
};

// delete thinkTank member (admin only)
const deleteThinkTank = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await thinkTankModel.findById(id);
    if (!member) {
      return res.status(404).json({ message: "Think Tank member not found" });
    }
    // delete from imageKit
    if (member.imageUrl) {
      try {
        await deleteFile(member.imageId);
      } catch (error) {
        console.error("ImageKit delete error", error);
      }
    }
    await member.deleteOne();

    return res.status(200).json({
      message: " ThinkTank member deleted successfully 🎉",
      member,
    });
  } catch (error) {
    console.error("delete thinkTank error", error);
    res.status(500).json({ message: "internal server error" });
  }
};

const getMainThinkTank = async (req, res) => {
  try {
    const mainThinkTank = await thinkTankModel.find({ isMain: true }).limit(4);
    return res.status(200).json({
      success: true,
      message: "mainThinkTank member find successfully🎉",
      mainThinkTank,
    });
  } catch (error) {
    console.error("main thinkTank member error", error);
    res.status(500).json({ success: false, message: "internal server error" });
  }
};
module.exports = {
  createThinkTank,
  getAllThinkTank,
  updateThinkTank,
  deleteThinkTank,
  getMainThinkTank
};
