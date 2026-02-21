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

// get monthly attendance for student
const getMonthlyAttendance = async (req, res) => {
  try {
    const { studentId, year, month } = req.query;

    if (!studentId || year === undefined || month === undefined) {
      return res.status(400).json({
        message: "studentId, year, month are required",
      });
    }
    const start = new Date(year, month, 1);
    const end = new Date(year, Number(month) + 1, 0, 23, 59, 59);

    const records = await Attendance.find({
      student: studentId,
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 });

    const totalDays = records.length;
    const presentDay = records.filter((r) => r.status === "present").length;
    const absentDay = totalDays - presentDay;

    return res.status(200).json({
      message: "Monthly attendance fetched",
      summary: {
        totalDays,
        presentDay,
        absentDay,
        percentage:
          totalDays === 0 ? 0 : Math.round((presentDay / totalDays) * 100),
      },
      records,
    });
  } catch (error) {
    console.error("Get monthly attendance error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  markAttendance,
  getMonthlyAttendance
};
