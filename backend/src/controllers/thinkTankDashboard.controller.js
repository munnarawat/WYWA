const UserModel = require("../models/user.model");
const AttendanceModel = require("../models/attendance.model");
const BookModel = require("../models/book.model");
const IssuedBook = require("../models/issue.model");
const getBranchFilter = (req) => {
  const { role, branch: userBranch } = req.user;

  let targetBranch = req.query.branch;

  if (role !== "thinkTank") {
    targetBranch = userBranch;
  }
  if (!targetBranch || targetBranch === "all") return {};
  return { branch: targetBranch.toLowerCase() };
};

const getDashboardStats = async (req, res) => {
  try {
    const branchFilter = getBranchFilter(req);
    // 📊 1. Total Students Fetch
    const totalStudents = await UserModel.countDocuments({
      role: "student",
      ...branchFilter,
    });

    // 📊 2. library member
    const libraryMember = await UserModel.countDocuments({
      role: "student",
      isLibraryMember: true,
      ...branchFilter,
    });

    const totalBooks = await BookModel.countDocuments(branchFilter);
    const issueBooks = await BookModel.countDocuments({
      status: "issued",
      ...branchFilter,
    });

    return res.status(200).json({
      success: true,
      data: {
        totalStudents,
        libraryMember,
        totalBooks: totalBooks,
        issueBooks: issueBooks,
        branch: req.query.branch || "all",
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetchstats" });
  }
};

const getAttendanceChartData = async (req, res) => {
  try {
    const branchFilter = getBranchFilter(req);

    const charData = await AttendanceModel.aggregate([
      {
        $match: {
          ...branchFilter,
          date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          presentCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return res.status(200).json({
      success: true,
      data: charData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error in chart data" });
  }
};

// get studentList
const getAllStudentsList = async (req, res) => {
  try {
    const branchFilter = getBranchFilter(req);

    const Students = await UserModel.find({ role: "student", ...branchFilter })
      .select(
        "userName email fullName branch profile.academic profile.personal.imageUrl",
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: Students.length,
      data: Students,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error in student list" });
  }
};

//  GET LIBRARY OVERVIEW
const getLibraryOverview = async (req, res) => {
  try {
    const branchFilter = getBranchFilter(req);

    const books = await IssuedBook.find(branchFilter)
      .populate("issuedBy", "userName fullName")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: books,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error in library overview" });
  }
};
module.exports = {
  getDashboardStats,
  getAttendanceChartData,
  getAllStudentsList,
  getLibraryOverview,
};
