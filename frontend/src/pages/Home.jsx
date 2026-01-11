import React, { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { useCart } from "../context/CartContext";
import "./Home.css";
import { getUserProductsPaged } from "../services/userapi";

const Home = () => {
  const { addToCart, cartItems } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const getCartQuantity = (variantId) => {
    const item = cartItems.find(i => i.variantId === variantId);
    return item ? item.quantity : 0;
  };

  const pageSize = 10;
  const { ref, inView } = useInView({ threshold: 0 });

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const data = await getUserProductsPaged(currentPage, pageSize);

      if (!data || data.length === 0) {
        setHasMore(false);
      } else {
        setProducts((prev) => [...prev, ...data]);
        setCurrentPage((prev) => prev + 1);
        if (data.length < pageSize) setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading products:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [currentPage, loading, hasMore]);

  useEffect(() => {
    if (inView && hasMore) {
      loadMore();
    }
  }, [inView, hasMore, loadMore]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount || 0);
  };

  return (
      <div className="home-container">
        <div className="hero-compact">
          <strong>groceRythm</strong> — Fresh groceries delivered daily
        </div>

        <div className="product-grid">
          {products.map((product) => {
            // ✅ Since products are grouped, we use the first variant for display
            const displayVariant = product.variants?.[0] || {};

            // Construct image URL based on your WebConfig mapping
            const rawImg = displayVariant.imageUrl || "";
            const fullImgUrl = rawImg
                ? (rawImg.startsWith("http") ? rawImg : `http://localhost:8080${rawImg.startsWith("/") ? "" : "/"}${rawImg}`)
                : "/brand-placeholder.png";

            return (
                <div key={product.id} className="product-card">
                  <div className="image-wrap">
                    <img
                        src={fullImgUrl}
                        alt={product.name}
                        loading="lazy"
                    />
                  </div>

                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p className="meta">
                      {product.categoryName || "Grocery"} • {displayVariant.unit || "Pack"}
                    </p>

                    <div className="price-row">
                  <span className="price">
                    {formatCurrency(product.displayPrice || displayVariant.price)}
                  </span>

                      <button
                          className="add-btn"
                          onClick={() => addToCart(
                              { id: product.id, name: product.name },
                              {
                                variantId: displayVariant.id,
                                variantName: displayVariant.name || displayVariant.unit,
                                price: displayVariant.price,
                                imageUrl: displayVariant.imageUrl
                              }
                          )}
                      >
                        {getCartQuantity(displayVariant.id) > 0
                            ? `+ ${getCartQuantity(displayVariant.id)}`
                            : "+"}
                      </button>
                    </div>
                  </div>
                </div>
            );
          })}
        </div>

        <div ref={ref} className="scroll-trigger">
          {loading && <div className="loading-spinner">Loading products...</div>}
          {!hasMore && products.length > 0 && (
              <div className="no-more-products">End of catalogue</div>
          )}
          {!loading && products.length === 0 && (
              <div className="no-products">No products found in database</div>
          )}
        </div>
      </div>
  );
};

export default Home;