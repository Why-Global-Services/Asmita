import React from 'react';
import DataTable from 'react-data-table-component';

const ReusableTable = ({
  data,
  columns,
  loading,
  currentPage,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => {
  // Ensure data is always an array
  const tableData = Array.isArray(data) ? data : [];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#A2BF90',
        color: '#fff',
        fontWeight: '600',
        padding: '12px 10px',
        fontSize: '14px',
        lineHeight: '1.5',
        fontFamily: 'var(--font-fonttitle)',
        textAlign: 'center',
        justifyContent: 'center',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
      },
    },
    cells: {
      style: {
        padding: '12px 10px',
        fontSize: '14px',
        fontFamily: 'var(--font-fontcontent)',
        textAlign: 'center',
        justifyContent: 'center',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        borderRight: '1px solid #e5e7eb',
        '&:last-child': {
          borderRight: 'none',
        },
      },
    },
    rows: {
      style: {
        borderBottom: '1px solid #e5e7eb',
        margin: '0',
        padding: '0',
        width: '100%',
        minHeight: '50px',
      },
    },
    table: {
      style: {
        width: '100%',
        tableLayout: 'fixed',
        borderCollapse: 'collapse',
      },
    },
    subHeader: {
      style: {
        padding: '0',
        margin: '0',
      },
    },
  };

  return (
    <div className="w-full overflow-x-auto rounded px-8">
      <DataTable
        columns={columns}
        data={tableData} // Use safeguarded array
        pagination
        paginationPerPage={rowsPerPage}
        paginationDefaultPage={currentPage}
        onChangePage={onPageChange}
        onChangeRowsPerPage={onRowsPerPageChange}
        fixedHeader
        fixedHeaderScrollHeight="400px"
        customStyles={customStyles}
        highlightOnHover
        responsive
        progressPending={loading}
        className="bg-white rounded shadow"
        noDataComponent={<div className="p-4 text-center">No records found</div>}
      />
    </div>
  );
};

export default ReusableTable;