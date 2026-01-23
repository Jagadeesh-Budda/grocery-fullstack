import React, { useEffect, useState, useCallback, useRef } from "react";
import ProductCard from "./ProductCard";
import { useCart } from "../../context/CartContext";
import { fetchGroceries } from "../../services/groceryApi";

export default function ProductGrid({ category = "" }) {
    const { addItem } = useCart();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef(null);

    const loadProducts = useCallback(async (pageNum, currentCategory) => {
        try {
            setLoading(true);
            const data = await fetchGroceries(pageNum, 20, currentCategory);
            const newProducts = data.content || [];
            
            setProducts(prev => pageNum === 0 ? newProducts : [...prev, ...newProducts]);
            setHasMore(!data.last && (data.totalPages > data.number + 1));
            setError("");
        } catch (err) {
            console.error("Failed to load products", err);
            if (err.response && err.response.status === 401) {
                setProducts([]); 
                setError(""); 
            } else {
                setError("Failed to load products");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        setPage(0);
        setProducts([]);
        loadProducts(0, category);
    }, [category, loadProducts]);

    useEffect(() => {
        if (page > 0) {
            loadProducts(page, category);
        }
    }, [page, loadProducts, category]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    setPage(prev => prev + 1);
                }
            },
            { threshold: 0.1 }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [hasMore, loading]);


    if (error) {
        return (
            <div className="py-12 text-center text-sm text-red-500">
                {error}
            </div>
        );
    }

    if (!loading && products.length === 0) {
        return (
            <div className="py-12 text-center text-sm text-gray-500">
                No products found in database
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div
                className="
                    grid
                    grid-cols-2
                    gap-6
                    sm:grid-cols-3
                    md:grid-cols-4
                    lg:grid-cols-5
                    items-stretch
                    auto-rows-fr
                "
            >
                {products.map((product, index) => (
                    <ProductCard
                        key={`${product.id}-${index}`}
                        product={product}
                    />
                ))}
            </div>

            {/* Infinite Scroll Loader Trigger */}
            <div ref={loaderRef} className="py-8 text-center">
                {loading && (
                    <div className="text-sm text-gray-500 animate-pulse">
                        Loading more products...
                    </div>
                )}
                {!hasMore && products.length > 0 && (
                    <div className="text-sm text-gray-400">
                        You've reached the end
                    </div>
                )}
            </div>
        </div>
    );
}
