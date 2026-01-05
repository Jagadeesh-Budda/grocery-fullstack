import React, { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { useCart } from "../context/CartContext";
import "./Home.css";
import { getUserProductsPaged, getUserProductsCount } from "../services/userapi";

const Home = () => {
  const { addToCart, cartItems } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Helper to get quantity of a variant in cart
  const getCartQuantity = (variantId) => {
    const item = cartItems.find(i => i.variantId === variantId);
    return item ? item.quantity : 0;
  };

  const pageSize = 20;
  const { ref, inView } = useInView({
    threshold: 0,
  });

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const data = await getUserProductsPaged(currentPage, pageSize);
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setProducts((prev) => [...prev, ...data]);
        setCurrentPage((prev) => prev + 1);
        if (data.length < pageSize) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, loading, hasMore]);

  useEffect(() => {
    if (inView && hasMore) {
      loadMore();
    }
  }, [inView, hasMore, loadMore]);

  /* -------------------- META FORMATTER (NO DUPLICATES) -------------------- */
  const formatMeta = (product) => {
    const parts = [];

    if (product.category) {
      parts.push(product.category);
    }

    if (
      product.variantName &&
      product.variantName !== product.productName &&
      !product.variantName
        .toLowerCase()
        .includes(product.productName.toLowerCase())
    ) {
      parts.push(product.variantName);
    }

    return parts.join(" • ");
  };

  /* -------------------- CURRENCY FORMATTER -------------------- */
  const formatCurrency = (amount) => {
    const numericAmount = Number(amount) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(numericAmount);
  };

  return (
    <div className="home-container">
      {/* -------------------- HERO -------------------- */}
      <div className="hero-compact">
        <strong>groceRythm</strong> — Fresh groceries delivered daily
      </div>

      {/* -------------------- PRODUCT GRID -------------------- */}
      <div className="product-grid">
        {products.map((product) => (
          <div key={`${product.variantId}-${product.productName}`} className="product-card">
            <div className="image-wrap">
              <img
                src={
                  product.imageUrl
                    ? (product.imageUrl.startsWith("/images/") 
                        ? `http://localhost:8080${product.imageUrl}` 
                        : `http://localhost:8080/images${product.imageUrl.startsWith("/") ? product.imageUrl : `/${product.imageUrl}`}`)
                    : "/brand-placeholder.png"
                }
                alt={product.productName}
                loading="lazy"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150?text=No+Image";
                }}
              />
            </div>

            <div className="product-info">
              {/* PRODUCT NAME (ONLY ONCE) */}
              <h4>{product.productName}</h4>

              {/* CATEGORY + UNIT (SMART, NO DUPLICATES) */}
              <p className="meta">{formatMeta(product)}</p>

              {/* PRICE + CART */}
              <div className="price-row">
                <span className="price">{formatCurrency(product.price)}</span>

                <button
                  className="add-btn"
                  onClick={() => addToCart({
                    id: product.productId,
                    name: product.productName
                  }, {
                    variantId: product.variantId,
                    variantName: product.variantName,
                    price: product.price,
                    imageUrl: product.imageUrl
                  })}
                >
                  {getCartQuantity(product.variantId) > 0
                    ? `+ ${getCartQuantity(product.variantId)}`
                    : "+"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* -------------------- LOADING & NO MORE -------------------- */}
      <div ref={ref} className="scroll-trigger">
        {loading && <div className="loading-spinner">Loading more products...</div>}
        {!hasMore && products.length > 0 && (
          <div className="no-more-products">No more products to show.</div>
        )}
      </div>
    </div>
  );
};

export default Home;
