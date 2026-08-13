import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUpload, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { createProduct, getCategories, updateProduct, getSubCategories , getFilter } from "../Interceptor/interceptor";

const ProductForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subCategory, mode } = location.state || {};
  const isEditMode = mode === "edit";
  const MAX_IMAGES = 4; // Maximum number of images allowed

  const [formData, setFormData] = useState({
    productImages: [],
    categoryId: "",
    categoryName: "",
    subCategoryId: "",
    subCategoryName: "",
    filterId: "",
    filterName: "",
    productTitle: "",
    productDescription: "",
    additionalInformation: "",
    ingredients: [],
    status: true,
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [filters, setFilters] = useState([]);
  const [subLoading, setSubLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      console.log("getCategories response:", response.data);
      const categoryData = Array.isArray(response.data.data)
        ? response.data.data
        : Array.isArray(response.data)
        ? response.data
        : [];
      setCategories(categoryData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories. Please try again later.");
      setCategories([]);
    }
  };

  // Fetch subcategories based on selected categoryId
  const fetchSubCategories = async (categoryId) => {
    if (!categoryId) {
      setSubCategories([]);
      setFormData((prev) => ({
        ...prev,
        subCategoryId: "",
        subCategoryName: "",
      }));
      return;
    }

    setSubLoading(true);
    try {
      const response = await getSubCategories(categoryId);
      console.log("getSubCategories response for categoryId", categoryId, ":", response.data);
      const subcategoryData = Array.isArray(response.data.data)
        ? response.data.data
        : Array.isArray(response.data)
        ? response.data
        : [];
      const filteredSubcategories = subcategoryData.filter(
        (subcategory) => subcategory.categoryId === categoryId
      );
      setSubCategories(filteredSubcategories);
      console.log("Filtered subcategories:", filteredSubcategories);
      if (isEditMode && formData.subCategoryId) {
        const matchingSubCategory = filteredSubcategories.find(
          (sub) => sub._id === formData.subCategoryId
        );
        if (!matchingSubCategory) {
          console.warn(
            `Subcategory with ID ${formData.subCategoryId} not found in fetched subcategories.`
          );
          toast.warn("Selected subcategory is not available. Please choose a valid subcategory.");
          setFormData((prev) => ({
            ...prev,
            subCategoryId: "",
            subCategoryName: "",
          }));
        } else if (
          matchingSubCategory.subCategoryTitle !== formData.subCategoryName.trim()
        ) {
          console.log(
            `Updating subCategoryName from "${formData.subCategoryName}" to "${matchingSubCategory.subCategoryTitle}"`
          );
          setFormData((prev) => ({
            ...prev,
            subCategoryName: matchingSubCategory.subCategoryTitle,
          }));
        }
      } else if (
        !isEditMode &&
        formData.subCategoryId &&
        !filteredSubcategories.some((sub) => sub._id === formData.subCategoryId)
      ) {
        setFormData((prev) => ({
          ...prev,
          subCategoryId: "",
          subCategoryName: "",
        }));
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast.error("Failed to fetch subcategories. Please try again later.");
      setSubCategories([]);
      if (!isEditMode) {
        setFormData((prev) => ({
          ...prev,
          subCategoryId: "",
          subCategoryName: "",
        }));
      }
    } finally {
      setSubLoading(false);
    }
  };

  // Fetch filters based on selected categoryId
  const fetchFilters = async (categoryId) => {
    if (!categoryId) {
      setFilters([]);
      setFormData((prev) => ({
        ...prev,
        filterId: "",
        filterName: "",
      }));
      return;
    }

    setFilterLoading(true);
    try {
      const response = await getFilter(categoryId);
      console.log("getFilter response for categoryId", categoryId, ":", response.data);
      const filterData = Array.isArray(response.data.data)
        ? response.data.data
        : Array.isArray(response.data)
        ? response.data
        : [];
      const filteredFilters = filterData.filter(
        (filter) => filter.categoryId === categoryId
      );
      setFilters(filteredFilters);
      console.log("Filtered filters:", filteredFilters);
      if (isEditMode && formData.filterId) {
        const matchingFilter = filteredFilters.find(
          (f) => f._id === formData.filterId
        );
        if (!matchingFilter) {
          console.warn(
            `Filter with ID ${formData.filterId} not found in fetched filters.`
          );
          toast.warn("Selected filter is not available. Please choose a valid filter.");
          setFormData((prev) => ({
            ...prev,
            filterId: "",
            filterName: "",
          }));
        } else if (
          matchingFilter.filterName !== formData.filterName.trim()
        ) {
          console.log(
            `Updating filterName from "${formData.filterName}" to "${matchingFilter.filterName}"`
          );
          setFormData((prev) => ({
            ...prev,
            filterName: matchingFilter.filterName,
          }));
        }
      } else if (
        !isEditMode &&
        formData.filterId &&
        !filteredFilters.some((f) => f._id === formData.filterId)
      ) {
        setFormData((prev) => ({
          ...prev,
          filterId: "",
          filterName: "",
        }));
      }
    } catch (error) {
      console.error("Error fetching filters:", error);
      toast.error("Failed to fetch filters. Please try again later.");
      setFilters([]);
      if (!isEditMode) {
        setFormData((prev) => ({
          ...prev,
          filterId: "",
          filterName: "",
        }));
      }
    } finally {
      setFilterLoading(false);
    }
  };

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch subcategories and filters when categoryId changes
  useEffect(() => {
    if (formData.categoryId) {
      fetchSubCategories(formData.categoryId);
      fetchFilters(formData.categoryId);
    }
  }, [formData.categoryId]);

  // Populate form in edit mode
  useEffect(() => {
    if (isEditMode && subCategory) {
      console.log("subCategory in edit mode:", subCategory);
      const newFormData = {
        productImages: subCategory.productImages || [],
        categoryId: subCategory.categoryId || "",
        categoryName: subCategory.categoryName || "",
        subCategoryId: subCategory.subCategoryId || "",
        subCategoryName: subCategory.subCategoryName
          ? subCategory.subCategoryName.trim()
          : "",
        filterId: subCategory.filterId || "",
        filterName: subCategory.filterName || "",
        productTitle: subCategory.productTitle || "",
        productDescription: subCategory.productDescription || "",
        additionalInformation: subCategory.additionalInformation || "",
        ingredients: subCategory.ingredients,
        status: subCategory.status !== undefined ? subCategory.status : true,
      };
      setIngredients(subCategory.ingredients)
      setFormData(newFormData);
      console.log("formData after set in edit mode:", newFormData);
      setUploadedImages(subCategory.productImages || []);
      if (subCategory.categoryId) {
        fetchSubCategories(subCategory.categoryId);
        fetchFilters(subCategory.categoryId);
      }
    }
  }, [isEditMode, subCategory]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "categoryName") {
      const selectedCategory = categories.find(
        (category) => category.categoryTitle === value
      );
      setFormData((prev) => ({
        ...prev,
        categoryName: value,
        categoryId: selectedCategory ? selectedCategory._id : "",
        subCategoryId: "",
        subCategoryName: "",
        filterId: "",
        filterName: "",
      }));
    } else if (name === "subCategoryName") {
      const selectedSubCategory = subcategories.find(
        (subcategory) => subcategory.subCategoryTitle.toLowerCase() === value.toLowerCase()
      );
      setFormData((prev) => ({
        ...prev,
        subCategoryName: value,
        subCategoryId: selectedSubCategory ? selectedSubCategory._id : "",
      }));
    } else if (name === "filterName") {
      const selectedFilter = filters.find(
        (filter) => filter.filterName.toLowerCase() === value.toLowerCase()
      );
      setFormData((prev) => ({
        ...prev,
        filterName: value,
        filterId: selectedFilter ? selectedFilter._id : "",
      }));
    } else if (name === "status") {
      setFormData((prev) => ({ ...prev, status: value === "true" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

   const handleInputChangeIngrediants = (e) => {
    setInputValue(e.target.value);
  };

    const handleAddIngredient = () => {
    const ingredient = inputValue.trim();
    if (ingredient && !ingredients.includes(ingredient)) {
      setIngredients([...ingredients, ingredient]);
      setInputValue('');
    }
  };
  console.log(ingredients,"thses are the array");
  

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

    const handleClearAll = () => {
    setIngredients([]);
    setInputValue('');
  };



  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const currentImageCount = formData.productImages.length;
    const newImageCount = files.length;

    if (currentImageCount + newImageCount > MAX_IMAGES) {
      toast.error(`You can only upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setUploadedImages((prev) => [...prev, ...imageUrls]);
    setFormData((prev) => ({
      ...prev,
      productImages: [...prev.productImages, ...files],
    }));
  };

  const removeImage = (index) => {
    const newUploadedImages = [...uploadedImages];
    newUploadedImages.splice(index, 1);
    setUploadedImages(newUploadedImages);

    const newFiles = [...formData.productImages];
    newFiles.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      productImages: newFiles,
    }));
  };

  const handleGoBack = () => {
    navigate("/products");
  };

  const handleSubmit = async () => {
    if (!formData.categoryId || !formData.categoryName) {
      setError("Category is required.");
      toast.error("Category is required.");
      return;
    }
    if (!formData.subCategoryId || !formData.subCategoryName) {
      setError("Subcategory is required (select a category first).");
      toast.error("Subcategory is required (select a category first).");
      return;
    }
    /* if (!formData.filterId || !formData.filterName) {
      setError("Filter is required (select a category first).");
      toast.error("Filter is required (select a category first).");
      return;
    } */
    if (!formData.productTitle) {
      setError("Product Name is required.");
      toast.error("Product Name is required.");
      return;
    }
    if (!formData.productImages.length) {
      setError("At least one product image is required.");
      toast.error("At least one product image is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("categoryId", formData.categoryId);
      formDataToSend.append("categoryName", formData.categoryName);
      formDataToSend.append("subCategoryId", formData.subCategoryId);
      formDataToSend.append("subCategoryName", formData.subCategoryName);
      formDataToSend.append("filterId", formData.filterId);
      formDataToSend.append("filterName", formData.filterName);
      formDataToSend.append("productTitle", formData.productTitle);
      formDataToSend.append("productDescription", formData.productDescription);
      formDataToSend.append("additionalInformation", formData.additionalInformation);
      ingredients.forEach((ing)=>{
        formDataToSend.append("ingredients", ing)
      })
      formDataToSend.append("status", formData.status);

      formData.productImages.forEach((file) => {
        formDataToSend.append("productImages", file);
      });

      if (isEditMode) {
        await updateProduct(subCategory._id, formDataToSend);
        toast.success("Product updated successfully!");
      } else {
        await createProduct(formDataToSend);
        toast.success("Product created successfully!");
      }

      navigate("/products");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to save product. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <h1 className="text-3xl font-title text-gray-800">
        {isEditMode ? "Edit Product" : "Add Product"}
      </h1>
      <button
        onClick={handleGoBack}
        className="text-black rounded my-3 mr-4 w-full md:w-auto cursor-pointer hover:text-gray-600"
      >
        ← Go back
      </button>

      <div className="col-span-2 space-y-2 bg-white shadow-lg rounded-lg p-6 w-full">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          {isEditMode ? "Add/Edit Product Images" : "Add Product Images"}
        </h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col justify-center items-center relative">
          <FaUpload className="text-orange-500 text-4xl mb-2" />
          <input
            type="file"
            onChange={handleFileUpload}
            className="absolute opacity-0 cursor-pointer inset-0"
            multiple
            accept="image/*"
          />
          <p className="text-gray-500">
            Drag your images here, or click to browse (Max {MAX_IMAGES} images)
          </p>
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="mt-4">
          <h3 className="text-md font-medium mb-2">
            Uploaded Images ({uploadedImages.length}/{MAX_IMAGES})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {uploadedImages.map((image, index) => (
              <div key={`uploaded-${index}`} className="relative">
                <img
                  src={image}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-title mb-4 text-gray-800">
            Product Information
          </h2>

          <div className="w-full mb-4">
            <label
              htmlFor="categoryName"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="categoryName"
              name="categoryName"
              className="border rounded p-2 w-full text-gray-800"
              onChange={handleInputChange}
              value={formData.categoryName}
              disabled={loading}
            >
              <option value="">Select a Category</option>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <option key={category._id} value={category.categoryTitle}>
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
              htmlFor="subCategoryName"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Subcategory <span className="text-red-500">*</span>
            </label>
            <select
              id="subCategoryName"
              name="subCategoryName"
              className="border rounded p-2 w-full text-gray-800"
              onChange={handleInputChange}
              value={formData.subCategoryName}
              disabled={loading || !formData.categoryId || subLoading}
            >
              <option value="">
                {subLoading
                  ? "Loading subcategories..."
                  : !formData.categoryId
                  ? "Select a category first"
                  : subcategories.length === 0
                  ? "No subcategories available"
                  : "Select a Subcategory"}
              </option>
              {subcategories.map((subcategory) => (
                <option key={subcategory._id} value={subcategory.subCategoryTitle}>
                  {subcategory.subCategoryTitle}
                </option>
              ))}
            </select>
          </div>

          {/* <div className="w-full mb-4">
            <label
              htmlFor="filterName"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Filter <span className="text-red-500">*</span>
            </label>
            <select
              id="filterName"
              name="filterName"
              className="border rounded p-2 w-full text-gray-800"
              onChange={handleInputChange}
              value={formData.filterName}
              disabled={loading || !formData.categoryId || filterLoading}
            >
              <option value="">
                {filterLoading
                  ? "Loading filters..."
                  : !formData.categoryId
                  ? "Select a category first"
                  : filters.length === 0
                  ? "No filters available"
                  : "Select a Filter"}
              </option>
              {filters.map((filter) => (
                <option key={filter._id} value={filter.filterName}>
                  {filter.filterName}
                </option>
              ))}
            </select>
          </div> */}

          <div className="w-full mb-4">
            <label
              htmlFor="productTitle"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="productTitle"
              type="text"
              name="productTitle"
              placeholder="Product Name"
              className="border rounded p-2 w-full text-gray-800"
              onChange={handleInputChange}
              value={formData.productTitle}
              disabled={loading}
            />
          </div>

          <div className="w-full mb-4">
            <label
              htmlFor="productDescription"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Description
            </label>
            <textarea
              id="productDescription"
              name="productDescription"
              placeholder="Product Description"
              className="border rounded p-2 w-full text-gray-800"
              onChange={handleInputChange}
              value={formData.productDescription}
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-list-alt mr-2"></i>Add Ingredient
            </label>
            <div className="flex gap-2">
              <input
                id="ingredients"
                type="text"
                placeholder="e.g., Flour"
                className="flex-1 border rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-table focus:border-table focus:outline-none transition"
                value={inputValue}
                onChange={handleInputChangeIngrediants}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
              <button
                onClick={handleAddIngredient}
                disabled={loading || !inputValue.trim()}
                className=" text-white p-3 rounded-lg  bg-table hover:bg-secondary  transition"
              >
                Add
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter or click Add to include the ingredient
            </p>
          </div>
          
          {ingredients.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Added Ingredients ({ingredients.length})
                </span>
                <button
                  onClick={handleClearAll}
                  className="text-red-500 text-sm hover:text-red-700 flex items-center"
                >
                  <i className="fas fa-trash-alt mr-1"></i> Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                {ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="inline-flex  hover:bg-secondary items-center   rounded-full px-3 py-1 text-sm"
                  >
                    {ingredient}
                    <button
                      onClick={() => removeIngredient(index)}
                      className="ml-2 text-table hover:text-secondary rounded-full hover:bg-table p-1"
                    >
                      <i className="fas fa-times text-xs">X</i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="w-full mb-4">
            <label
              htmlFor="additionalInformation"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Additional Information
            </label>
            <textarea
              id="additionalInformation"
              name="additionalInformation"
              placeholder="Additional Information"
              className="border rounded p-2 w-full text-gray-800"
              onChange={handleInputChange}
              value={formData.additionalInformation}
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="w-full mb-4">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Status <span className="text-red-500">*</span>
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
            {loading ? "Processing..." : isEditMode ? "Update Product" : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;