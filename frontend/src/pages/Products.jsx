import React, { useEffect, useState, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import ProductCard from "../components/ProductCard";
import "./Products.css";

const PAGE_SIZE = 8;
const BACKEND_URL = "http://localhost:8080";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${BACKEND_URL}/products/grouped?page=${currentPage}&size=${PAGE_SIZE}`
      );

      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();
      const newProducts = data.content || [];
      
      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        setProducts((prev) => [...prev, ...newProducts]);
        setCurrentPage((prev) => prev + 1);
        if (data.last || newProducts.length < PAGE_SIZE) {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, loading, hasMore]);

  useEffect(() => {
    if (inView && hasMore) {
      loadMore();
    }
  }, [inView, hasMore, loadMore]);

  return (
    <div className="products-page">
      <h2>groceRythm Products</h2>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Loading & No more */}
      <div ref={ref} className="scroll-trigger">
        {loading && <div className="loading">Loading products...</div>}
        {!hasMore && products.length > 0 && (
          <div className="no-more">No more products to show.</div>
        )}
      </div>
    </div>
  );
}
