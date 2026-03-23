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
      branch: req.user.branch,
    });
    console.log("Admin branch is:", req.user.branch);
    const io = req.app.get("io");
    
    io.to(req.user.branch).emit("receive_notification",{
      title:"📢 New Announcement",
      message: `${title}: ${description}`,
    })
    console.log("Notification emitted to branch room!");
    return res.status(201).json({
      success: true,
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const query = { branch: req.user.branch };
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const total = await noticeModel.countDocuments(query);

    const notices = await noticeModel
      .find(query)
      .populate("createdBy", " userName email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: "notices fetched successfully🎉",
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalNotices: total,
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

module.exports = {
  createNotice,
  getAllNotice,
  deleteNotice,
  updateNotice,
};
