import React, { useEffect, useState, useCallback, useRef } from "react";
import { useInView } from "react-intersection-observer";
import ProductCard from "../features/products/ProductCard";
import api from "../api/axios";
import "./Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const scrollRootRef = useRef(null);

  const { ref: sentinelRef, inView } = useInView({
    root: scrollRootRef.current,   // ✅ CRITICAL FIX
    rootMargin: "300px",           // preload before bottom
    threshold: 0,
  });

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const res = await api.get("/products/grouped", {
        params: { page, size: 20 },
      });

      const { content, last } = res.data;

      setProducts(prev => [...prev, ...content]);

      if (last) {
        setHasMore(false);
      } else {
        setPage(prev => prev + 1);
      }
    } catch (err) {
      console.error("Pagination failed:", err);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]);

  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);

  return (
    <div
      ref={scrollRootRef}
      className="products-page"
      style={{ height: "100vh", overflowY: "auto" }}
    >
      <h2 className="text-2xl font-bold mb-6">Our Groceries</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-24 flex justify-center items-center">
        {loading && (
          <p className="text-purple-600 animate-pulse">Loading…</p>
        )}
        {!hasMore && (
          <p className="text-gray-400">You’ve reached the end</p>
        )}
      </div>
    </div>
  );
}
