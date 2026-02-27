const UserModel = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userRegisterController = async (req, res) => {
  try {
    const { userName, email, fullName, password } = req.body;

    const firstName = fullName?.firstName;
    const lastName = fullName?.lastName;

    // check all field are required
    if (!userName || !email || !firstName || !lastName || !password) {
      return res.status(400).json({ message: "all field are required " });
    }
    // check user exits or not!
    const UserExits = await UserModel.findOne({
      $or: [{ userName }, { email }],
    });

    if (UserExits) {
      return res.status(400).json({
        message: " user  already exits ",
      });
    }
    // password hash to more safe
    const hashPassword = await bcryptjs.hash(password, 10);

    // user Create....
    const user = await UserModel.create({
      userName,
      email,
      fullName: {
        firstName,
        lastName,
      },
      password: hashPassword,
    });

    // token generate
    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error("ACCESS_TOKEN_SECRET not defined");
    }
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      },
    );
    const refreshToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      },
    );
    // set cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 15 * 60 * 1000, //15min
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 day
    });
    user.refreshToken = refreshToken;
    await user.save();
    // return response
    return res.status(201).json({
      message: "user register successfully 🎉",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error in user registration:", error);
    return res.status(500).json({
      message: "Internal server error in user registration",
    });
  }
};
const loginController = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    //  input validation
    if (!identifier || !password) {
      return res.status(400).json({
        message: "invalid credentials",
      });
    }
    const user = await UserModel.findOne({
      $or: [{ userName: identifier }, { email: identifier }],
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "invalid credentials",
      });
    }
    // check block user are not login
    if (!user.isActive) {
      return res.status(403).json({
        message: "Your account has been blocked. Please contact support.",
      });
    }
    // // check if password is correct or not!
    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid password ❌",
      });
    }

    // token generate
    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error("ACCESS_TOKEN_SECRET not defined");
    }
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      },
    );
    const refreshToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      },
    );
    // set cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 15 * 60 * 1000, // 15min
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 day
    });
    user.refreshToken = refreshToken;
    await user.save();
    // return user
    return res.status(200).json({
      message: "user login successfully🎉",
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("login error", error);
    res.status(500).json({
      message: "internal server error in user login",
    });
  }
};
const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    message: "user fetched successfully🎉",
    user: req.user,
  });
};
const logoutController = async (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    user = await UserModel.findById(req.user.id);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
    return res.status(200).json({ message: "logout successfully🎉" });
  } catch (error) {
    res.status(500).json({ message: "internal server error in user logout" });
  }
};
// refreshController
const refreshController = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "no refresh token found" });
    }
    const user = await UserModel.findOne({ refreshToken: token });

    if (!user) {
      return res.status(403).json({ message: "Session expired" });
    }
    const decoded =  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const newAccessToken = jwt.sign(
      { id: decoded.id, },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" },
      );

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });
      return res.status(200).json({ message: "access token refreshed successfully" });
  } catch (error) {
    console.error("Error in refreshing token:", error);
    return res
      .status(500)
      .json({ message: "internal server error in token refresh" });
  }
};

module.exports = {
  userRegisterController,
  loginController,
  getCurrentUser,
  logoutController,
  refreshController,
};
