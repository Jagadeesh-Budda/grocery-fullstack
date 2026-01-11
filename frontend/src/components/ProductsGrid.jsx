import React, { useEffect, useRef, useState } from 'react';
import ProductCard from '../features/products/ProductCard';
import '../styles/ProductCard.css';

const ProductsGrid = ({ initialPage = 0, pageSize = 20 }) => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const sentinelRef = useRef(null);

    // fetchProducts appends new items instead of overwriting
    const fetchProducts = async (page) => {
        if (loading) return;
        setLoading(true);
        try {
            const API_BASE = "http://localhost:8080";
            const res = await fetch(`${API_BASE}/api/products/grouped?page=${page}&size=${pageSize}`);
            if (!res.ok) throw new Error('Network response was not ok');
            const data = await res.json(); 
            const newProducts = data.content || [];
            
            if (newProducts.length === 0 || data.last) {
                setHasMore(false);
            }
            
            if (newProducts.length > 0) {
                setProducts(prev => [...prev, ...newProducts]);
            }
        } catch (err) {
            console.error('fetchProducts error', err);
        } finally {
            setLoading(false);
        }
    };

    // initial + subsequent page loads
    useEffect(() => {
        fetchProducts(currentPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    // IntersectionObserver to increment page when sentinel visible
    useEffect(() => {
        if (!sentinelRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting && !loading && hasMore) {
                    setCurrentPage(prev => prev + 1);
                }
            },
            { root: null, rootMargin: '200px', threshold: 0.1 }
        );

        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [loading, hasMore]);

    return (
        <div className="products-grid-container">
            <div className="products-grid">
                {products.map((p) => {
                    const firstVariant = p.variants?.[0] || {};
                    return (
                        <ProductCard 
                            key={p.variantId || p.id || `${p.masterName}-${Math.random()}`} 
                            product={{
                                name: p.name,
                                price: p.displayPrice || firstVariant.price || 0,
                                unit: firstVariant.unit || "Pack",
                                image: firstVariant.imageUrl
                            }} 
                            onAdd={() => {}}
                        />
                    );
                })}
            </div>

            {/* sentinel triggers loading next page when visible */}
            <div ref={sentinelRef} style={{ height: 1, visibility: 'hidden' }} />

            {loading && <div style={{ textAlign: 'center', padding: 16 }}>Loading...</div>}
            {!hasMore && <div style={{ textAlign: 'center', padding: 16 }}>No more products</div>}
        </div>
    );
};

export default ProductsGrid;