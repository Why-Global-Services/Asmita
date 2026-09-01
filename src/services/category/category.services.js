const { category } = require("../../models/category.model");
const ApiError = require("../../utils/apiError");
const { uploadToCloud } = require("../../utils/uploadFileToS3");

const isAdminRole = (role) => {
  const r = (role || "").toLowerCase();
  return r === "superadmin" || r === "admin";
};

const createCategory = async (req) => {
  const { body } = req;
  const categoryTitle = req.body.categoryTitle;

  if (!isAdminRole(req.user?.role)) {
    throw new ApiError(403, "Unauthorized");
  }

  if (!categoryTitle) {
    throw new ApiError(400, "No categoryTitle provided");
  }

  // Check if already exists (case-insensitive)
  const existing = await category.findOne({
    categoryTitle: { $regex: new RegExp("^" + categoryTitle + "$", "i") },
  });

  if (existing) {
    throw new ApiError(400, "Category already exists (duplicate)");
  }

  if (!req.file) {
    throw new ApiError(400, "No CategroyImage provided");
  }

  const imageURL = await uploadToCloud(req.file, "category");

  const createdCategory = await category.create({
    ...body,
    categoryImage: imageURL,
  });

  return {
    success: true,
    message: "Category created successfully",
    data: createdCategory,
  };
};

const getCategory = async (req) => {
  if (!isAdminRole(req.user?.role)) {
    throw new ApiError(403, "Unauthorized");
  }

  const getCategory = await category.find();

  return {
    success: true,
    message: "Category fetched successfully",
    data: getCategory || [],
  };
};

const updateCategory = async (req) => {
  const { body } = req;
  const id = req.params.id;

  if (!isAdminRole(req.user?.role)) {
    throw new ApiError(403, "Unauthorized");
  }

  const categoryTitle = req.body.categoryTitle;
  let imageURL = "";

  if (!categoryTitle) {
    // Check if already exists (case-insensitive)
    const existing = await category.findOne({
      categoryTitle: { $regex: new RegExp("^" + categoryTitle + "$", "i") },
    });

    if (existing) {
      throw new ApiError(400, "Category already exists (duplicate)");
    }
  }

  if (req.file) {
    imageURL = await uploadToCloud(req.file, "editCategory");
    body.categoryImage = imageURL;
  }

  const updatedCategory = await category.findByIdAndUpdate(id, { ...body },{new: true});

  return {
    success: true,
    message: "Category updated successfully",
    data: updatedCategory,
  };
};

const deleteCategory = async (req) => {
  const id = req.params.id;

  if (!isAdminRole(req.user?.role)) {
    throw new ApiError(403, "Unauthorized");
  }

  if (!id) {
    throw new ApiError(400, "No category id provided");
  }

  const deletedCategory = await category.findByIdAndDelete({ _id: id });

  if (!deletedCategory) {
    throw new ApiError(404, "No category found to delete");
  }

  return {
    success: true,
    message: "Category deleted Successfully",
    data: deletedCategory,
  };
};

const getActiveCategory = async (req) => {
  const activeCategory = await category.aggregate([
    {
      $match: { status: true },
    },
  ]);

  return {
    success: true,
    message: "Active categoy fetched successfully",
    data: activeCategory,
  };
};

module.exports = {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  getActiveCategory,
};
