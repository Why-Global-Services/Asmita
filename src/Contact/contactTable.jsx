import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaDownload, FaEye, FaTrashAlt, FaSearch } from 'react-icons/fa';
import { Modal, Button, Tooltip } from 'antd';
import ReusableTable from '../Common/ReusableTable';
import { getContact } from '../Interceptor/interceptor';

const ContactEnquiryTable = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [enquiryToView, setEnquiryToView] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [enquiry, setEnquiry] = useState([]);

  const fetchContactEnquiry = async () => {
    try {
      setLoading(true);
      const res = await getContact();
      setEnquiry(res.data.data);
    } catch (error) {
      console.error('Error fetching contact enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactEnquiry();
  }, []);

  // Filter enquiries based on search term
  const filteredEnquiries = useMemo(() => {
    if (!searchTerm) return enquiry;
    
    const lowercasedSearch = searchTerm.toLowerCase();
    return enquiry.filter(item => 
      (item.name && item.name.toLowerCase().includes(lowercasedSearch)) ||
      (item.phoneNumber && item.phoneNumber.toLowerCase().includes(lowercasedSearch)) ||
      (item.email && item.email.toLowerCase().includes(lowercasedSearch)) ||
      (item.message && item.message.toLowerCase().includes(lowercasedSearch))
    );
  }, [enquiry, searchTerm]);

  // Define columns for Contact Enquiries table
  const enquiryColumns = [
    {
      name: 'S.No',
      cell: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
      width: '10%',
      sortable: false,
    },
    {
      name: 'Name',
      selector: (row) => row.name || '-',
      sortable: true,
      width: '20%',
    },
    {
      name: 'Phone Number',
      selector: (row) => row.phoneNumber || '-',
      sortable: true,
      width: '20%',
    },
    {
      name: 'Email',
      selector: (row) => row.email || '-',
      sortable: true,
      width: '25%',
    },
    {
      name: 'Message',
      selector: (row) => row.message || '-',
      sortable: true,
      width: '15%',
      cell: (row) => (
        <div className="truncate max-w-xs">
          {row.message || '-'}
        </div>
      ),
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="flex justify-center space-x-1">
          <Tooltip title="View">
            <button
              onClick={() => handleViewClick(row)}
              className="bg-gray-100 text-gray-800 p-1 rounded cursor-pointer hover:bg-gray-200"
              aria-label={`View details for ${row.name || 'enquiry'}`}
            >
              <FaEye size={14} />
            </button>
          </Tooltip>
        </div>
      ),
      width: '10%',
    },
  ];

  const handleViewClick = (enquiry) => {
    setEnquiryToView(enquiry);
    setIsOpen(true);
  };

  const handleExcelDownload = () => {
    console.log('Excel download triggered');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="p-4 w-full bg-gray-100">
      <div className="bg-white min-h-[calc(100vh-100px)] p-6 shadow-md rounded-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 px-8">
          <h2 className="text-2xl font-semibold text-gray-800">Contact Enquiries</h2>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search enquiries..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="border border-gray-300 p-2 pl-10 rounded-md w-full md:w-64"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6 px-8">
          <div className="flex justify-between items-center">
            {searchTerm && (
              <p className="text-sm text-gray-600">
                Showing {filteredEnquiries.length} result{filteredEnquiries.length !== 1 ? 's' : ''} for "{searchTerm}"
              </p>
            )}
            <div className="flex gap-3 ms-auto">
            </div>
          </div>
        </div>

        <ReusableTable
          columns={enquiryColumns}
          data={filteredEnquiries}
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
          title="Contact Enquiry Details"
          open={isOpen}
          onCancel={() => setIsOpen(false)}
          footer={[
            <Button key="close" onClick={() => setIsOpen(false)}>
              Close
            </Button>,
          ]}
          width={600}
        >
          {enquiryToView && (
            <div className="space-y-4">
              <div className="flex flex-col items-center mb-4">
                <h3 className="text-xl font-semibold mt-3">{enquiryToView.name}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-gray-600">Name</p>
                  <p>{enquiryToView.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600">Phone Number</p>
                  <p>{enquiryToView.phoneNumber || 'N/A'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="font-medium text-gray-600">Email</p>
                  <p>{enquiryToView.email || 'N/A'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="font-medium text-gray-600">Message</p>
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {enquiryToView.message || 'No message available'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ContactEnquiryTable;