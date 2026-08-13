const { subCategory } = require("../../models/subcategory.model");
const ApiError = require("../../utils/apiError");

const createSubCategory = async (req) => {
  console.log("Received req.body:", req.body); // Debug log

  const { subCategoryTitle, categoryId, categoryTitle, status } = req.body;

  // Check user role
  if (req.user?.role !== "superAdmin" && req.user?.role !== "admin") {
    throw new ApiError(403, "Unauthorized");
  }

  // Validate required fields
  if (!subCategoryTitle) {
    throw new ApiError(400, "Subcategory title is required");
  }
  if (!categoryId) {
    throw new ApiError(400, "Category ID is required");
  }
  if (!categoryTitle) {
    throw new ApiError(400, "Category title is required");
  }

  // Check if subcategory already exists (case-insensitive)
  const existing = await subCategory.findOne({
    subCategoryTitle: { $regex: new RegExp("^" + subCategoryTitle + "$", "i") },
  });

  if (existing) {
    throw new ApiError(400, "Subcategory already exists");
  }

  // Create subcategory
  const createdSubCategory = await subCategory.create({
    categoryId,
    categoryTitle,
    subCategoryTitle,
    status: status !== undefined ? status : true,
  });

  return {
    status: true,
    message: "Subcategory created successfully",
    data: createdSubCategory,
  };
};
const getSubCategory = async (req) => {
  if (req.user.role !== "superAdmin" && req.user.role !== "admin") {
    throw new ApiError(403, "Unauthorized");
  }

  const fetchedSubCategory = await subCategory.find();

  if (fetchedSubCategory.length === 0) {
    throw new ApiError(404, "No sub Category found");
  }

  return {
    success: true,
    message: "Fetched sub category successfully",
    data: fetchedSubCategory,
  };
};

const updateSubCategory = async (req) => {
  const { body } = req;
  const id = req.params.id;

  if (req.user.role !== "superAdmin" && req.user.role !== "admin") {
    throw new ApiError(403, "Unauthorized");
  }

  const subCategoryTitle = req.body?.subCategoryTitle;

  if (!subCategoryTitle) {
    // Check if already exists (case-insensitive)
    const existing = await subCategory.findOne({
      subCategoryTitle: {
        $regex: new RegExp("^" + subCategoryTitle + "$", "i"),
      },
    });

    if (existing) {
      throw new ApiError(400, "Sub Category already exists (duplicate)");
    }
  }

  const updatedSubCategory = await subCategory.findByIdAndUpdate(id, {
    ...body,
  });

  return {
    success: true,
    message: "Sub Category updated successfully",
    data: updatedSubCategory,
  };
};

const deleteSubCategory = async (req) => {
  const id = req.params.id;

  if (req.user.role !== "superAdmin" && req.user.role !== "admin") {
    throw new ApiError(403, "Unauthorized");
  }

  if (!id) {
    throw new ApiError(400, "No subCategory id provided");
  }

  const deletedSubCategory = await subCategory.findByIdAndDelete({ _id: id });

  if (!deletedSubCategory) {
    throw new ApiError(404, "No subCategory found to delete");
  }

  return {
    success: true,
    message: "SubCategory deleted Successfully",
    data: deletedSubCategory,
  };
};

const getActiveSubCategory = async (req) => {
  const activeSubCategory = await subCategory.aggregate([
    {
      $match: { status: true },
    },
  ]);

  return {
    success: true,
    message: "Active sub category fetched successfully",
    data: activeSubCategory,
  };
};

module.exports = {
  createSubCategory,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getActiveSubCategory,
};
