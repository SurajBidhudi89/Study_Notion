const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

// resetPasswordToken

exports.resetPasswordToken = async (req, res) => {
  try {
    //get email from req body
    const email = req.body.email;

    // check user for this email , email validation
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(201).json({
        success: false,
        message: "Your Email is not registered with us",
      });
    }

    // generate token
    const token = crypto.randomUUID();
    // update user by adding token and expiration time
    const updateDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      }
    );
    // create Url
    const url = `https://localhost:3000/update-password/${token}`;
    // send mail containing the url
    await mailSender(
      email,
      "Password Reset Link",
      `Password Reset Link :${url}`
    );
    // return response

    return res.json({
      success: true,
      message: "Email sent successfully , Please check email and change pwd ",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending reset Pwd mail",
    });
  }
};

// resetPassword

exports.resetPassword = async (req, res) => {
  try {
    //fetch data;
    const { password, confirmPassword, token } = req.body;
    // validation
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "password not matching ",
      });
    }

    // get userdetails from db using token
    const userDetatils = await User.findOne({ token: token });

    // no entry -invalid token
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token is invalid",
      });
    }
    // token time check
    if (userDetatils.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message: "token time is expires ,Please regenerate your token  ",
      });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // update password
    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );
    // return response
    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "Something went wrong while changing the password",
    });
  }
};
