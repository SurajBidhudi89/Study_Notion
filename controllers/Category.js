const Category = require("../models/Category");

// create Category ka handler functions

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    // create entry is DB;

    const CategoryDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log(CategoryDetails);

    return res.status(200).json({
      success: true,
      message: "Category Created Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: true,
      message: "error.message",
    });
  }
};

// getAllCategorys handler function

exports.showAllCategories = async (req, res) => {
  try {
    const allCategorys = await Category.find({}, { name: true, description: true });
    return res.status(200).json({
      success: true,
      message: "All Categorys returned successfully",
      allCategorys,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error.message",
    });
  }
};

exports.categoryPageDetails = async (req, res) => {
  try {
    //get categoryId
    const { categoryId } = req.body;

    // get courses for specified category id
    const selectedCategory = await Category.findById(categoryId)
      .populate("courses")
      .exec();

    // validation
    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Data Not found",
      });
    }
    // get course for different categories
    const differentCategories = await Category.find({
      _id: { $ne: categoryId },
    })
      .populate("courses")
      .exec();
    // get top  sellling courses
    //retrun response
    return res.status(200).json({
      success: true,
      message: "According to categories daata is shown",
      data: {
        selectedCategory,
        differentCategories,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
