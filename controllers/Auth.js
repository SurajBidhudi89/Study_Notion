const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.sendOTP = async (req, res) => {
  try {
    //fetch email from request ki body;
    const { email } = req.body;

    // checck if user already exists;
    const checkUserPresent = await User.findOne({ email });

    // if user already exits then return  a response;
    if (checkUserPresent) {
      return res.status(401).json({
        success: true,
        mesasge: "user already registered",
      });
    }

    // generate otp;
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log("OTP generated :", otp);

    // check unique otp or not
    const result = await OTP.findOne({ opt: otp });
    while (result) {
      otp = otpGenerator(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };
    // create an entry for OTP
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    try {
      res.status(200).json({
        success: true,
        mesasge: "otp Sent Successfully ",
        otp,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).josn({
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.signUp = async (req, res) => {
  try {
    // data fetch fro request ki body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    // validate krlo
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: true,
        mesasge: "All fields are requried",
      });
    }

    // when confirmPassword or Passwor is not matched
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        mesasge:
          "Password and confirmPassword value doest not match , Please try again ",
      });
    }

    //check user already exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registerd",
      });
    }

    // find most recent OTP stored for the user;

    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentOtp);
    if (recentOtp.length == 0) {
      return res.status(400).json({
        success: false,
        message: "otp  not found",
      });
    } else if (otp != recentOtp.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });
    return res.status(200).json({
      success: true,
      message: "User is registerd Successfully",
      user,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "User cannot be registered . Please try again ",
    });
  }
};


// LOGIN

exports.login = async (req, res) => {
  try {
    // get data from req body
    const { email, password } = req.body;
    // validate data;
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All field are required , Please try again",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered , Please signup first",
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user.token = token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 1000),
        httpOnly: true,
      };

      res.cookied("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Login Failure , Please try again ",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login Failure ,Please try again ",
    });
  }
};

exports.changePassword = async (req, res) => {
  // get datat frm req body;
  const { password, newPassword, confirmPassword } = req.body;

  // get old password ,new paassword , conirm password
  // validation
  if (!password || !newPassword || !confirmPassword) {
    return res.status(403).json({
      success: true,
      mesasge: "All fields are requried",
    });
  }
  

  // update pwd in db
  // send mail, password updated,
};
