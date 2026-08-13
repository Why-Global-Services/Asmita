import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createSubCategory, getCategories, editSubCategory } from "../Interceptor/interceptor";

const SubcategoryForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subcategory, mode } = location.state || {};
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState({
    categoryId: "", // Changed to camelCase to match payload
    categoryTitle: "",
    subCategoryTitle: "",
    status: true,
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

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
      setFormData({
        categoryId: subcategory.categoryId || "", // Match backend field name
        categoryTitle: subcategory.categoryTitle || "",
        subCategoryTitle: subcategory.subCategoryTitle || "",
        status: subcategory.status !== undefined ? subcategory.status : true,
      });
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

  const handleSubmit = async () => {
    // Create a plain object for the payload
    const payload = {
      categoryId: formData.categoryId,
      categoryTitle: formData.categoryTitle,
      subCategoryTitle: formData.subCategoryTitle.trim(),
      status: formData.status,
    };

    console.log("Payload Before Submission:", JSON.stringify(payload, null, 2)); // Debug log

    // Validation
    if (!payload.categoryId) {
      setError("Parent Category is required.");
      return;
    }
    if (!payload.subCategoryTitle || payload.subCategoryTitle === "") {
      setError("Subcategory Title is required and cannot be empty.");
      return;
    }
    if (!payload.categoryTitle) {
      setError("Category Title could not be determined.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let response;
      if (isEditMode) {
        response = await editSubCategory(subcategory._id, payload);
      } else {
        response = await createSubCategory(payload);
      }
      console.log(isEditMode ? "Subcategory updated:" : "Subcategory created:", response.data);
      navigate("/subcategory");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while saving the subcategory.";
      setError(errorMessage);
      console.error("Error saving subcategory:", error.response?.data || error.message);
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
        <div className="mt-6">
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

          {error && <div className="text-red-500 mb-4">{error}</div>}
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