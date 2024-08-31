// Pagination.jsx
import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";

const Pagination = ({ totalItems, itemsPerPage, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [visiblePages, setVisiblePages] = useState([]);

  useEffect(() => {
    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(startPage + 4, totalPages);

    if (endPage - startPage < 4) {
      startPage = Math.max(endPage - 4, 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    setVisiblePages(pages);
  }, [currentPage, totalPages]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    onPageChange(newPage);
  };

  return (
    <div className="pagination-controls flex justify-center my-4 space-x-1 md:space-x-2">
      <Button
        className={`${
          currentPage === 1 || totalPages <= 1
            ? "bg-[#2b323d] hover:bg-[#2b323d]"
            : "bg-[#3b4354] hover:bg-[#4b535d]"
        } text-xs sm:text-sm px-1 sm:px-3 py-1`}
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1 || totalPages <= 1}
      >
        &lt;&lt;
      </Button>
      <Button
        className={`${
          currentPage === 1 || totalPages <= 1
            ? "bg-[#2b323d] hover:bg-[#2b323d]"
            : "bg-[#3b4354] hover:bg-[#4b535d]"
        } text-xs sm:text-sm px-1 sm:px-3 py-1`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || totalPages <= 1}
      >
        &lt;
      </Button>
      {visiblePages.map((page) => (
        <Button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`${
            page === currentPage
              ? "bg-[#2b323d] hover:bg-[#2b323d]"
              : "bg-[#3b4354] hover:bg-[#4b535d]"
          } text-xs sm:text-sm px-2 sm:px-3 py-1`}
        >
          {page}
        </Button>
      ))}
      <Button
        className={`${
          currentPage === totalPages || totalPages <= 1
            ? "bg-[#2b323d] hover:bg-[#2b323d]"
            : "bg-[#3b4354] hover:bg-[#4b535d]"
        } text-xs sm:text-sm px-1 sm:px-3 py-1`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages <= 1}
      >
        &gt;
      </Button>
      <Button
        className={`${
          currentPage === totalPages || totalPages <= 1
            ? "bg-[#2b323d] hover:bg-[#2b323d]"
            : "bg-[#3b4354] hover:bg-[#4b535d]"
        } text-xs sm:text-sm px-1 sm:px-3 py-1`}
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages || totalPages <= 1}
      >
        &gt;&gt;
      </Button>
    </div>
  );
};

export default Pagination;
