import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaDownload, FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Modal, Button, Switch, Tooltip } from 'antd';
import ReusableTable from '../Common/ReusableTable';
import { getProduct, getCategories, deleteProduct, updateProduct } from '../Interceptor/interceptor';
import { toast } from 'react-toastify';

const ProductTable = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [subCategoryToView, setSubCategoryToView] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      console.log('getCategories response:', response.data); // Debug API response
      const categoryData = Array.isArray(response.data.data)
        ? response.data.data
        : Array.isArray(response.data)
        ? response.data
        : [];
      setCategories(categoryData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories. Please try again later.');
      setCategories([]);
    }
  };

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getProduct();
      console.log('getProduct response:', response.data); // Debug API response
      const productData = Array.isArray(response.data.data)
        ? response.data.data
        : Array.isArray(response.data)
        ? response.data
        : [];
      setSubCategories(productData);
      setFilteredSubCategories(productData);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products. Please try again later.');
      setSubCategories([]);
      setFilteredSubCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories and products on component mount
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // Filter products based on category, status, and search term
  useEffect(() => {
    console.log('Filtering with selectedCategory:', selectedCategory); // Debug selected category
    let filtered = Array.isArray(subCategories) ? [...subCategories] : [];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item) => {
        // Use categoryName or categoryTitle based on your API data
        const categoryField = item.categoryName || item.categoryTitle || '';
        return categoryField === selectedCategory;
      });
    }

    // Filter by status
    if (activeTab === 'active') {
      filtered = filtered.filter((item) => item.status === true);
    } else if (activeTab === 'inactive') {
      filtered = filtered.filter((item) => item.status === false);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter((item) =>
        [
          item.productTitle,
          item.categoryName || item.categoryTitle,
        ].some((field) =>
          field?.toLowerCase().includes(searchTerm.toLowerCase().trim())
        )
      );
    }

    console.log('Filtered products:', filtered); // Debug filtered results
    setFilteredSubCategories(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [subCategories, selectedCategory, activeTab, searchTerm]);

  // Define columns for Products table
  const subCategoryColumns = [
    {
      name: 'S.No',
      cell: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
      width: '10%',
      sortable: false,
    },
    {
      name: 'Image',
      cell: (row) => (
        <div className="flex items-center justify-center">
          {row.productImages ? (
            <img
              src={
                Array.isArray(row.productImages)
                  ? row.productImages[0]
                  : row.productImages
              }
              alt={row.productTitle || 'Product'}
              className="w-6 h-6 object-cover rounded-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.in/200.png';
              }}
            />
          ) : (
            <div className="w-6 h-6 bg-gray-100 flex items-center justify-center rounded-md">
              -
            </div>
          )}
        </div>
      ),
      width: '15%',
    },
    {
      name: 'Product Name',
      selector: (row) => row.productTitle || '-',
      sortable: true,
      width: '25%',
    },
    {
      name: 'Parent Category',
      selector: (row) => (row.categoryName || row.categoryTitle || '-'),
      sortable: true,
      width: '25%',
    },
    {
      name: 'Status',
      cell: (row) => (
        <div className="flex justify-center">
          <Switch
            checked={row.status === true}
            onChange={(checked) => handleToggleChange(checked, row)}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            aria-label={`Toggle status for ${row.productTitle || 'product'}`}
            size="small"
          />
        </div>
      ),
      width: '15%',
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="flex justify-center space-x-1">
          <Tooltip title="View">
            <button
              onClick={() => handleViewClick(row)}
              className="bg-gray-100 text-gray-800 p-1 rounded cursor-pointer hover:bg-gray-200"
              aria-label={`View details for ${row.productTitle || 'product'}`}
            >
              <FaEye size={14} />
            </button>
          </Tooltip>
          <Tooltip title="Edit">
            <button
              onClick={() => handleEditClick(row)}
              className="bg-orange-100 text-orange-600 p-1 rounded hover:bg-orange-200 cursor-pointer"
              aria-label={`Edit ${row.productTitle || 'product'}`}
            >
              <FaEdit size={14} />
            </button>
          </Tooltip>
          <Tooltip title="Delete">
            <button
              onClick={() => handleDeleteClick(row)}
              className="bg-red-100 text-red-600 p-1 rounded hover:bg-red-200 cursor-pointer"
              aria-label={`Delete ${row.productTitle || 'product'}`}
            >
              <FaTrashAlt size={14} />
            </button>
          </Tooltip>
        </div>
      ),
      width: '10%',
    },
  ];

  const handleViewClick = (subCategory) => {
    setSubCategoryToView(subCategory);
    setIsOpen(true);
  };

  const handleEditClick = (subCategory) => {
    navigate('/products/productedit', { state: { subCategory, mode: 'edit' } });
  };

  const handleDeleteClick = (subCategory) => {
    setSubCategoryToView(subCategory);
    setShowDeleteModal(true);
  };

  const handleToggleChange = async (checked, row) => {
    if (!row?._id) {
      toast.error('Invalid product selected for status update.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('status', checked);
      await updateProduct(row._id, formData);
      toast.success(`Product status updated to ${checked ? 'Active' : 'Inactive'}.`);
      setSubCategories((prev) =>
        prev.map((item) =>
          item._id === row._id ? { ...item, status: checked } : item
        )
      );
      setFilteredSubCategories((prev) =>
        prev.map((item) =>
          item._id === row._id ? { ...item, status: checked } : item
        )
      );
    } catch (error) {
      console.error('Error updating product status:', error);
      toast.error('Failed to update product status. Please try again later.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!subCategoryToView?._id) {
      toast.error('Invalid product selected for deletion.');
      return;
    }

    setLoading(true);
    try {
      await deleteProduct(subCategoryToView._id);
      toast.success('Product deleted successfully.');
      setShowDeleteModal(false);
      setSubCategoryToView(null);
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubCategoryClick = () => {
    navigate('/products/productadd', { state: { mode: 'add' } });
  };

  const handleExcelDownload = () => {
    console.log('Excel download triggered');
    // TODO: Implement Excel download with API data
  };

  const handleCategoryFilterChange = (categoryTitle) => {
    console.log('Selected category:', categoryTitle); // Debug category selection
    setSelectedCategory(categoryTitle);
  };

  const filterSubCategories = (status) => {
    setActiveTab(status);
  };

  return (
    <div className="p-4 w-full bg-gray-100">
      <div className="bg-white min-h-[calc(100vh-100px)] p-6 shadow-md rounded-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 px-8">
          <h2 className="text-2xl font-semibold text-gray-800">Products</h2>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by Product or Category"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 p-2 rounded-md w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-secondary"
            />

            <select
              className="border border-gray-300 rounded-md p-2 cursor-pointer w-full md:w-48"
              value={selectedCategory}
              onChange={(e) => handleCategoryFilterChange(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <option key={category._id} value={category.categoryTitle || category.categoryName}>
                    {category.categoryTitle || category.categoryName || 'Unnamed Category'}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No categories available
                </option>
              )}
            </select>
          </div>
        </div>

        <div className="mb-6 px-8">
          <div className="flex">
            <button
              className={`px-4 py-2 font-medium cursor-pointer ${
                activeTab === 'all'
                  ? 'text-secondary border-b-2 border-secondary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => filterSubCategories('all')}
            >
              All
            </button>
            <button
              className={`px-4 py-2 font-medium cursor-pointer ${
                activeTab === 'active'
                  ? 'text-secondary border-b-2 border-secondary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => filterSubCategories('active')}
            >
              Active
            </button>
            <button
              className={`px-4 py-2 font-medium cursor-pointer ${
                activeTab === 'inactive'
                  ? 'text-secondary border-b-2 border-secondary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => filterSubCategories('inactive')}
            >
              Inactive
            </button>
            <div className="flex gap-3 ms-auto">

               <button
  onClick={handleAddSubCategoryClick}
  className="group relative flex items-center gap-2 px-5 py-2.5 rounded-[5px] bg-table cursor-pointer text-white font-medium   focus:outline-none focus:ring-2 focus:ring-green-300"
>
  <span className="absolute inset-0  bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
  Add Product
</button>
              {/* <button
                onClick={handleAddSubCategoryClick}
                className="flex items-center cursor-pointer justify-center w-10 h-10 rounded-full bg-white border border-gray-300 hover:bg-green-100 hover:border-green-500 transition-all duration-300 shadow-sm"
                title="Add Product"
              >
                <FaPlus className="text-secondary hover:text-green-600 w-4 h-4" />
              </button>

              <button
                onClick={handleExcelDownload}
                className="flex items-center justify-center cursor-pointer w-10 h-10 rounded-full bg-white border border-gray-300 hover:bg-green-100 hover:border-green-500 transition-all duration-300 shadow-sm"
                title="Export to Excel"
              >
                <FaDownload className="text-secondary hover:text-green-600 w-4 h-4" />
              </button> */}
            </div>
          </div>
        </div>

        <ReusableTable
          columns={subCategoryColumns}
          data={filteredSubCategories}
          loading={loading}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
          onRowsPerPageChange={(newPerPage, page) => {
            setRowsPerPage(newPerPage);
            setCurrentPage(page);
          }}
        />

        <Modal
          title="Product Details"
          open={isOpen}
          onCancel={() => setIsOpen(false)}
          footer={[
            <Button key="close" onClick={() => setIsOpen(false)}>
              Close
            </Button>,
          ]}
          width={600}
        >
          {subCategoryToView && (
            <div className="space-y-4">
              <div className="flex flex-col items-center mb-4">
                <img
                  src={
                    Array.isArray(subCategoryToView.productImages)
                      ? subCategoryToView.productImages[0]
                      : subCategoryToView.productImages || 'https://via.placeholder.com/208x160'
                  }
                  alt={subCategoryToView.productTitle || 'Product'}
                  className="w-52 h-40 object-contain rounded-md border border-gray-200 p-2"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/208x160';
                  }}
                />
                <h3 className="text-xl font-semibold mt-3">
                  {subCategoryToView.categoryName || subCategoryToView.categoryTitle || 'N/A'}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-gray-600">Product Name</p>
                  <p>{subCategoryToView.productTitle || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600">Status</p>
                  <p className="capitalize">{subCategoryToView.status ? 'Active' : 'Inactive'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600">Description</p>
                  <p className="text-gray-800">
                    {subCategoryToView.productDescription || 'No description available'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Modal>

        <Modal
          title="Confirm Delete"
          open={showDeleteModal}
          onOk={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
          footer={[
            <Button key="back" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" danger onClick={handleDeleteConfirm} loading={loading}>
              Delete
            </Button>,
          ]}
        >
          <p>
            Are you sure you want to delete the product "{subCategoryToView?.productTitle || 'N/A'}"?
          </p>
        </Modal>
      </div>
    </div>
  );
};

export default ProductTable;