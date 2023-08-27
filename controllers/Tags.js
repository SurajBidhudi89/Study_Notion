const Tag = require("../models/Tags");

// create tag ka handler functions

exports.createTag = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    // create entry is DB;

    const tagDetails = await Tag.create({
      name: name,
      description: description,
    });
    console.log(tagDetails);

    return res.status(200).json({
      success: true,
      message: "Tag Created Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: true,
      message: "error.message",
    });
  }
};

// getAllTags handler function

exports.showAlltags = async (req, res) => {
  try {
    const allTags = await Tag.find({}, { name: true, description: true });
    return res.status(200).json({
      success: true,
      message: "All tags returned successfully",
      allTags,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error.message",
    });
  }
};
