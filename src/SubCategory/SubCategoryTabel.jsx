import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaDownload, FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Modal, Button, Switch, Tooltip, message } from 'antd';
import ReusableTable from '../Common/ReusableTable';
import { deleteSubCategory, editSubCategory, getSubCategories, getCategories } from '../Interceptor/interceptor';

const SubCategoryTable = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [subCategoryToView, setSubCategoryToView] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [totalSubCategories, setTotalSubCategories] = useState(0);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      if (res.data && res.data.data) {
        setCategories(res.data.data);
      } else {
        console.error('Unexpected API response structure for categories:', res);
        message.error('Unexpected data format received for categories');
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      message.error('Failed to fetch categories. Please try again.');
      setCategories([]);
    }
  };

  // Fetch subcategories from API
  const fetchSubCategories = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: rowsPerPage,
        search: searchTerm || undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
      };

      console.log('API Params:', params);

      const res = await getSubCategories(params);

      if (res.data && res.data.data) {
        const subCategoryData = res.data.data;
        const total = res.data.total || subCategoryData.length;

        setSubCategories(subCategoryData);
        setTotalSubCategories(total);
        setFilteredSubCategories(subCategoryData); // Initialize filteredSubCategories
      } else {
        console.error('Unexpected API response structure:', res);
        message.error('Unexpected data format received from server');
        setSubCategories([]);
        setFilteredSubCategories([]);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      message.error('Failed to fetch subcategories. Please try again.');
      setSubCategories([]);
      setFilteredSubCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply client-side filtering for activeTab, searchTerm, and selectedCategory
  useEffect(() => {
    let filtered = [...subCategories];

    // Filter by activeTab (status)
    if (activeTab === 'active') {
      filtered = filtered.filter((subCategory) => subCategory.status === true);
    } else if (activeTab === 'inactive') {
      filtered = filtered.filter((subCategory) => subCategory.status === false);
    }

    // Filter by selectedCategory
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (subCategory) => subCategory.categoryId === selectedCategory
      );
    }

    // Filter by searchTerm (client-side if not fully handled by API)
    if (searchTerm) {
      filtered = filtered.filter((subCategory) =>
        subCategory.subCategoryTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSubCategories(filtered);
    setTotalSubCategories(filtered.length);
  }, [activeTab, selectedCategory, searchTerm, subCategories]);

  // Fetch categories and subcategories when dependencies change
  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, [currentPage, rowsPerPage, searchTerm, selectedCategory]);

  // Define columns for SubCategories table, aligned with CategoryTable
  const subCategoryColumns = [
    {
      name: 'S.No',
      cell: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
      width: '10%',
      sortable: false,
    },
    {
      name: 'Category Name',
      selector: (row) => row.categoryTitle || '-',
      sortable: true,
      width: '20%',
    },
    {
      name: 'SubCategory Name',
      selector: (row) => row.subCategoryTitle || '-',
      sortable: true,
      width: '30%',
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
            aria-label={`Toggle status for ${row.subCategoryTitle || 'subcategory'}`}
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
              aria-label={`View details for ${row.subCategoryTitle || 'subcategory'}`}
            >
              <FaEye size={14} />
            </button>
          </Tooltip>
          <Tooltip title="Edit">
            <button
              onClick={() => handleEditClick(row)}
              className="bg-orange-100 text-orange-600 p-1 rounded hover:bg-orange-200 cursor-pointer"
              aria-label={`Edit ${row.subCategoryTitle || 'subcategory'}`}
            >
              <FaEdit size={14}/>
            </button>
          </Tooltip>
          <Tooltip title="Delete">
            <button
              onClick={() => handleDeleteClick(row)}
              className="bg-red-100 text-red-600 p-1 rounded hover:bg-red-200 cursor-pointer"
              aria-label={`Delete ${row.subCategoryTitle || 'subcategory'}`}
            >
              <FaTrashAlt size={14} />
            </button>
          </Tooltip>
        </div>
      ),
      width: '20%',
    },
  ];

  const handleViewClick = (subCategory) => {
    setSubCategoryToView(subCategory);
    setIsOpen(true);
  };

  const handleEditClick = (subCategory) => {
    navigate('/subcategories/subcategoryedit', { state: { subcategory: subCategory, mode: 'edit' } });
  };

  const handleDeleteClick = (subCategory) => {
    setSubCategoryToView(subCategory);
    setShowDeleteModal(true);
  };

  const handleToggleChange = async (checked, row) => {
    if (!row?._id) {
      message.error('Invalid subcategory selected for status update.');
      return;
    }

    try {
      const payload = {
        status: checked,
        categoryId: row.categoryId,
        categoryTitle: row.categoryTitle,
        subCategoryTitle: row.subCategoryTitle,
      };
      const res = await editSubCategory(row._id, payload);

      if (res.data && res.data.success) {
        message.success(`SubCategory ${row.subCategoryTitle} status updated successfully`);
        setSubCategories((prev) =>
          prev.map((item) =>
            item._id === row._id ? { ...item, status: checked } : item
          )
        );
      } else {
        message.error('Failed to update subcategory status');
      }
    } catch (error) {
      console.error('Error updating subcategory status:', error);
      message.error('Failed to update subcategory status. Please try again.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!subCategoryToView?._id) {
      message.error('Invalid subcategory selected for deletion.');
      return;
    }

    try {
      setLoading(true);
      const res = await deleteSubCategory(subCategoryToView._id);

      if (res.data && res.data.success) {
        message.success(`SubCategory ${subCategoryToView.subCategoryTitle} deleted successfully`);
        setShowDeleteModal(false);
        setSubCategoryToView(null);
        await fetchSubCategories();
      } else {
        message.error('Failed to delete subcategory');
      }
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      message.error('Failed to delete subcategory. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubCategoryClick = () => {
    navigate('/subcategories/subcategoryadd', { state: { mode: 'add' } });
  };

  const handleExcelDownload = async () => {
    try {
      setLoading(true);
      message.info('Excel download functionality would be implemented here');
    } catch (error) {
      console.error('Error exporting subcategories:', error);
      message.error('Failed to export subcategories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterSubCategories = (status) => {
    setActiveTab(status);
    setCurrentPage(1);
  };

  return (
    <div className="p-4 w-full bg-gray-100">
      <div className="bg-white min-h-[calc(100vh-100px)] p-6 shadow-md rounded-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 px-8">
          <h2 className="text-2xl font-semibold text-gray-800">SubCategories</h2>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search SubCategory"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 p-2 rounded-md w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <select
              className="border border-gray-300 rounded-md p-2 cursor-pointer w-full md:w-48"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
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
              onClick={() => filterSubCategories('all')}
            >
              All
            </button>
            <button
              className={`px-4 py-2 font-medium cursor-pointer transition-all duration-200 ${
                activeTab === 'active'
                  ? 'text-secondary border-b-2 border-secondary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => filterSubCategories('active')}
            >
              Active
            </button>
            <button
              className={`px-4 py-2 font-medium cursor-pointer transition-all duration-200 ${
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
  Add SubCategory
</button>

              {/* <button
                onClick={handleAddSubCategoryClick}
                className="flex items-center cursor-pointer justify-center w-10 h-10 rounded-full bg-white border border-gray-300 hover:bg-green-100 hover:border-green-500 transition-all duration-300 shadow-sm"
                title="Add SubCategory"
              >
                <FaPlus className="text-secondary hover:text-green-600 w-4 h-4" />
              </button> */}

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
            <div className="text-gray-500">Loading subcategories...</div>
          </div>
        )}

        {!loading && filteredSubCategories.length === 0 && (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">
              {activeTab === 'all' }
              {/* ? 'No subcategories found' : `No ${activeTab} subcategories found` */}
              {searchTerm && ` for "${searchTerm}"`}
              {selectedCategory !== 'all' && ` in selected category`}
            </div>
          </div>
        )}

        <ReusableTable
          columns={subCategoryColumns}
          data={filteredSubCategories}
          loading={loading}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalRows={totalSubCategories}
          onPageChange={(page) => setCurrentPage(page)}
          onRowsPerPageChange={(newPerPage, page) => {
            setRowsPerPage(newPerPage);
            setCurrentPage(page);
          }}
        />

        <Modal
          title="SubCategory Details"
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
                <h3 className="text-xl font-semibold">{subCategoryToView.subCategoryTitle}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-gray-600">Category</p>
                  <p className="text-gray-800">{subCategoryToView.categoryTitle || 'No category'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600">Status</p>
                  <p className="capitalize">{subCategoryToView.status ? 'active' : 'inactive'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600">Description</p>
                  <p className="text-gray-800">
                    {subCategoryToView.subCategoryDescription || 'No description available'}
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
          <p>Are you sure you want to delete the subcategory "{subCategoryToView?.subCategoryTitle}"?</p>
        </Modal>
      </div>
    </div>
  );
};

export default SubCategoryTable;