const User = require("../models/user.model");
const Book = require("../models/book.model");
const Issue = require("../models/issue.model");
const Achievement = require("../models/achievement.model");
const Notice = require("../models/notice.model");
const Attendance = require("../models/attendance.model");

// Get Dashboard Overview Data (Admin Only)

const getDashboardOverview = async (req, res) => {
  try {
    const branch = req.user.branch;
    const [
      totalStudents,
      totalBooks,
      activeIssues,
      totalAchievements,
      recentIssues,
      recentNotices,
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
    ]);

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
  getStudentDashboardStats
};
