import React, { useEffect, useState } from "react";
import "./Products.css";

const PAGE_SIZE = 8;
const MAX_VISIBLE_PAGES = 5;

export default function Products() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch paginated products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:8080/admin/products?page=${currentPage - 1}&size=${PAGE_SIZE}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await res.json();

      // ✅ Spring Boot Page response
      setProducts(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Failed to load products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  // 🔹 Pagination numbers
  const getVisiblePages = () => {
    let start = Math.max(1, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2));
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
          {products.length === 0 ? (
            <p>No products found</p>
          ) : (
            products.map((product) => (
              <div className="product-card" key={product.id}>
                <img
                  src={`http://localhost:8080${product.imageUrl}`}
                  alt={product.productName}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
                <h4>{product.productName}</h4>
                <p className="price">₹{product.price}</p>
                <p className="stock">Stock: {product.stock}</p>
                <span className="sku">{product.sku}</span>
              </div>
            ))
          )}
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

          {getVisiblePages().map((page) => (
            <button
              key={page}
              className={page === currentPage ? "active" : ""}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

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
