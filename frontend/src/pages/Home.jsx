import React, { useState, useEffect } from "react";
import "./Home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loader">Loading Groceries...</div>;
  }

  return (
    <>
      {/* HERO SECTION */}
      <div className="hero">
        <div className="hero-content">
          <h1>We bring the store to your door</h1>
          <p>
            Fresh groceries, fruits & daily essentials delivered fast.
          </p>
          <button className="hero-btn">Shop Now</button>
        </div>

        <div className="hero-image">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2921/2921822.png"
            alt="Groceries"
          />
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="product-grid">
        {products.map((product) => {
          const defaultVariant = product.variants?.[0];

          return (
            <div key={product.id} className="product-card">
              <div className="image-wrap">
                <img
                  src={`http://localhost:8080${product.imageUrl}`}
                  alt={product.name}
                  loading="lazy"
                />
              </div>

              <div className="product-info">
                <h4>{product.name}</h4>
                <p className="variant">{defaultVariant?.name}</p>

                <div className="price-row">
                  <span className="price">
                    ${defaultVariant?.price?.toFixed(2)}
                  </span>
                  <button className="add-btn">+</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Home;
