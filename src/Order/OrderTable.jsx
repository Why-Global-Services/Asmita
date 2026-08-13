import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaTrashAlt } from 'react-icons/fa';
import { Modal, Button, message, Tooltip } from 'antd';
import ReusableTable from '../Common/ReusableTable';
import { getBookedProducts, deleteBookedProduct } from '../Interceptor/interceptor';

const OrderTable = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookedProducts, setBookedProducts] = useState([]);
  const [filteredBookedProducts, setFilteredBookedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);

  // Fetch booked products from API
  const fetchBookedProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: rowsPerPage,
        search: searchTerm || undefined,
      };

      const res = await getBookedProducts(params);

      if (res.data && res.data.data) {
        const productData = res.data.data;
        const total = res.data.total || productData.length;

        setBookedProducts(productData);
        setFilteredBookedProducts(productData);
        setTotalProducts(total);
      } else {
        console.error('Unexpected API response structure:', res);
        message.error('Unexpected data format received from server');
        setBookedProducts([]);
        setFilteredBookedProducts([]);
      }
    } catch (error) {
      console.error('Error fetching booked products:', error);
      message.error('Failed to fetch booked products. Please try again.');
      setBookedProducts([]);
      setFilteredBookedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply client-side filtering for searchTerm
  useEffect(() => {
    let filtered = [...bookedProducts];
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.productTitle && product.productTitle.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setFilteredBookedProducts(filtered);
    setTotalProducts(filtered.length);
  }, [searchTerm, bookedProducts]);

  // Fetch booked products on mount and when dependencies change
  useEffect(() => {
    fetchBookedProducts();
  }, [currentPage, rowsPerPage]);

  // Define columns for Booked Products table
  const productColumns = [
    {
      name: 'S.No',
      cell: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
      width: '10%',
      sortable: false,
    },
    {
      name: 'Product Image',
      cell: (row) => (
        <div className="flex justify-center">
          {row.productImage && row.productImage.length > 0 ? (
            <img
              src={row.productImage[0]}
              alt={row.productTitle || 'Product'}
              className="w-12 h-12 object-cover rounded"
            />
          ) : (
            <span>-</span>
          )}
        </div>
      ),
      width: '15%',
      sortable: false,
    },
    {
      name: 'User Name',
      selector: (row) => row.name || '-',
      sortable: true,
      width: '20%',
    },
    {
      name: 'Product Name',
      selector: (row) => row.productTitle || '-',
      sortable: true,
      width: '20%',
    },
    {
      name: 'User Number',
      selector: (row) => row.phoneNumber || '-',
      sortable: true,
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
              aria-label={`View details for ${row.name || 'user'}`}
            >
              <FaEye size={14} />
            </button>
          </Tooltip>
          <Tooltip title="Delete">
            <button
              onClick={() => handleDeleteClick(row)}
              className="bg-red-100 text-red-600 p-1 rounded hover:bg-red-200 cursor-pointer"
              aria-label={`Delete booking for ${row.name || 'user'}`}
            >
              <FaTrashAlt size={14} />
            </button>
          </Tooltip>
        </div>
      ),
      width: '15%',
    },
  ];

  const handleViewClick = (product) => {
    setSelectedProduct(product);
    setIsOpen(true);
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct?._id) {
      message.error('Invalid product selected for deletion.');
      return;
    }

    try {
      setLoading(true);
      const res = await deleteBookedProduct(selectedProduct._id);
      
      if (res.status === 200 || res.data.success) {
        message.success(`Booking for ${selectedProduct.name || 'user'} deleted successfully`);
        setShowDeleteModal(false);
        setSelectedProduct(null);
        await fetchBookedProducts(); // Refresh the table data
      } else {
        throw new Error(res.data.message || 'Failed to delete booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      message.error(error.message || 'Failed to delete booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-full bg-gray-100">
      <div className="bg-white min-h-[calc(100vh-100px)] p-6 shadow-md rounded-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 px-8">
          <h2 className="text-2xl font-semibold text-gray-800">Booked Products</h2>
          <input
            type="text"
            placeholder="Search by User or Product Name"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 p-2 rounded-md w-full md:w-48"
          />
        </div>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Loading booked products...</div>
          </div>
        )}

        {!loading && filteredBookedProducts.length === 0 && (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">
              {searchTerm ? `No booked products found for "${searchTerm}"` : 'No booked products found'}
            </div>
          </div>
        )}

        <ReusableTable
          columns={productColumns}
          data={filteredBookedProducts}
          loading={loading}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalRows={totalProducts}
          onPageChange={(page) => setCurrentPage(page)}
          onRowsPerPageChange={(newPerPage, page) => {
            setRowsPerPage(newPerPage);
            setCurrentPage(page);
          }}
        />

        <Modal
          title="Booked Product Details"
          open={isOpen}
          onCancel={() => setIsOpen(false)}
          footer={[
            <Button key="close" onClick={() => setIsOpen(false)}>
              Close
            </Button>,
          ]}
          width={600}
        >
          {selectedProduct && (
            <div className="space-y-4">
              <div className="flex flex-col items-center mb-4">
                <h3 className="text-xl font-semibold">{selectedProduct.name}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-gray-600">User Name</p>
                  <p className="text-gray-800">{selectedProduct.name || '-'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600">Phone Number</p>
                  <p className="text-gray-800">{selectedProduct.phoneNumber || '-'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600">Email</p>
                  <p className="text-gray-800">{selectedProduct.email || '-'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600">Message</p>
                  <p className="text-gray-800">{selectedProduct.message || '-'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600">Category</p>
                  <p className="text-gray-800">{selectedProduct.categoryTitle || '-'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600">SubCategory</p>
                  <p className="text-gray-800">{selectedProduct.subCategoryTitle || '-'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600">Product</p>
                  <p className="text-gray-800">{selectedProduct.productTitle || '-'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600">Product Images</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.productImage && selectedProduct.productImage.length > 0 ? (
                      selectedProduct.productImage.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`Product Image ${index + 1}`}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ))
                    ) : (
                      <p className="text-gray-800">-</p>
                    )}
                  </div>
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
          <p>Are you sure you want to delete the booking for "{selectedProduct?.name}"?</p>
        </Modal>
      </div>
    </div>
  );
};

export default OrderTable;