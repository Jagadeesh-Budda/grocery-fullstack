import React, { useState, useEffect } from "react";
import Pagination from "../components/Pagination"; // Ensure this path is correct
import "./Home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 20;

  // Fetch Total Pages Count
  useEffect(() => {
    fetch("http://localhost:8080/api/products/count")
      .then((res) => res.json())
      .then((count) => {
        setTotalPages(Math.ceil(count / pageSize));
      })
      .catch((err) => console.error("Error fetching count:", err));
  }, []);

  // Fetch Paginated Products
  useEffect(() => {
    setLoading(true);
    // Spring Boot expects 0-indexed pages, so we subtract 1 from currentPage
    const pageIndex = currentPage - 1;
    
    fetch(`http://localhost:8080/api/products?page=${pageIndex}&size=${pageSize}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  if (loading && products.length === 0) {
    return <div className="loader">Loading Groceries...</div>;
  }

  return (
    <div className="home-container">
      {/* HERO SECTION */}
      <div className="hero">
        <div className="hero-content">
          <h1>We bring the store to your door</h1>
          <p>Fresh groceries, fruits & daily essentials delivered fast.</p>
          <button className="hero-btn">Shop Now</button>
        </div>
        <div className="hero-image">
          <img src="https://cdn-icons-png.flaticon.com/512/2921/2921822.png" alt="Groceries" />
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.variantId} className="product-card">
            <div className="image-wrap">
              {/* Using a placeholder if imageUrl is missing */}
              <img
                src={product.imageUrl ? `http://localhost:8080${product.imageUrl}` : "https://via.placeholder.com/150"}
                alt={product.productName}
                loading="lazy"
              />
            </div>
            <div className="product-info">
              <h4>{product.productName}</h4>
              <p className="category-label">{product.category}</p>
              <p className="variant">{product.variantName}</p>
              <div className="price-row">
                <span className="price">₹{product.price}</span>
                <button className="add-btn">+</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION COMPONENT */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default Home;