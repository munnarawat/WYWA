const UserModel = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userRegisterController = async (req, res) => {
  try {
    const { userName, email, fullName, password } = req.body;

    const firstName = fullName?.firstName;
    const lastName = fullName?.lastName;
     
    // check all field are required
    if(!userName|| !email || !firstName || !lastName || !password){
        return res.status(400).json({message:"all field are required "})
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
    if(!process.env.JWT_SECRET_KEY){
        throw new Error("JWT secret not defined");
    }
    const token = jwt.sign({ id: user._id , role:user.role }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1D",
    });
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
        role:user.role
      },
    });
  } catch (error) {
    console.error("Error in user registration:", error);
    return res.status(500).json({
      message: "Internal server error in user registration",
    });
  }
};

module.exports = {
  userRegisterController,
};
