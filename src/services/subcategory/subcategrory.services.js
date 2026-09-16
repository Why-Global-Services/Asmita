const { subCategory } = require("../../models/subcategory.model");
const ApiError = require("../../utils/apiError");
const { uploadToCloud } = require("../../utils/uploadFileToS3");

const isAdminRole = (role) => {
  const r = (role || "").toLowerCase();
  return r === "superadmin" || r === "admin";
};

// Escape special regex characters so user input is treated as a literal string
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const createSubCategory = async (req) => {
  const subCategoryTitle = req.body?.subCategoryTitle?.trim();
  const { categoryId, categoryTitle, status } = req.body;

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
    subCategoryTitle: { $regex: new RegExp("^" + escapeRegex(subCategoryTitle) + "$", "i") },
  });

  if (existing) {
    throw new ApiError(400, "Subcategory already exists");
  }

  // Create subcategory
  const subCategoryImage = req.file
    ? await uploadToCloud(req.file, "subcategories")
    : "";

  let statusValue = true;
  if (status !== undefined && status !== null && status !== "") {
    statusValue = status === true || status === "true";
  }

  const createdSubCategory = await subCategory.create({
    categoryId,
    categoryTitle,
    subCategoryTitle,
    subCategoryImage,
    status: statusValue,
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
  const id = req.params.id;

  if (!isAdminRole(req.user?.role)) {
    throw new ApiError(403, "Unauthorized");
  }

  // Find the existing document first
  const existingSubCategory = await subCategory.findById(id);
  if (!existingSubCategory) {
    throw new ApiError(404, "Subcategory not found");
  }

  // Extract and sanitize fields from request body
  const subCategoryTitle = req.body?.subCategoryTitle?.trim();
  const categoryId      = req.body?.categoryId      || existingSubCategory.categoryId;
  const categoryTitle   = req.body?.categoryTitle   || existingSubCategory.categoryTitle;

  // Parse status: FormData always sends strings ("true"/"false"), convert to Boolean
  let statusValue = existingSubCategory.status; // default: keep existing
  if (req.body?.status !== undefined && req.body?.status !== null && req.body?.status !== "") {
    statusValue = req.body.status === true || req.body.status === "true";
  }

  // Duplicate-title check: case-insensitive, but ONLY look at OTHER documents.
  // We compare the stored title of the found duplicate against the current document's
  // _id to guard against false positives caused by case-only changes on the SAME document.
  if (subCategoryTitle) {
    const existing = await subCategory.findOne({
      _id: { $ne: id },
      subCategoryTitle: {
        $regex: new RegExp("^" + escapeRegex(subCategoryTitle) + "$", "i"),
      },
    });

    // If a duplicate was found and it is truly a DIFFERENT document, reject the update
    if (existing && String(existing._id) !== String(id)) {
      throw new ApiError(400, "Sub Category already exists (duplicate)");
    }
  }

  // Build the update payload explicitly (do NOT spread raw req.body to avoid stale/unexpected fields)
  const updatePayload = {
    categoryId,
    categoryTitle,
    subCategoryTitle: subCategoryTitle || existingSubCategory.subCategoryTitle,
    status: statusValue,
  };

  // Handle image upload only when a new file is provided
  if (req.file) {
    updatePayload.subCategoryImage = await uploadToCloud(req.file, "subcategories");
  }

  // Use explicit $set so MongoDB applies only the changed fields
  const updatedSubCategory = await subCategory.findByIdAndUpdate(
    id,
    { $set: updatePayload },
    { new: true }   // runValidators removed: status was already parsed to Boolean above
  );

  if (!updatedSubCategory) {
    throw new ApiError(404, "Subcategory not found or could not be updated");
  }

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
