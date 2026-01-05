import React, { useEffect, useState, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { useCart } from "../context/CartContext";
import "../styles/UserDashboard.css";

const UserDashboard = () => {
  const { addToCart, cartItems } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 8;
  const API_BASE = "http://localhost:8080";

  const { ref, inView } = useInView({ threshold: 0 });

  // Helper to clean branding from names
  const cleanName = (name = "") => name.replace(/groceRythm\s*/gi, "").trim();

  // Indian Rupee Formatter
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(Number(amount) || 0);
  };

  // Helper to get quantity of a variant in cart
  const getCartQuantity = (variantId) => {
    const item = cartItems.find(i => i.variantId === variantId);
    return item ? item.quantity : 0;
  };

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/products/grouped?page=${currentPage}&size=${PAGE_SIZE}`, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const newItems = data.content || [];

      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setProducts((prev) => {
          const existingIds = new Set(prev.map(p => p.id));
          const unique = newItems.filter(p => !existingIds.has(p.id));
          return [...prev, ...unique];
        });
        setCurrentPage((prev) => prev + 1);
        if (data.last) setHasMore(false);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, loading, hasMore]);

  useEffect(() => {
    if (inView && hasMore) loadMore();
  }, [inView, hasMore, loadMore]);

  return (
      <div className="dashboard-container">
        {/* FIX 1: HERO BANNER
         Class names 'hero-banner' and 'hero-copy' now match your CSS exactly
      */}
        <section className="hero-banner">
          <div className="hero-copy">
            <h1 className="hero-title">Fresh Picks for Today</h1>
            <p className="hero-sub">Daily essentials delivered by <strong>groceRythm</strong></p>
            <div className="hero-cta">
              <button className="shop-now">Shop Now</button>
            </div>
          </div>
          <div className="hero-media">
            <div className="hero-image-placeholder">
              <span style={{color: 'white', fontSize: '0.8rem'}}>Fresh Groceries</span>
            </div>
          </div>
        </section>

        {/* FIX 2: PRODUCT GRID
         Accessing variants[0] to fix the "N/A" and Price issue
      */}
        <div className="dashboard-grid">
          {products.map((product) => {
            // Based on GroupedProductDTO.java, we must pull from the variants list
            const firstVariant = product.variants?.[0] || {};
            const price = firstVariant.price || 0;
            const unit =
                firstVariant.variantName ||   // ✅ backend camelCase
                firstVariant.variant_name ||  // (optional safety)
                "Pack";


            // Construct Image URL using the variant's path
            const rawPath = firstVariant.imageUrl || firstVariant.image_url || "";
            const fullImg = rawPath
                ? `${API_BASE}${rawPath.startsWith('/images/') ? rawPath : `/images/${rawPath.replace(/^\//, '')}`}`
                : "https://via.placeholder.com/150?text=No+Image";

            return (
                <div className="gromuse-card" key={product.id}>
                  <div className="card-media">
                    <img
                        src={fullImg}
                        alt={product.name}
                        className="card-image"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=No+Image"; }}
                    />
                  </div>

                  <div className="card-body">
                    <div className="card-title">{cleanName(product.name)}</div>

                    <div className="card-meta">
                      Grocery • {unit}
                    </div>

                    <div className="card-footer">
                      <div className="price">{formatCurrency(price)}</div>
                      <button 
                        className="add-btn"
                        onClick={() => addToCart(product, firstVariant)}
                      >
                        {getCartQuantity(firstVariant.id || firstVariant.variantId) > 0
                          ? `+ ${getCartQuantity(firstVariant.id || firstVariant.variantId)}`
                          : "Add"}
                      </button>
                    </div>
                  </div>
                </div>
            );
          })}
        </div>

        {/* INFINITE SCROLL TRIGGER */}
        <div ref={ref} className="scroll-trigger">
          {loading && <div className="loading">Loading products...</div>}
          {!hasMore && products.length > 0 && <div className="no-more">You've reached the end!</div>}
        </div>
      </div>
  );
};

export default UserDashboard;