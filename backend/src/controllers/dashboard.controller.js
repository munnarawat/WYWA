const User = require("../models/user.model");
const Book = require("../models/book.model");
const Issue = require("../models/issue.model");
const Achievement = require("../models/achievement.model");
const Notice = require("../models/notice.model");
const Attendance = require("../models/attendance.model");
const Ticket = require("../models/ticket.model");

// Get Dashboard Overview Data (Admin Only)

const getDashboardOverview = async (req, res) => {
  try {
    const branch = req.user.branch;

    // today Date for (today attendance)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // this month limit(top streaker )
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
      // 1. Stats Queries
      User.countDocuments({ role: "student", branch: branch, isActive: true }),
      Book.countDocuments({ branch: branch }),
      Issue.countDocuments({ branch: branch, status: { $ne: "returned" } }),
      Achievement.countDocuments({ branch: branch }),

      // 2. Recent Activities Queries (Top 5 for tables/lists)
      Issue.find({ branch: branch })
        .populate("student", "userName email")
        .populate("book", "title")
        .sort({ createdAt: -1 })
        .limit(5),

      Notice.find({ branch: branch })
        .populate("createdBy", "userName")
        .sort({ createdAt: -1 })
        .limit(5),

      // tickets
      Ticket.find({ branch: branch, status: "pending" })
        .populate("student", "userName email")
        .sort({ createdAt: -1 })
        .limit(5),

      // Today's Attendance Aggregation (Present/Absent Cou
      Attendance.aggregate([
        {
          $match: {
            branch: branch,
            date: { $gte: startOfToday, $lte: endOfToday },
          },
        },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);

    // Top 5 Attendees (Streakers) on this month
    Attendance.aggregate([
      {
        $match: {
          branch: branch,
          status: "present",
          date: { $gte: startOfMonth },
        },
      },
      { $group: { _id: "$student", presentCount: { $sum: 1 } } },
      { $sort: { presentCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "studentData",
        },
      },
      { $unwind: "$studentData" },
      {
        $project: {
          _id: 0,
          student: {
            _id: "$studentData._id",
            userName: "$studentData.userName",
            email: "$studentData.email",
          },
          currentStreak:"$presentCount"
        },
      },
    ]);

    // 🌟 Formatting Today's Attendance
    let todayPresent = 0;
    let todayAbsent = 0;
    todayAttendanceData.forEach((item) => {
      if (item._id === "present") todayPresent = item.count;
      if (item._id === "absent") todayAbsent = item.count;
    });

    return res.status(200).json({
      message: "Dashboard data fetch successfully 🎉",
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
      pendingTickets: pendingTickets,
      todayAttendance: {
        present: todayPresent,
        absent: todayAbsent,
      },
      topStreakers: topStreakersData,
    });
  } catch (error) {
    console.error("Dashboard overview error:", error);
    res
      .status(500)
      .json({ message: "Internal server error while fetching dashboard data" });
  }
};

// Get stats for Student Dashboard

const getStudentDashboardStats = async (req, res) => {
  try {
    const studentId = req.user._id;

    const recentAttendance = await Attendance.find({ student: studentId })
      .sort({ data: -1 })
      .limit(5)
      .select("date status -_id");
    // current month status
    const now = new Date();
    // this month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    const currentMonthRecords = await Attendance.find({
      student: studentId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const totalDays = currentMonthRecords.length;
    const totalPresent = currentMonthRecords.filter(
      (r) => r.status === "present",
    ).length;
    const totalAbsent = totalDays - totalPresent;

    // Percentage calculation
    const percentage =
      totalDays === 0 ? 0 : ((totalPresent / totalDays) * 100).toFixed(1);
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
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
module.exports = {
  getDashboardOverview,
  getStudentDashboardStats,
};
