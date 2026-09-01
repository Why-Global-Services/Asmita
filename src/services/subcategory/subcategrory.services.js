const { subCategory } = require("../../models/subcategory.model");
const ApiError = require("../../utils/apiError");
const { uploadToCloud } = require("../../utils/uploadFileToS3");

const isAdminRole = (role) => {
  const r = (role || "").toLowerCase();
  return r === "superadmin" || r === "admin";
};

const createSubCategory = async (req) => {
  const { subCategoryTitle, categoryId, categoryTitle, status } = req.body;

  // Check user role
  if (!isAdminRole(req.user?.role)) {
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
  const subCategoryImage = req.file
    ? await uploadToCloud(req.file, "subcategories")
    : "";

  const createdSubCategory = await subCategory.create({
    categoryId,
    categoryTitle,
    subCategoryTitle,
    subCategoryImage,
    status: status !== undefined ? status : true,
  });

  return {
    status: true,
    message: "Subcategory created successfully",
    data: createdSubCategory,
  };
};
const getSubCategory = async (req) => {
  if (!isAdminRole(req.user?.role)) {
    throw new ApiError(403, "Unauthorized");
  }

  const fetchedSubCategory = await subCategory.find();

  return {
    success: true,
    message: "Fetched sub category successfully",
    data: fetchedSubCategory || [],
  };
};

const updateSubCategory = async (req) => {
  const { body } = req;
  const id = req.params.id;

  if (!isAdminRole(req.user?.role)) {
    throw new ApiError(403, "Unauthorized");
  }

  const subCategoryTitle = req.body?.subCategoryTitle?.trim();
  const existingSubCategory = await subCategory.findById(id);

  if (!existingSubCategory) {
    throw new ApiError(404, "Subcategory not found");
  }

  if (subCategoryTitle) {
    const existing = await subCategory.findOne({
      _id: { $ne: id },
      subCategoryTitle: {
        $regex: new RegExp("^" + subCategoryTitle + "$", "i"),
      },
    });

    if (existing) {
      throw new ApiError(400, "Sub Category already exists (duplicate)");
    }
  }

  const updateData = { ...body };
  if (req.file) {
    updateData.subCategoryImage = await uploadToCloud(req.file, "subcategories");
  }

  const updatedSubCategory = await subCategory.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  return {
    success: true,
    message: "Sub Category updated successfully",
    data: updatedSubCategory,
  };
};

const deleteSubCategory = async (req) => {
  const id = req.params.id;

  if (!isAdminRole(req.user?.role)) {
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
