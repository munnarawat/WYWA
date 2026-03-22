const ticketModel = require("../models/ticket.model");

const createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }
    const ticket = await ticketModel.create({
      student: req.user._id,
      branch: req.user.branch,
      title,
      description,
    });
    return res.status(201).json({
      success: true,
      message: "Issue reported successfully. Admin will check it soon! 🛠️",
      ticket,
    });
  } catch (error) {
    console.error("Create ticket error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMyTicket = async (req, res) => {
  try {
    const tickets = await ticketModel
      .find({ student: req.user._id })
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      tickets,
    });
  } catch (error) {
    console.error("Get my tickets error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
    createTicket,
    getMyTicket
}
