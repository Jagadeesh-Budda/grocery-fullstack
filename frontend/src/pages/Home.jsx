import React, { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { useCart } from "../context/CartContext";
import "./Home.css";
import { getUserProductsPaged } from "../services/userapi";
import { getLowStockBadgeText, getStockLabel, normalizeStock } from "../utils/stockUi";

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

  const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%2394a3b8'%3ENo Image Available%3C/text%3E%3C/svg%3E";

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount || 0);
  };

  return (
      <div className="home-container">
        <div className="hero-compact">
          <strong><FreshCartFlow></FreshCartFlow></strong> — Fresh groceries delivered daily
        </div>

        <div className="product-grid">
          {products.map((product) => {
            // ✅ Since products are grouped, we use the first variant for display
            const displayVariant = product.variants?.[0] || {};

            const displayStock = normalizeStock(
              displayVariant.stock ??
                displayVariant.stockCount ??
                displayVariant.stockQty ??
                displayVariant.stockQuantity ??
                displayVariant.availableStock ??
                displayVariant.availableQuantity ??
                displayVariant.quantityAvailable
            );
            const isOutOfStock = displayStock === 0;
            const lowStockBadgeText = getLowStockBadgeText(displayStock);
            const stockLabel = getStockLabel(displayStock);

            // Construct image URL based on your WebConfig mapping
            const rawImg = displayVariant.imageUrl || "";
            const fullImgUrl = rawImg
                ? (rawImg.startsWith("http") ? rawImg : `http://localhost:8080${rawImg.startsWith("/") ? "" : "/"}${rawImg}`)
                : fallbackImage;

            return (
                <div key={product.id} className="product-card">
                  <div className="image-wrap">
                    <img
                        src={fullImgUrl}
                        alt={product.name}
                        loading="lazy"
                        onError={(e) => {
                          if (e.target.src !== fallbackImage) {
                            e.target.src = fallbackImage;
                          }
                        }}
                    />
                  </div>

                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p className="meta">
                      {product.categoryName || "Grocery"} • {displayVariant.unit || "Pack"}
                    </p>

                    <div className="mt-1">
                      {lowStockBadgeText ? (
                        <span
                          className={
                            "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 " +
                            (isOutOfStock
                              ? "bg-red-50 text-red-700 ring-red-100"
                              : "bg-orange-50 text-orange-700 ring-orange-100")
                          }
                        >
                          {lowStockBadgeText}
                        </span>
                      ) : (
                        <span className="text-[12px] font-medium text-slate-500">
                          {stockLabel}
                        </span>
                      )}
                    </div>

                    <div className="price-row">
                  <span className="price">
                    {formatCurrency(product.displayPrice || displayVariant.price)}
                  </span>

                      <button
                          className={
                            "add-btn " +
                            (isOutOfStock ? "opacity-50 cursor-not-allowed" : "")
                          }
                          disabled={isOutOfStock}
                          onClick={() =>
                            !isOutOfStock &&
                            addToCart(
                              { id: product.id, name: product.name },
                              {
                                variantId: displayVariant.id,
                                variantName: displayVariant.name || displayVariant.unit,
                                price: displayVariant.price,
                                imageUrl: displayVariant.imageUrl,
                              }
                            )
                          }
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