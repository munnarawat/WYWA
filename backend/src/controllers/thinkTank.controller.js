const thinkTankModel = require("../models/thinkTank.model");

// createThinkTank (admin only)
const createThinkTank = async (req, res) => {
  try {
    const { name, roleOrContribution, description, contact } = req.body;
    if (!name || !roleOrContribution) {
      return res
        .status(400)
        .json({ message: "name and roleOrContribution are required" });
    }
    const member = await thinkTankModel.create({
      name,
      roleOrContribution,
      description,
      contact,
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
    const { name, roleOrContribution, description, contact } = req.body;

    const member = await thinkTankModel.findById(id);

    if (!member) {
      return res.status(404).json({ message: "Think Tank member not found" });
    }
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
module.exports = {
  createThinkTank,
  getAllThinkTank,
  updateThinkTank,
  deleteThinkTank,
};
