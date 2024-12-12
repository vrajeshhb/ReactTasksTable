import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  const range = 2; // Number of pages to show before/after the current page

  for (
    let i = Math.max(1, currentPage - range);
    i <= Math.min(totalPages, currentPage + range);
    i++
  ) {
    pageNumbers.push(i);
  }

  return (
    <div style={styles.paginationContainer}>
      <button
        style={styles.navButton}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        &larr; Previous
      </button>

      {currentPage > range + 1 && <span style={styles.ellipsis}>1 ...</span>}

      {pageNumbers.map((number) => (
        <button
          key={number}
          style={
            number === currentPage
              ? { ...styles.pageButton, ...styles.activePage }
              : styles.pageButton
          }
          onClick={() => onPageChange(number)}
        >
          {number}
        </button>
      ))}

      {currentPage < totalPages - range && (
        <span style={styles.ellipsis}>... {totalPages}</span>
      )}

      <button
        style={styles.navButton}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next &rarr;
      </button>
    </div>
  );
};

// Styles for the pagination
const styles = {
  paginationContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px",
    padding: "10px",
    // border: "1px solid #ccc",
    borderRadius: "5px",
    // backgroundColor: "#f9f9f9",
  },
  navButton: {
    padding: "5px 10px",
    border: "1px solid #ccc",
    borderRadius: "3px",
    backgroundColor: "#fff",
    color: "#003366",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "12px",
  },
  pageButton: {
    padding: "5px 10px",
    border: "1px solid #ccc",
    borderRadius: "3px",
    backgroundColor: "#f5f5f5",
    color: "#003366",
    cursor: "pointer",
    fontSize: "9px",
  },
  activePage: {
    backgroundColor: "#2c5cc5",
    color: "#fff",
    fontWeight: "bold",
  },
  ellipsis: {
    color: "#999",
    fontSize: "14px",
  },
};

export default Pagination;
