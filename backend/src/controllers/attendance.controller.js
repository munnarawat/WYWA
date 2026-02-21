const Attendance = require("../models/attendance.model");
const userModel = require("../models/user.model");

// markAttendance  adminOnly
const markAttendance = async (req, res) => {
  try {
    const { studentId, date, status } = req.body;

    if (!studentId || !date) {
      return res
        .status(400)
        .json({ message: "studentId and date are required" });
    }
    const student = await userModel.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found " });
    }
    const record = await Attendance.findOneAndUpdate(
      { student: studentId, date: new Date(date) },
      {
        student: studentId,
        date: new Date(date),
        status: status || "present",
        markedBy: req.user._id,
      },
      {
        upsert: true,
        new: true,
      },
    );

    return res.status(200).json({
      message: "Attendance marked successfully 🎉",
      record,
    });
  } catch (error) {
    console.error("Mark attendance error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
    markAttendance,
}
