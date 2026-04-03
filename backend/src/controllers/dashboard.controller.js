const User = require("../models/user.model");
const Book = require("../models/book.model");
const Issue = require("../models/issue.model");
const Achievement = require("../models/achievement.model");
const Notice = require("../models/notice.model");
const Attendance = require("../models/attendance.model");
const Ticket = require("../models/ticket.model");

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

const normalizeDate = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

const calculateLongestStreak = (dates) => {
  if (dates.length === 0) {
    return 0;
  }

  const uniqueDates = [...new Set(dates.map(normalizeDate))].sort(
    (a, b) => b - a,
  );

  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 0; i < uniqueDates.length - 1; i++) {
    if (uniqueDates[i] - uniqueDates[i + 1] === ONE_DAY_IN_MS) {
      currentStreak += 1;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return longestStreak;
};

const getTopStreakers = async (branch, startOfMonth) => {
  const records = await Attendance.find({
    branch,
    status: "present",
    date: { $gte: startOfMonth },
  })
    .populate("student", "userName email")
    .select("student date")
    .sort({ date: -1 })
    .lean();

  const streakMap = new Map();

  records.forEach((record) => {
    if (!record.student?._id) {
      return;
    }

    const studentId = record.student._id.toString();
    const existing = streakMap.get(studentId) ?? {
      studentId,
      userName: record.student.userName,
      email: record.student.email,
      dates: [],
    };

    existing.dates.push(record.date);
    streakMap.set(studentId, existing);
  });

  return [...streakMap.values()]
    .map(({ dates, ...student }) => ({
      ...student,
      streak: calculateLongestStreak(dates),
    }))
    .filter((student) => student.streak > 0)
    .sort(
      (a, b) => b.streak - a.streak || a.userName.localeCompare(b.userName),
    )
    .slice(0, 5);
};

const getDashboardOverview = async (req, res) => {
  try {
    const branch = req.user.branch;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalStudents,
      totalBooks,
      activeIssues,
      totalAchievements,
      recentIssues,
      recentNotices,
      pendingTickets,
      todayAttendanceData,
      topStreakersData,
    ] = await Promise.all([
      User.countDocuments({ role: "student", branch, isActive: true }),
      Book.countDocuments({ branch }),
      Issue.countDocuments({ branch, status: { $ne: "returned" } }),
      Achievement.countDocuments({ branch }),
      Issue.find({ branch })
        .populate("student", "userName email")
        .populate("book", "title")
        .sort({ createdAt: -1 })
        .limit(5),
      Notice.find({ branch })
        .populate("createdBy", "userName")
        .sort({ createdAt: -1 })
        .limit(5),
      Ticket.find({ branch, status: "pending" })
        .populate("student", "userName email")
        .sort({ createdAt: -1 })
        .limit(5),
      Attendance.aggregate([
        {
          $match: {
            branch,
            date: { $gte: startOfToday, $lte: endOfToday },
          },
        },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      getTopStreakers(branch, startOfMonth),
    ]);

    let todayPresent = 0;
    let todayAbsent = 0;

    todayAttendanceData.forEach((item) => {
      if (item._id === "present") {
        todayPresent = item.count;
      }

      if (item._id === "absent") {
        todayAbsent = item.count;
      }
    });

    return res.status(200).json({
      message: "Dashboard data fetched successfully",
      stats: {
        totalStudents,
        totalBooks,
        activeIssues,
        totalAchievements,
      },
      recentActivity: {
        recentIssues,
        recentNotices,
      },
      pendingTickets,
      todayAttendance: {
        present: todayPresent,
        absent: todayAbsent,
      },
      topStreakers: topStreakersData,
    });
  } catch (error) {
    console.error("Dashboard overview error:", error);
    return res.status(500).json({
      message: "Internal server error while fetching dashboard data",
    });
  }
};

const getStudentDashboardStats = async (req, res) => {
  try {
    const studentId = req.user._id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    const [recentAttendance, currentMonthRecords] = await Promise.all([
      Attendance.find({ student: studentId })
        .sort({ date: -1 })
        .limit(5)
        .select("date status -_id")
        .lean(),
      Attendance.find({
        student: studentId,
        date: { $gte: startOfMonth, $lte: endOfMonth },
      }).lean(),
    ]);

    const totalDays = currentMonthRecords.length;
    const totalPresent = currentMonthRecords.filter(
      (record) => record.status === "present",
    ).length;
    const totalAbsent = totalDays - totalPresent;
    const percentage =
      totalDays === 0 ? 0 : Number(((totalPresent / totalDays) * 100).toFixed(1));

    return res.status(200).json({
      success: true,
      stats: {
        totalPresent,
        totalAbsent,
        percentage,
        recentAttendance,
      },
    });
  } catch (error) {
    console.error("Student dashboard stats error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getDashboardOverview,
  getStudentDashboardStats,
};
