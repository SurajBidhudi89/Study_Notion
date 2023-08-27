const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
  try {
    // data fetch
    const { sectionName, courseId } = req.body;

    // data validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing Properties ",
      });
    }
    // create Section
    const newSection = await Section.create({ sectionName });

    // update course with section ObjectId;
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    );
    // TODO : use populate to replace sections /subsections both in the updatedCourseDetails

    // return response
    return res.status(200).json({
      success: true,
      message: "Section created Successfully",
      updatedCourseDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to create Section , Please try again ",
      error: error.message,
    });
  }
};

exports.updateSection = async (req, res) => {
  try {
    // fetch data;
    const { sectionName, sectionId } = req.body;
    //data validation
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing Properties ",
      });
    }

    // update data
    const section = await Section.findByIdAndUpdate(
      sectinId,
      { sectionName },
      { new: true }
    );

    // return res;
    return res.status(200).json({
      success: true,
      message: "Section updated Successfully",
      section,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to Update Section , Please try again ",
      error: error.message,
    });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    // getId -- assuming that we are sending Id in params
    const { sectionId } = req.params;

    // use findbyId
    await Section.findByIdAndDelete(sectionId);
    //TOdo  do we need to delete the entry from the course schema

    //return response
    return res.status(200).json({
      success: true,
      message: "Section Deleted Successfully",
    });
  } catch (error) {

  }
};
