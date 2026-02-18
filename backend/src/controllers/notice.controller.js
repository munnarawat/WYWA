const noticeModel = require("../models/notice.model");

// notice create admin only
const createNotice = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and Description are required" });
    }
    const notice = await noticeModel.create({
      title,
      description,
      createdBy: req.user._id,
    });
    return res.status(201).json({
      message: "notice created successfully 🎉",
      notice,
    });
  } catch (error) {
    console.error("create notice error", error);
    res.status(500).json({ message: "internal server error in create notice" });
  }
};

// get all notice (public/ student);
const getAllNotice = async (req, res) => {
  try {
    const notices = await noticeModel
      .find()
      .populate("createdBy", "userName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "notices fetched successfully🎉",
      notices,
    });
  } catch (error) {
    console.error("get notice error", error);
    res.status(500).json({ message: "internal server error in get notice" });
  }
};

// const DeleteNotice (Admin only);
const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const notice = await noticeModel.findById(id);

    if (!notice) {
      return res.status(404).json({ message: "notice not found" });
    }
    await notice.deleteOne();
    res.status(200).json({
      message: "notice deleted successfully🎉",
    });
  } catch (error) {
    console.error("delete notice error", error);
    res.status(500).json({ message: "internal server error" });
  }
};

// update notice (admin only);
const updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "noting to updated" });
    }
    const notice = await noticeModel.findById(id);

    if (!notice) {
      return res.status(404).json({ message: "notice not found" });
    }
    if (title) notice.title = title;
    if (description) notice.description = description;
    
    await notice.save();

    return res.status(200).json({
      message: "notice updated successfully 🎉",
      notice,
    });
  } catch (error) {
    console.error("notice update error", error);
    res.status(500).json({ message: "internal server error" });
  }
};

// 

module.exports = {
  createNotice,
  getAllNotice,
  deleteNotice,
  updateNotice
};
