const Attendance = require("../models/attendance.model");
const userModel = require("../models/user.model");
const stdAchievement = require("../models/studentAchievement.model");
const Notification = require("../models/notification.model");
const {
  autoAwardBadge,
} = require("../controllers/studentAchievement.controller");
// markAttendance  adminOnly
const markAttendance = async (req, res) => {
  try {
    const { studentId, date, status } = req.body;

    if (!studentId || !date) {
      return res
        .status(400)
        .json({ message: "studentId and date are required" });
    }

    //  THE FIX: Future Date Validation
    const requestDate = new Date(date);
    const today = new Date();
    requestDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (requestDate > today) {
      return res.status(400).json({
        success: false,
        message: "Attendance cannot be recorded for any future date!",
      });
    }

    const student = await userModel.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found " });
    }

    if (student.branch !== req.user.branch) {
      return res.status(403).json({
        message: "You can only mark attendance for students in your branch",
      });
    }
    const record = await Attendance.findOneAndUpdate(
      { student: studentId, date: requestDate },
      {
        $set: {
          status: status || "present",
          markedBy: req.user._id,
          branch: student.branch,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      },
    );

    if (status === "present" || !status) {
      const io = req.app.get("io");

      // --- BADGE 1: FIRST STEP 🌟 ---
      const totalPresentEver = await Attendance.countDocuments({
        student: studentId,
        status: "present",
      });
      const hasFirstStep = await stdAchievement.findOne({
        student: studentId,
        title: "First Step 🌟",
      });

      if (totalPresentEver >= 1 && !hasFirstStep) {
        autoAwardBadge(
          studentId,
          req.user.branch,
          "First Step 🌟",
          "Marked your very first attendance.",
          "attendance",
        );
        io.to(
          studentId.toString().emit("receive_notification", {
            title: "Welcome! 🌟",
            message: "Great start! You unlocked the 'First Step' badge!",
            type: "success",
          }),
        );
        await Notification.create({
          recipient: studentId,
          title: "Welcome! 🌟",
          message: "Great start! You unlocked the 'First Step' badge!",
          type: "success",
        });
      }

      const nowForStreak = new Date(requestDate);
      const startOfThisMonth = new Date(
        nowForStreak.getFullYear(),
        nowForStreak.getMonth(),
        1,
      );

      // --- 15 days check---
      const lastRecord = await Attendance.find({
        student: studentId,
        date: {
          $gte: startOfThisMonth,
        },
      })
        .sort({ date: -1 })
        .limit(15);
      let currentStreak = 0;
      for (let i = 0; i < lastRecord.length; i++) {
        if (lastRecord[i].status === "present") {
          currentStreak++;
        } else {
          break;
        }
      }

      // --- NOTIFICATION: 6-DAY STREAK ---
      if (currentStreak === 6) {
        io.to(studentId.toString()).emit("receive_notification", {
          title: "Almost There! 🔥",
          message:
            "You are on a 6-day streak! Come tomorrow to unlock the 7-Day Streak Badge! 🏆",
          type: "motivation",
        });
        await Notification.create({
          recipient: studentId,
          title: "Almost There! 🔥",
          message:
            "You are on a 6-day streak! Come tomorrow to unlock the 7-Day Streak Badge! 🏆",
          type: "motivation",
        });
      }
      // --- BADGE 2: 7 DAYS STREAK 🔥 ---
      if (currentStreak === 7) {
        autoAwardBadge(
          studentId,
          req.user.branch,
          "7 Days Streak 🔥",
          "You attended the library for 7 consecutive days!",
          "attendance",
        );
        io.to(studentId.toString()).emit("receive_notification", {
          title: "Badge Unlocked! 🏆✨",
          message: "Congratulations! You earned the '7 Days Streak' badge!",
          type: "success",
        });
        await Notification.create({
          recipient: studentId,
          title: "Badge Unlocked! 🏆✨",
          message: "Congratulations! You earned the '7 Days Streak' badge!",
          type: "success",
        });
      }

      // --- BADGE 3: CONSISTENCY KING 👑 (15 Days) ---
      if (currentStreak === 15) {
        autoAwardBadge(
          studentId,
          req.user.branch,
          "Consistency King 👑",
          "Maintained a 15-day streak.",
          "attendance",
        );
        io.to(studentId.toString()).emit("receive_notification", {
          title: "Unstoppable! 👑",
          message: "15 Days Streak! You unlocked the Consistency King badge!",
          type: "success",
        });
        await Notification.create({
          recipient: studentId,
          title: "Unstoppable! 👑",
          message: "15 Days Streak! You unlocked the Consistency King badge!",
          type: "success",
        });
      }

      // --- BADGE 4: MONTHLY CHAMP 🏆 ---
      const year = requestDate.getFullYear();
      const month = requestDate.getMonth();
      const dayInThisMonth = new Date(year, month + 1, 0).getDate();

      const monthStart = new Date(year, month + 1);
      const monthEnd = new Date(year, month + 1, 0, 23, 59, 59);

      const presentsThisMonth = await Attendance.countDocuments({
        student: studentId,
        status: "present",
        date: { $gte: monthStart, $lte: monthEnd },
      });

      if (presentsThisMonth === dayInThisMonth) {
        autoAwardBadge(
          studentId,
          req.user.branch,
          "Monthly Champ 🏆",
          "100% attendance in a single month.",
          "attendance",
        );
        io.to(studentId.toString()).emit("receive_notification", {
          title: "Legend! 🏆",
          message: "100% Attendance this month! You are the Monthly Champ!",
          type: "success",
        });
        await Notification.create({
          recipient: studentId,
          title: "Legend! 🏆",
          message: "100% Attendance this month! You are the Monthly Champ!",
          type: "success",
        });
      }
    }

    return res.status(200).json({
      success: true,
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
    if (!student) {
      return res.status(404).json({ message: " student not found" });
    }

    // branch check
    if (req.user.role !== "admin" && student.branch !== req.user.branch) {
      return res.status(403).json({
        message: "You can only view attendance for students in your branch",
      });
    }

    const monthIndex = Number(month) - 1;
    const start = new Date(year, monthIndex, 1);
    const end = new Date(year, monthIndex + 1, 0, 23, 59, 59);

    const records = await Attendance.find({
      student: studentId,
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 });

    const totalDays = records.length;
    const presentDays = records.filter((r) => r.status === "present").length;
    const absentDays = totalDays - presentDays;

    let currentStreak = 0;
    for (let i = records.length - 1; i >= 0; i--) {
      if (records[i].status === "present") {
        currentStreak++;
      } else {
        break;
      }
    }

    return res.status(200).json({
      message: "Monthly attendance fetched",
      summary: {
        totalDays,
        presentDays,
        absentDays,
        percentage:
          totalDays === 0 ? 0 : Math.round((presentDays / totalDays) * 100),
        currentStreak,
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

    // Step 1: Check if ANY attendance exists for this month
    const totalMonthRecords = await Attendance.countDocuments({
      date: { $gte: start, $lte: end },
      status: "present",
    });

    if (totalMonthRecords === 0) {
      return res
        .status(200)
        .json({ message: "No data found", leaderboard: [] });
    }

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
        $match: {
          "student.branch": new RegExp(`^${req.user.branch}$`, "i"),
        },
      },
      {
        $sort: {
          presentCount: -1,
          "student.userName": 1,
        },
      },
      { $limit: Number(limit) },
      {
        $project: {
          _id: 0,
          studentId: "$student._id",
          userName: "$student.userName",
          email: "$student.email",
          branch: "$student.branch",
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

const getMyStreaks = async (req, res) => {
  try {
    const records = await Attendance.find({
      student: req.user._id,
      status: "present",
    }).sort({ date: -1 });

    if (records.length === 0) {
      return res
        .status(200)
        .json({ success: true, currentStreak: 0, highestStreak: 0 });
    }
    const dates = records.map((r) => {
      const d = new Date(r.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    });
    // Remove duplicates

    const uniqueDates = [...new Set(dates)].sort((a, b) => b - a);

    const ONE_DAY = 24 * 60 * 60 * 1000;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();
    const yesterdayTime = todayTime - ONE_DAY;

    let currentStreak = 0;
    let highestStreak = 0;
    let tempStreak = 1;

    // 🏆 Calculate HIGHEST Streak
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      if (uniqueDates[i] - uniqueDates[i + 1] === ONE_DAY) {
        tempStreak++;
      } else {
        if (tempStreak > highestStreak) highestStreak = tempStreak;
        tempStreak = 1;
      }
    }
    if (tempStreak > highestStreak) highestStreak = tempStreak;
    if (uniqueDates.length === 0) highestStreak = 1;

    // 🔥 Calculate CURRENT Streak
    if (uniqueDates[0] === todayTime || uniqueDates === yesterdayTime) {
      currentStreak = 1;
      for (let i = 0; i < uniqueDates.length - 1; i++) {
        if (uniqueDates[i] - uniqueDates[i + 1] === ONE_DAY) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
    return res.status(200).json({
      success: true,
      currentStreak,
      highestStreak,
    });
  } catch (error) {
    console.error("Streak calculation error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  markAttendance,
  getMonthlyAttendance,
  getLeaderboard,
  getMyStreaks,
};
