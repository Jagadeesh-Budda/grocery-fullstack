import React, { useEffect, useState } from "react";
import "./Products.css";

const PAGE_SIZE = 8;           // products per page
const MAX_VISIBLE_PAGES = 5;   // pagination buttons

export default function Products() {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch ALL products once
  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔹 Slice products when page changes
  useEffect(() => {
    paginateProducts();
  }, [currentPage, allProducts]);

  // ✅ WORKING fetch (matches your backend)
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/admin/products");
      const data = await res.json(); // ← ARRAY

      setAllProducts(data);
      setTotalPages(Math.ceil(data.length / PAGE_SIZE));
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Frontend pagination
  const paginateProducts = () => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    setProducts(allProducts.slice(start, end));
  };

  // 🔹 Sliding pagination logic
  const getVisiblePages = () => {
    let start = Math.max(
      1,
      currentPage - Math.floor(MAX_VISIBLE_PAGES / 2)
    );
    let end = start + MAX_VISIBLE_PAGES - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="products-page">

      <h2 className="page-title">Products</h2>

      {/* 🔹 Product Grid */}
      {loading ? (
        <p className="loading">Loading products...</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <div className="product-card" key={p.id}>
              <h4>{p.name}</h4>
              <p className="price">₹{p.price}</p>
              <p className="stock">Stock: {p.stock}</p>
              <span className="sku">{p.sku}</span>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 Pagination */}
      {totalPages > 1 && (
        <div className="pagination">

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>

          {currentPage > 3 && <span className="dots">...</span>}

          {getVisiblePages().map((page) => (
            <button
              key={page}
              className={page === currentPage ? "active" : ""}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          {currentPage < totalPages - 2 && <span className="dots">...</span>}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>

        </div>
      )}
    </div>
  );
}
