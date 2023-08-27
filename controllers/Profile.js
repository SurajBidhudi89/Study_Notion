const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  try {
    // get data
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;

    // get userId
    const id = req.user.id;
    //validation
    if (!contactNumber || !gender || !id) {
      return res.status(400).json({
        success: false,
        message: "Missing Properties ",
      });
    }
    //find Profile
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionDetails;
    const profileDetails = await Profile.findById(profileId);

    //update Profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;
    await profileDetails.save();

    //return response
    return res.status(200).json({
      success: true,
      message: "Profile updated Successfully",
      profileDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to update Profile , Please try again ",
      error: error.message,
    });
  }
};

// delete Profile
exports.deleteAccount = async (req, res) => {
  try {
    //get id
    const id = req.user.id;

    //validation
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //delete profile
    await Profile.findByIdAndDelete({ _id: userDetails.additionDetails });

    //delete user
    await User.findByIdAndDelete({ _id: id });
    // return response
    return res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to update Profile , Please try again ",
      error: error.message,
    });
  }
};

// get all detail of user
exports.getAllUserDetails = async (req, res) => {
  try {
    //get id
    const id = req.user.id;

    // validationn and get user details
    const userDetails = await User.findById(id)
      .populate("additionDetails")
      .exec();

    // return response
    return res.status(200).json({
      success: true,
      message: "User Data Fetched Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to get all details, Please try again ",
      error: error.message,
    });
  }
};
