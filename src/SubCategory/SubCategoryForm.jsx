import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaTimes, FaUpload } from "react-icons/fa";
import { toast } from "sonner";
import { createSubCategory, getCategories, editSubCategory } from "../Interceptor/interceptor";

const SubcategoryForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subcategory, mode } = location.state || {};
  const isEditMode = mode === "edit";

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    categoryId: "",
    categoryTitle: "",
    subCategoryTitle: "",
    status: true,
    subCategoryImage: null,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  const ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];
  const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsCategoriesLoading(true);
        const response = await getCategories();
        const categoriesData = Array.isArray(response.data.data) ? response.data.data : [];
        setCategories(categoriesData);
      } catch (err) {
        setError("Failed to load categories. Please try again.");
        console.error("Error fetching categories:", err);
        setCategories([]);
      } finally {
        setIsCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEditMode && subcategory) {
      const existingImage = Array.isArray(subcategory.subCategoryImage)
        ? subcategory.subCategoryImage[0]
        : subcategory.subCategoryImage || "";

      setFormData({
        categoryId: subcategory.categoryId || "",
        categoryTitle: subcategory.categoryTitle || "",
        subCategoryTitle: subcategory.subCategoryTitle || "",
        status: subcategory.status !== undefined ? subcategory.status : true,
        subCategoryImage: null,
      });
      setImagePreview(existingImage);
    }
  }, [isEditMode, subcategory]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "categoryId") {
      const selectedCategory = categories.find((cat) => cat._id === value);
      setFormData((prev) => ({
        ...prev,
        categoryId: value,
        categoryTitle: selectedCategory ? selectedCategory.categoryTitle : "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "status" ? value === "true" : value,
      }));
    }
  };

  const handleGoBack = () => {
    navigate("/subcategory");
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const extension = file.name.split(".").pop()?.toLowerCase();
    const isValidMime = ALLOWED_MIME_TYPES.includes(file.type);
    const isValidExt = ALLOWED_EXTENSIONS.includes(extension);

    if (!isValidMime && !isValidExt) {
      const msg = "Invalid file type. Only JPG, JPEG, PNG, and WEBP files are allowed.";
      setError(msg);
      toast.error(msg);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      const msg = "File size exceeds 5MB limit. Please choose a smaller image.";
      setError(msg);
      toast.error(msg);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setError("");
    setFormData((prev) => ({ ...prev, subCategoryImage: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (formData.subCategoryImage) {
      setFormData((prev) => ({ ...prev, subCategoryImage: null }));
      const existingImage = Array.isArray(subcategory?.subCategoryImage)
        ? subcategory.subCategoryImage[0]
        : subcategory?.subCategoryImage || "";
      setImagePreview(isEditMode ? existingImage : "");
    } else {
      setImagePreview("");
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.categoryId) {
      setError("Parent Category is required.");
      return;
    }
    if (!formData.subCategoryTitle.trim()) {
      setError("Subcategory Title is required and cannot be empty.");
      return;
    }
    let catTitle = formData.categoryTitle;
    if (!catTitle) {
      const selected = categories.find((cat) => cat._id === formData.categoryId);
      catTitle = selected ? selected.categoryTitle : "";
    }
    if (!catTitle) {
      setError("Category Title could not be determined. Please reselect the category.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = new FormData();
      payload.append("categoryId", formData.categoryId);
      payload.append("categoryTitle", catTitle);
      payload.append("subCategoryTitle", formData.subCategoryTitle.trim());
      payload.append("status", String(formData.status));
      if (formData.subCategoryImage) {
        payload.append("subCategoryImage", formData.subCategoryImage);
      }

      let response;
      if (isEditMode) {
        response = await editSubCategory(subcategory._id, payload);
      } else {
        response = await createSubCategory(payload);
      }

      console.log(isEditMode ? "Subcategory updated:" : "Subcategory created:", response.data);
      toast.success(
        isEditMode
          ? "Subcategory updated successfully!"
          : "Subcategory created successfully!"
      );
      navigate("/subcategory");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "An error occurred while saving the subcategory.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error saving subcategory:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <h1 className="text-3xl font-title text-gray-800">
        {isEditMode ? "Edit Subcategory" : "Add Subcategory"}
      </h1>
      <button
        onClick={handleGoBack}
        className="text-black rounded my-3 mr-4 w-full md:w-auto cursor-pointer hover:text-gray-600"
      >
        ← Go back
      </button>

      <div className="col-span-2 space-y-2 bg-white shadow-lg rounded-lg p-6 w-full">
        <div className="mt-4">
          {/* Parent Category */}
          <div className="w-full mb-4">
            <label
              htmlFor="categoryId"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Parent Category <span className="text-red-500">*</span>
            </label>
            <select
              id="categoryId"
              name="categoryId"
              className="border rounded p-2 w-full text-gray-800"
              onChange={handleInputChange}
              value={formData.categoryId}
              disabled={loading || isCategoriesLoading}
            >
              <option value="">Select a category</option>
              {isCategoriesLoading ? (
                <option value="" disabled>
                  Loading categories...
                </option>
              ) : Array.isArray(categories) && categories.length > 0 ? (
                categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.categoryTitle}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No categories available
                </option>
              )}
            </select>
          </div>

          {/* Subcategory Title */}
          <div className="w-full mb-4">
            <label
              htmlFor="subCategoryTitle"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Subcategory Title <span className="text-red-500">*</span>
            </label>
            <input
              id="subCategoryTitle"
              type="text"
              name="subCategoryTitle"
              placeholder="Subcategory Title"
              className="border rounded p-2 w-full text-gray-800"
              onChange={handleInputChange}
              value={formData.subCategoryTitle}
              disabled={loading}
            />
          </div>

          {/* Subcategory Image */}
          <div className="w-full mb-4">
            <label
              htmlFor="subCategoryImage"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Subcategory Image
            </label>

            {/* Image upload box */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col justify-center items-center relative hover:border-orange-400 transition-colors bg-gray-50/50 cursor-pointer">
              <FaUpload className="text-orange-500 text-3xl mb-2" />
              <input
                ref={fileInputRef}
                id="subCategoryImage"
                type="file"
                onChange={handleImageChange}
                className="absolute opacity-0 cursor-pointer inset-0 w-full h-full"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                disabled={loading}
              />
              <p className="text-gray-800 font-semibold text-sm">
                Upload Image
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Drag your image here, or click to browse
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Supports JPG, JPEG, PNG, WEBP (Max 5MB)
              </p>
            </div>

            {/* Image Preview */}
            {imagePreview && imagePreview.trim() !== "" && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {formData.subCategoryImage
                    ? (isEditMode ? "New Replacement Image" : "Image Preview")
                    : "Current Image"}
                </p>
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Subcategory preview"
                    className="w-24 h-24 aspect-square object-contain rounded-lg border border-gray-200 p-1.5 bg-gray-50 shadow-sm"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/200x200?text=No+Image";
                    }}
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow transition-colors cursor-pointer"
                    title={formData.subCategoryImage && isEditMode ? "Cancel replacement" : "Remove image"}
                    aria-label="Remove image"
                  >
                    <FaTimes size={11} />
                  </button>
                  {isEditMode && formData.subCategoryImage && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] py-0.5 text-center rounded-b-lg font-medium">
                      Replacement
                    </div>
                  )}
                </div>
                {isEditMode && !formData.subCategoryImage && (
                  <p className="text-xs text-gray-500 mt-1">
                    Existing image displayed. Choose a new file to replace it.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Status */}
          <div className="w-full mb-4">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              className="border rounded p-2 w-full text-gray-800"
              onChange={handleInputChange}
              value={formData.status}
              disabled={loading}
            >
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
          </div>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleGoBack}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded transition cursor-pointer"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-table hover:bg-secondary text-white px-6 py-2 rounded transition cursor-pointer"
            disabled={loading}
          >
            {loading ? "Processing..." : isEditMode ? "Update Subcategory" : "Create Subcategory"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubcategoryForm;
