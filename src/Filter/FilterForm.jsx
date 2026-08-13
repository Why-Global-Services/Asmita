import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createFilter, getCategories, editFilter } from "../Interceptor/interceptor";

const FilterForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { filter, mode } = location.state || {};
  const isEditMode = mode === "edit";
  const [formData, setFormData] = useState({
    categoryId: "",
    categoryTitle: "",
    filterName: "",
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
    if (isEditMode && filter) {
      setFormData({
        categoryId: filter.categoryId || "",
        categoryTitle: filter.categoryTitle || "",
        filterName: filter.filterName || "",
      });
    }
  }, [isEditMode, filter]);

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
        [name]: value,
      }));
    }
  };

  const handleGoBack = () => {
    navigate("/filter");
  };

  const handleSubmit = async () => {
    // Create a plain object for the payload
    const payload = {
      categoryId: formData.categoryId,
      categoryTitle: formData.categoryTitle,
      filterName: formData.filterName.trim(),
    };
    console.log("Payload Before Submission:", JSON.stringify(payload, null, 2)); // Debug log

    // Validation
    if (!payload.categoryId) {
      setError("Parent Category is required.");
      return;
    }
    if (!payload.filterName || payload.filterName === "") {
      setError("Filter Name is required and cannot be empty.");
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
        response = await editFilter(filter._id, payload);
      } else {
        response = await createFilter(payload);
      }
      console.log(isEditMode ? "Filter updated:" : "Filter created:", response.data);
      navigate("/filter");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while saving the filter.";
      setError(errorMessage);
      console.error("Error saving filter:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <h1 className="text-3xl font-title text-gray-800">
        {isEditMode ? "Edit Filter" : "Add Filter"}
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
              htmlFor="filterName"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Filter Name <span className="text-red-500">*</span>
            </label>
            <input
              id="filterName"
              type="text"
              name="filterName"
              placeholder="Filter Name"
              className="border rounded p-2 w-full text-gray-800"
              onChange={handleInputChange}
              value={formData.filterName}
              disabled={loading}
            />
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
            {loading ? "Processing..." : isEditMode ? "Update Filter" : "Create Filter"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterForm;