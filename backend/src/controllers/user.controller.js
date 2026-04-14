const UserModel = require("../models/user.model");
const AttendanceModel = require("../models/attendance.model");
const IssuedBook = require("../models/issue.model");
const mongoose = require("mongoose");

const getBranchFilter = (req) => {
  const { role, branch: userBranch } = req.user;

  let targetBranch = req.query.branch;

  if (role !== "thinkTank") {
    targetBranch = userBranch;
  }
  if (!targetBranch || targetBranch === "all") return {};
  return { branch: targetBranch.toLowerCase() };
};

const getUserProfile360 = async (req, res) => {
  try {
    const targetId = req.params.id;
    const requesterRole = req.user.role;

    // 1. Valid ID Check
    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Id format",
      });
    }

    // 2. Find Target User
    const targetUser = await UserModel.findById(targetId).lean();
    if (!targetUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 🛡️ 3. THE MASTERMIND SECURITY LOGIC 🛡️
    const branchFilter = getBranchFilter(req);

    if (requesterRole === "thinkTank") {
      if (targetUser.role !== "student") {
        return res.status(403).json({
          success: false,
          message: "Access Denied: Think-Tanks can only view Student profiles.",
        });
      }
    } else if (requesterRole === "admin") {
      if (branchFilter.branch && targetUser.branch !== branchFilter.branch) {
        return res.status(403).json({
          success: false,
          message: "Access Denied: Admins can only view profiles within their own branch.",
        });
      }
    }

    // 4. Common Personal Details
    const firstName = targetUser.fullName?.firstName || "";
    const lastName = targetUser.fullName?.lastName || "";
    const finalName = `${firstName} ${lastName}`.trim() || targetUser.userName;

    const profileData = {
      personalDetails: {
        _id: targetUser._id,
        role: targetUser.role,
        fullName: finalName,
        email: targetUser.email,
        branch: targetUser.branch,
        imageUrl: targetUser.profile?.personal?.imageUrl || "",
        phone: targetUser.profile?.contact?.phone || "N/A",
        joinedAt: targetUser.createdAt,
      },
    };

    // 5. Dynamic Data Fetching (Role based)
    if (targetUser.role === "student") {
      const [attendanceRecords, libraryRecords] = await Promise.all([
        AttendanceModel.find({ student: targetId }).sort({ date: -1 }).lean(),
        IssuedBook.find({ issuedBy: targetId }) 
          .populate("book", "title")
          .sort({ createdAt: -1 })
          .lean(),
      ]);

      const totalDays = attendanceRecords.length;
      const presentDays = attendanceRecords.filter((r) => r.status === "present").length;

      profileData.attendanceStats = {
        percentage: totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0,
        totalDays,
        presentDays,
        absentDays: totalDays - presentDays,
        recentRecords: attendanceRecords.slice(0, 7),
      };

      profileData.libraryStats = {
        isLibraryMember: libraryRecords.length > 0,
        activeIssues: libraryRecords.filter((r) => r.status?.toLowerCase() !== "returned"),
        returnHistory: libraryRecords.filter((r) => r.status?.toLowerCase() === "returned"),
      };
    } else if (targetUser.role === "admin" || targetUser.role === "thinkTank") {
      profileData.staffStats = {
        message: "Staff performance metrics will be displayed here.",
        department: targetUser.department || "General",
      };
    }

    return res.status(200).json({
      success: true,
      data: profileData,
    });
  } catch (error) {
    console.error("Universal Profile API Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching profile details",
    });
  }
};

module.exports = {
    getUserProfile360
}