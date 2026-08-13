import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUpload, FaTimes } from "react-icons/fa";
import { createCategory, editCategory } from "../Interceptor/interceptor";

const CategoryForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { category, mode } = location.state || {};
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState({
    categoryImage: [],
    categoryTitle: "",
    categoryDescription: "",
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Populate form with category data in edit mode
  useEffect(() => {
    if (isEditMode && category) {
      setFormData({
        categoryImage: [], // Initialize empty; only update if new file is uploaded
        categoryTitle: category.categoryTitle || "",
        categoryDescription: category.categoryDescription || "",
      });
      setUploadedImages(category.categoryImage ? [category.categoryImage] : []);
    }
  }, [isEditMode, category]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setUploadedImages([URL.createObjectURL(files[0])]); // Keep only the first file
      setFormData((prev) => ({
        ...prev,
        categoryImage: [files[0]], // Store only the first file
      }));
    }
  };

  const removeImage = () => {
    setUploadedImages([]);
    setFormData((prev) => ({
      ...prev,
      categoryImage: [],
    }));
  };

  const handleGoBack = () => {
    navigate("/categories");
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.categoryTitle) {
      setError("Category Title is required.");
      return;
    }

    setLoading(true);
    setError("");

    // Prepare FormData
    const data = new FormData();
    data.append("categoryTitle", formData.categoryTitle);
    data.append("categoryDescription", formData.categoryDescription);
    if (formData.categoryImage.length > 0) {
      data.append("categoryImage", formData.categoryImage[0]); // Send single file
    } else if (!isEditMode) {
      setError("Category Image is required.");
      setLoading(false);
      return;
    }

    try {
      if (isEditMode) {
        // Call editCategory for edit mode
        const response = await editCategory(data, category._id);
        console.log("Category updated:", response.data);
      } else {
        // Call createCategory for create mode
        const response = await createCategory(data);
        console.log("Category created:", response.data);
      }
      navigate("/categories"); // Navigate back on success
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "An error occurred while saving the category."
      );
      console.error("Error saving category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <h1 className="text-3xl font-title text-gray-800">
        {isEditMode ? "Edit Category" : "Add Category"}
      </h1>
      <button
        onClick={handleGoBack}
        className="text-black rounded my-3 mr-4 w-full md:w-auto cursor-pointer hover:text-gray-600"
      >
        ← Go back
      </button>

      <div className="col-span-2 space-y-2 bg-white shadow-lg rounded-lg p-6 w-full">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          {isEditMode ? "Replace Category Image" : "Add Category Image"}
        </h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col justify-center items-center relative">
          <FaUpload className="text-orange-500 text-4xl mb-2" />
          <input
            type="file"
            onChange={handleFileUpload}
            className="absolute opacity-0 cursor-pointer inset-0"
            accept="image/*"
          />
          <p className="text-gray-500">
            Drag your image here, or click to browse
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Only one image can be uploaded
          </p>
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="mt-4">
          <h3 className="text-md font-medium mb-2">
            {isEditMode ? "Current Image" : "Uploaded Image"}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {uploadedImages.length > 0 && (
              <div className="relative">
                <img
                  src={uploadedImages[0]}
                  alt="Uploaded image"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <FaTimes size={12} />
                </button>
                {isEditMode && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                    New Replacement
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-title mb-4 text-gray-800">
            Category Information
          </h2>

          <div className="w-full mb-4">
            <label
              htmlFor="categoryTitle"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="categoryTitle"
              type="text"
              name="categoryTitle"
              placeholder="Category Title"
              className="border rounded p-2 w-full text-gray-800"
              onChange={handleInputChange}
              value={formData.categoryTitle}
              disabled={loading}
            />
          </div>

          <div className="w-full mb-4">
            <label
              htmlFor="categoryDescription"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Description
            </label>
            <textarea
              id="categoryDescription"
              name="categoryDescription"
              placeholder="Category Description"
              className="border rounded p-2 w-full text-gray-800"
              onChange={handleInputChange}
              value={formData.categoryDescription}
              rows={4}
              disabled={loading}
            />
          </div>
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
            {loading ? "Processing..." : isEditMode ? "Update Category" : "Create Category"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;