import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaDownload, FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Modal, Button, Switch, Tooltip, message } from 'antd';
import ReusableTable from '../Common/ReusableTable';
import { deleteCategory, editCategory, getCategories } from '../Interceptor/interceptor';

const CategoryTable = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [categoryToView, setCategoryToView] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [totalCategories, setTotalCategories] = useState(0);

  // Fetch categories from API
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: rowsPerPage,
        search: searchTerm || undefined,
      };

      console.log('API Params:', params); // Debug log

      const res = await getCategories(params);

      if (res.data && res.data.data) {
        const categoryData = res.data.data;
        const total = res.data.total || categoryData.length;

        setCategories(categoryData);
        setTotalCategories(total);
        setFilteredCategories(categoryData); // Initialize filteredCategories
      } else {
        console.error('Unexpected API response structure:', res);
        message.error('Unexpected data format received from server');
        setCategories([]);
        setFilteredCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      message.error('Failed to fetch categories. Please try again.');
      setCategories([]);
      setFilteredCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply client-side filtering for activeTab, searchTerm, and selectedCategory
  useEffect(() => {
    let filtered = [...categories];

    // Filter by activeTab (status)
    if (activeTab === 'active') {
      filtered = filtered.filter((category) => category.status === true);
    } else if (activeTab === 'inactive') {
      filtered = filtered.filter((category) => category.status === false);
    }

    // Filter by selectedCategory
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (category) =>
          category.categoryTitle.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by searchTerm (client-side if not handled by API)
    if (searchTerm) {
      filtered = filtered.filter((category) =>
        category.categoryTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCategories(filtered);
    setTotalCategories(filtered.length); // Update total for pagination
  }, [activeTab, selectedCategory, searchTerm, categories]);

  // Fetch categories when pagination or search changes
  useEffect(() => {
    fetchCategories();
  }, [currentPage, rowsPerPage, searchTerm]);

  // Define columns for Categories table
  const categoryColumns = [
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
          {row.categoryImage ? (
            <img
              src={
                Array.isArray(row.categoryImage)
                  ? row.categoryImage[0]
                  : row.categoryImage
              }
              alt={row.categoryTitle || 'Category'}
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
      name: 'Category Name',
      selector: (row) => row.categoryTitle || '-',
      sortable: true,
      width: '35%',
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
            aria-label={`Toggle status for ${row.categoryTitle || 'category'}`}
            size="small"
          />
        </div>
      ),
      width: '20%',
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="flex justify-center space-x-1">
          <Tooltip title="View">
            <button
              onClick={() => handleViewClick(row)}
              className="bg-gray-100 text-gray-800 p-1 rounded cursor-pointer hover:bg-gray-200"
              aria-label={`View details for ${row.categoryTitle || 'category'}`}
            >
              <FaEye size={14} />
            </button>
          </Tooltip>
          <Tooltip title="Edit">
            <button
              onClick={() => handleEditClick(row)}
              className="bg-orange-100 text-orange-600 p-1 rounded hover:bg-orange-200 cursor-pointer"
              aria-label={`Edit ${row.categoryTitle || 'category'}`}
            >
              <FaEdit size={14} />
            </button>
          </Tooltip>
          <Tooltip title="Delete">
            <button
              onClick={() => handleDeleteClick(row)}
              className="bg-red-100 text-red-600 p-1 rounded hover:bg-red-200 cursor-pointer"
              aria-label={`Delete ${row.categoryTitle || 'category'}`}
            >
              <FaTrashAlt size={14} />
            </button>
          </Tooltip>
        </div>
      ),
      width: '20%',
    },
  ];

  const handleViewClick = (category) => {
    setCategoryToView(category);
    setIsOpen(true);
  };

  const handleEditClick = (category) => {
    navigate('/categories/categoryedit', { state: { category, mode: 'edit' } });
  };

  const handleDeleteClick = (category) => {
    setCategoryToView(category);
    setShowDeleteModal(true);
  };

  const handleToggleChange = async (checked, row) => {
    if (!row?._id) {
      message.error('Invalid category selected for status update.');
      return;
    }

    try {
      const status = checked;
      const res = await editCategory({ status }, row._id);

      if (res.data && res.data.success) {
        message.success(`Category ${row.categoryTitle} status updated successfully`);
        setCategories((prev) =>
          prev.map((item) =>
            item._id === row._id ? { ...item, status: checked } : item
          )
        );
      } else {
        message.error('Failed to update category status');
      }
    } catch (error) {
      console.error('Error updating category status:', error);
      message.error('Failed to update category status. Please try again.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToView?._id) {
      message.error('Invalid category selected for deletion.');
      return;
    }

    try {
      setLoading(true);
      const res = await deleteCategory(categoryToView._id);

      if (res.data && res.data.success) {
        message.success(`Category ${categoryToView.categoryTitle} deleted successfully`);
        setShowDeleteModal(false);
        setCategoryToView(null);
        await fetchCategories(); // Refresh the table
      } else {
        message.error('Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      message.error('Failed to delete category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategoryClick = () => {
    navigate('/categories/categoryadd', { state: { mode: 'add' } });
  };

  const handleExcelDownload = async () => {
    try {
      setLoading(true);
      message.info('Excel download functionality would be implemented here');
    } catch (error) {
      console.error('Error exporting categories:', error);
      message.error('Failed to export categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterCategories = (status) => {
    setActiveTab(status);
    setCurrentPage(1); // Reset to first page when changing filters
  };

  return (
    <div className="p-4 w-full bg-gray-100">
      <div className="bg-white min-h-[calc(100vh-100px)] p-6 shadow-md rounded-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 px-8">
          <h2 className="text-2xl font-semibold text-gray-800">Categories</h2>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search Category"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="border border-gray-300 p-2 rounded-md w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <select
              className="border border-gray-300 rounded-md p-2 cursor-pointer w-full md:w-48"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1); // Reset to first page on category change
              }}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category.categoryTitle}>
                  {category.categoryTitle}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6 px-8">
          <div className="flex">
            <button
              className={`px-4 py-2 font-medium cursor-pointer transition-all duration-200 ${
                activeTab === 'all'
                  ? 'text-secondary border-b-2 border-secondary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => filterCategories('all')}
            >
              All
            </button>
            <button
              className={`px-4 py-2 font-medium cursor-pointer transition-all duration-200 ${
                activeTab === 'active'
                  ? 'text-secondary border-b-2 border-secondary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => filterCategories('active')}
            >
              Active
            </button>
            <button
              className={`px-4 py-2 font-medium cursor-pointer transition-all duration-200 ${
                activeTab === 'inactive'
                  ? 'text-secondary border-b-2 border-secondary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => filterCategories('inactive')}
            >
              Inactive
            </button>
            <div className="flex gap-3 ms-auto">
             <button
  onClick={handleAddCategoryClick}
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
  Add Category
</button>

              {/* <button
                onClick={handleExcelDownload}
                className="flex items-center justify-center cursor-pointer w-10 h-10 rounded-full bg-white border border-gray-300 hover:bg-green-100 hover:border-green-500 transition-all duration-300 shadow-sm"
                title="Export to Excel"
              >
                <FaDownload className="text-secondary hover:text-green-600 w-4 h-4" />
              </button> */}
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Loading categories...</div>
          </div>
        )}

        {!loading && filteredCategories.length === 0 && (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">
              {activeTab === 'all'}
               {/* ? 'No categories found' : `No ${activeTab} categories found` */}
              {searchTerm && ` for "${searchTerm}"`}
              {selectedCategory !== 'all' && ` in "${selectedCategory}"`}
            </div>
          </div>
        )}

        <ReusableTable
          columns={categoryColumns}
          data={filteredCategories}
          loading={loading}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalRows={totalCategories}
          onPageChange={(page) => setCurrentPage(page)}
          onRowsPerPageChange={(newPerPage, page) => {
            setRowsPerPage(newPerPage);
            setCurrentPage(page);
          }}
        />

        <Modal
          title="Category Details"
          open={isOpen}
          onCancel={() => setIsOpen(false)}
          footer={[
            <Button key="close" onClick={() => setIsOpen(false)}>
              Close
            </Button>,
          ]}
          width={600}
        >
          {categoryToView && (
            <div className="space-y-4">
              <div className="flex flex-col items-center mb-4">
                <img
                  src={
                    Array.isArray(categoryToView.categoryImage)
                      ? categoryToView.categoryImage[0]
                      : categoryToView.categoryImage || 'https://via.placeholder.com/208x160'
                  }
                  alt={categoryToView.categoryTitle}
                  className="w-52 h-40 object-contain rounded-md border border-gray-200 p-2"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/208x160';
                  }}
                />
                <h3 className="text-xl font-semibold mt-3">{categoryToView.categoryTitle}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-gray-600">Status</p>
                  <p className="capitalize">{categoryToView.status ? 'active' : 'inactive'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600">Description</p>
                  <p className="text-gray-800">
                    {categoryToView.categoryDescription || 'No description available'}
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
          <p>Are you sure you want to delete the category "{categoryToView?.categoryTitle}"?</p>
        </Modal>
      </div>
    </div>
  );
};

export default CategoryTable;