import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaDownload, FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Modal, Button, Tooltip, message } from 'antd';
import ReusableTable from '../Common/ReusableTable';
import { getFilter, deleteFilter, editFilter, getCategories } from '../Interceptor/interceptor';

const FilterTable = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [filterToView, setFilterToView] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState([]);
  const [filteredFilters, setFilteredFilters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [totalFilters, setTotalFilters] = useState(0);

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

  // Fetch filters from API
  const fetchFilters = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: rowsPerPage,
        search: searchTerm || undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
      };

      console.log('API Params:', params);

      const res = await getFilter(params);

      if (res.data && res.data.data) {
        const filterData = res.data.data;
        const total = res.data.total || filterData.length;

        setFilters(filterData);
        setTotalFilters(total);
        setFilteredFilters(filterData); // Initialize filteredFilters
      } else {
        console.error('Unexpected API response structure:', res);
        message.error('Unexpected data format received from server');
        setFilters([]);
        setFilteredFilters([]);
      }
    } catch (error) {
      console.error('Error fetching filters:', error);
      message.error('Failed to fetch filters. Please try again.');
      setFilters([]);
      setFilteredFilters([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply client-side filtering for searchTerm and selectedCategory
  useEffect(() => {
    let filtered = [...filters];

    // Filter by selectedCategory
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (filter) => filter.categoryId === selectedCategory
      );
    }

    // Filter by searchTerm (client-side if not fully handled by API)
    if (searchTerm) {
      filtered = filtered.filter((filter) =>
        filter.filterName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFilters(filtered);
    setTotalFilters(filtered.length);
  }, [selectedCategory, searchTerm, filters]);

  // Fetch categories and filters when dependencies change
  useEffect(() => {
    fetchCategories();
    fetchFilters();
  }, [currentPage, rowsPerPage, searchTerm, selectedCategory]);

  // Define columns for Filters table
  const filterColumns = [
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
      width: '25%',
    },
    {
      name: 'Filter Name',
      selector: (row) => row.filterName || '-',
      sortable: true,
      width: '30%',
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="flex justify-center space-x-1">
          <Tooltip title="View">
            <button
              onClick={() => handleViewClick(row)}
              className="bg-gray-100 text-gray-800 p-1 rounded cursor-pointer hover:bg-gray-200"
              aria-label={`View details for ${row.filterName || 'filter'}`}
            >
              <FaEye size={14} />
            </button>
          </Tooltip>
          <Tooltip title="Edit">
            <button
              onClick={() => handleEditClick(row)}
              className="bg-orange-100 text-orange-600 p-1 rounded hover:bg-orange-200 cursor-pointer"
              aria-label={`Edit ${row.filterName || 'filter'}`}
            >
              <FaEdit size={14}/>
            </button>
          </Tooltip>
          <Tooltip title="Delete">
            <button
              onClick={() => handleDeleteClick(row)}
              className="bg-red-100 text-red-600 p-1 rounded hover:bg-red-200 cursor-pointer"
              aria-label={`Delete ${row.filterName || 'filter'}`}
            >
              <FaTrashAlt size={14} />
            </button>
          </Tooltip>
        </div>
      ),
      width: '35%',
    },
  ];

  const handleViewClick = (filter) => {
    setFilterToView(filter);
    setIsOpen(true);
  };

  const handleEditClick = (filter) => {
    navigate('/filter/filteredit', { state: { filter: filter, mode: 'edit' } });
  };

  const handleDeleteClick = (filter) => {
    setFilterToView(filter);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!filterToView?._id) {
      message.error('Invalid filter selected for deletion.');
      return;
    }

    try {
      setLoading(true);
      const res = await deleteFilter(filterToView._id);

      if (res.data && res.data.success) {
        message.success(`Filter ${filterToView.filterName} deleted successfully`);
        setShowDeleteModal(false);
        setFilterToView(null);
        await fetchFilters();
      } else {
        message.error('Failed to delete filter');
      }
    } catch (error) {
      console.error('Error deleting filter:', error);
      message.error('Failed to delete filter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFilterClick = () => {
    navigate('/filter/filteradd', { state: { mode: 'add' } });
  };

  const handleExcelDownload = async () => {
    try {
      setLoading(true);
      message.info('Excel download functionality would be implemented here');
    } catch (error) {
      console.error('Error exporting filters:', error);
      message.error('Failed to export filters. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-full bg-gray-100">
      <div className="bg-white min-h-[calc(100vh-100px)] p-6 shadow-md rounded-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 px-8">
          <h2 className="text-2xl font-semibold text-gray-800">Filter</h2>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search Filter"
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

        <div className="flex mb-6 px-8">
          <div className="flex gap-3 ms-auto">

                        <button
  onClick={handleAddFilterClick}
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
  Add Filter
</button>
            {/* <button
              onClick={handleAddFilterClick}
              className="flex items-center cursor-pointer justify-center w-10 h-10 rounded-full bg-white border border-gray-300 hover:bg-green-100 hover:border-green-500 transition-all duration-300 shadow-sm"
              title="Add Filter"
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

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Loading filters...</div>
          </div>
        )}

        {!loading && filteredFilters.length === 0 && (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">
              No filters found
              {searchTerm && ` for "${searchTerm}"`}
              {selectedCategory !== 'all' && ` in selected category`}
            </div>
          </div>
        )}

        <ReusableTable
          columns={filterColumns}
          data={filteredFilters}
          loading={loading}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalRows={totalFilters}
          onPageChange={(page) => setCurrentPage(page)}
          onRowsPerPageChange={(newPerPage, page) => {
            setRowsPerPage(newPerPage);
            setCurrentPage(page);
          }}
        />

        <Modal
          title="Filter Details"
          open={isOpen}
          onCancel={() => setIsOpen(false)}
          footer={[
            <Button key="close" onClick={() => setIsOpen(false)}>
              Close
            </Button>,
          ]}
          width={600}
        >
          {filterToView && (
            <div className="space-y-4">
              <div className="flex flex-col items-center mb-4">
                <h3 className="text-xl font-semibold">{filterToView.filterName}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-gray-600">Category</p>
                  <p className="text-gray-800">{filterToView.categoryTitle || 'No category'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600">Created At</p>
                  <p className="text-gray-800">
                    {filterToView.createdAt ? new Date(filterToView.createdAt).toLocaleDateString() : 'No date available'}
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
          <p>Are you sure you want to delete the filter "{filterToView?.filterName}"?</p>
        </Modal>
      </div>
    </div>
  );
};

export default FilterTable;