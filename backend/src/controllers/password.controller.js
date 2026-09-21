const User = require("../models/user.model");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const axios = require("axios");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "There is no account with this email address.",
      });
    }
    // generate a random token , 32 cha hex string
    const resetToken = crypto.randomBytes(20).toString("hex");

    // to more secure token
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    // frontend ka reset link
    const resetUrl = `https://wywa.vercel.app/reset-password/${resetToken}`;

    try {
      await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: { name: "MYWA", email: process.env.SENDER_EMAIL },
          to: [{ email: user.email }],
          subject: "MYWA - Password Reset Link",
          htmlContent: `
            <p>Namaste,</p>
            <p>A password reset request has been received for your account.</p>
            <p>Click the link below to reset your password:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>This link will expire in 15 minutes. If you didn't request this, please ignore this email.</p>
          `,
        },
        {
          headers: {
            "api-key": process.env.BREVO_API_KEY,
            "Content-Type": "application/json",
          },
        },
      );
      res.status(200).json({
        success: true,
        message: `Email has been sent to ${user.email}`,
      });
    } catch (error) {
      console.error("Email send error:", error);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({
        success: false,
        message: "There was an error sending the email",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      });
    }

    // hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Password update successfully " });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
};
