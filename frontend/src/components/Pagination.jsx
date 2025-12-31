import React from "react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2; // Number of pages to show around current page

    for (let i = 1; i <= totalPages; i++) {
      // Always show first page, last page, and pages around current
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  return (
    <div className="pagination-container">
      <button 
        className="nav-btn"
        disabled={currentPage === 1} 
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </button>

      {getPageNumbers().map((p, index) => (
        <button
          key={index}
          className={`page-btn ${p === currentPage ? "active" : ""} ${p === "..." ? "dots" : ""}`}
          onClick={() => typeof p === "number" && onPageChange(p)}
          disabled={p === "..."}
        >
          {p}
        </button>
      ))}

      <button 
        className="nav-btn"
        disabled={currentPage === totalPages} 
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
}