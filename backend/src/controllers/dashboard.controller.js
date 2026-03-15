const User = require("../models/user.model");
const Book = require("../models/book.model");
const Issue = require("../models/issue.model");
const Achievement = require("../models/achievement.model");
const Notice = require("../models/notice.model");

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
        User.countDocuments({role:"student", branch:branch, isActive:true,}),
        Book.countDocuments({branch:branch}),
        Issue.countDocuments({branch:branch, status:{$ne : "returned"}}),
        Achievement.countDocuments({branch:branch}),

        // 2. Recent Activities Queries (Top 5 for tables/lists)
        Issue.find({branch:branch})
        .populate("student", "userName email")
        .populate("book", "title")
        .sort({createdAt:-1})
        .limit(5),

        Notice.find({branch:branch})
        .populate("createdBy", "userName")
        .sort({createdAt:-1})
        .limit(5)
    ]);

    return res.status(200).json({
        message:"Dashboard data fetch successfully 🎉",
        stats:{
            totalStudents,
            totalBooks,
            activeIssues,
            totalAchievements
        },
        recentActivity:{
            recentIssues,
            recentNotices
        }
    })
  } catch (error) {
    console.error("Dashboard overview error:", error);
    res.status(500).json({ message: "Internal server error while fetching dashboard data" });
  }
};


module.exports={
    getDashboardOverview
}