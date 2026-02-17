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
    if (!process.env.JWT_SECRET_KEY) {
      throw new Error("JWT secret not defined");
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1D",
      },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, //1 day
    });
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
        message: "identifier and password are required",
      });
    }
    const user = await UserModel.findOne({
      $or: [{ userName: identifier }, { email: identifier }],
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid userName and email ❌",
      });
    }

    // check block user are not login
    if (!user.isActive) {
      return res.status();
    }
    // // check if password is correct or not!
    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid password ❌",
      });
    }

    // jwt safety check✅
    if (!process.env.JWT_SECRET_KEY) {
      throw new Error("JWT secret not defined");
    }
    // JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, //1 day
    });

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
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    return res.status(200).json({ message: "logout successfully🎉" });
  } catch (error) {
    res.status(500).json({ message: "internal server error in user logout" });
  }
};

module.exports = {
  userRegisterController,
  loginController,
  getCurrentUser,
  logoutController,
};
