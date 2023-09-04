const express = require("express");
const router = (express = express());
const { auth, isIstructor } = require("../middlewares/auth");

const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
  instructorDashboard,
} = require("../controllers/Profile");

// Profile Routes

// deleteUser Account
router.delete("/deleteProfile", auth, deleteAccount);
// update profile
router.put("/updateProfile", auth, updateProfile);
// get all user details form data base;
router.get("/getUserDetails", auth, getAllUserDetails);

// get enrolled courses;
router.get("/getEnrolledCourses", auth, getEnrolledCourses);

// change profile photo
router.push("/updateDisplayPicture", auth, updateDisplayPicture);
// teacher or instructor data base
router.get("/istructorDashboard", auth, isIstructor, instructorDashboard);

module.exports = router;
