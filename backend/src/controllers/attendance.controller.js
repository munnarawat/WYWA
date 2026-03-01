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

    if(student.branch !== req.user.branch){
      return res.status(403).json({ message: "You can only mark attendance for students in your branch" });
    }
    const record = await Attendance.findOneAndUpdate(
      { student: studentId, date: new Date(date) },
      {
        student: studentId,
        date: new Date(date),
        status: status || "present",
        markedBy: req.user.id,
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
    const student = await userModel.findById(studentId);
    if(!student){
      return res.status(404).json({message:" student not found"});
    }

    // branch check
    if(  req.user.role !== "admin" && student.branch !== req.user.branch){
      return res.status(403).json({
        message: "You can only view attendance for students in your branch",
      })
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

// 3) Leaderboard (Top attendance in a month)

const getLeaderboard = async (req, res) => {
  try {
    const { year, month, limit = 10 } = req.query;
    if (year === undefined || month === undefined) {
      return res.status(400).json({ message: "year and month are required" });
    }
    const start = new Date(year, month, 1);
    const end = new Date(year, Number(month) + 1, 0, 23, 59, 59);

    const leaderboard = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end },
          status: "present",
        },
      },
      {
        $group: {
          _id: "$student",
          presentCount: { $sum: 1 },
        },
      },
      {
        $sort: { presentCount: -1 },
      },
      { $limit: Number(limit) },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "student",
        },
      },
      {
        $unwind: "$student",
      },
      {
        $match:{
          "student.branch":req.user.branch
        }
      },
      {
        $project: {
          _id: 0,
          studentId: "$student._id",
          userName: "$student.userName",
          email: "$student.email",
          branch: '$student.branch',
          presentCount: 1,
        },
      },
    ]);
    return res.status(200).json({
      message: `Leaderboard fetched successfully for ${req.user.branch} branch 🏆`,
      leaderboard,
    });
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  markAttendance,
  getMonthlyAttendance,
  getLeaderboard
};
