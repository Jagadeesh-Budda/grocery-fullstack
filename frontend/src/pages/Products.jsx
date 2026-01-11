import React, { useEffect, useState, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import ProductCard from "../features/products/ProductCard";
import api from "../api/axios";
import "./Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const {ref, inView} = useInView({threshold: 0});

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    // 🛑 LOG THIS TO YOUR BROWSER CONSOLE (F12)
    console.log("!!! DEBUG: CALLING THE GROUPED ENDPOINT NOW !!!");

    try {
      const res = await api.get("/products/grouped", {
        params: {page: currentPage, size: 20}
      });

      console.log("!!! DEBUG: BACKEND RESPONDED WITH:", res.data.content.length, "items");

      const data = res.data;
      const newProducts = data.content || [];

      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        setProducts((prev) => [...prev, ...newProducts]);
        setCurrentPage((prev) => prev + 1);
        if (data.last) setHasMore(false);
      }
    } catch (error) {
      console.error("!!! DEBUG: API FAILED !!!", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [currentPage, loading, hasMore]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMore();
    }
  }, [inView, hasMore, loading, loadMore]);

  // ... (keep your existing imports and loadMore logic)

  return (
      <div className="products-page">
        <h2 className="text-2xl font-bold mb-6">Our Groceries</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products.map((product) => {
            // ✅ ACCESS THE FIRST VARIANT FOR DISPLAY
            const firstVariant = product.variants?.[0] || {};

            return (
                <ProductCard
                    key={product.id} // Use Master ID
                    product={{
                      name: product.name,
                      // Use displayPrice from GroupedProductDTO or fallback to variant price
                      price: product.displayPrice || firstVariant.price || 0,
                      unit: firstVariant.unit || "Pack",
                      image: firstVariant.imageUrl
                    }}
                    onAdd={() => console.log('Adding variant:', firstVariant.id)}
                />
            );
          })}
        </div>

        {/* Infinite scroll trigger */}
        <div ref={ref} className="h-20 flex justify-center items-center">
          {loading && <p className="text-purple-600 animate-pulse">Loading...</p>}
          {!hasMore && products.length > 0 && <p className="text-gray-400">Showing all items</p>}
        </div>
      </div>
  );
}