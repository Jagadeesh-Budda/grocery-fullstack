import React from 'react';
import { useCart } from '../context/CartContext';
import '../styles/ProductCard.css';

const ProductCard = ({ product = {} }) => {
    const { addToCart } = useCart();
    const { masterName, variants = [] } = product;
    const variant = variants[0] || {};
    const { price, unit, image_url, imageUrl } = variant;

    const IMAGE_BASE = "http://localhost:8080";
    const rawPath = image_url || imageUrl || "";
    const imagePath = rawPath ? (rawPath.startsWith("/images/") ? rawPath : (rawPath.startsWith("/") ? `/images${rawPath}` : `/images/${rawPath}`)) : "";
    const fullImagePath = imagePath ? `${IMAGE_BASE}${imagePath}` : "";

    const formatCurrency = (amount) => {
        const numericAmount = Number(amount) || 0;
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(numericAmount);
    };

    return (
        <div className="product-card" tabIndex="0" aria-label={masterName}>
            <div className="card-media">
                {fullImagePath ? (
                    <img 
                        src={fullImagePath} 
                        alt={masterName} 
                        className="product-image" 
                        onError={(e) => {
                            e.target.src = "https://via.placeholder.com/150?text=No+Image";
                        }}
                    />
                ) : (
                    <div className="product-image placeholder-image">No Image</div>
                )}

                <div className="card-overlay" aria-hidden="true">
                    <div className="overlay-content">
                        <h4 className="overlay-title">{masterName}</h4>

                        <div className="variants-overlay">
                            {product.variants && product.variants.map((v, idx) => (
                                <div className="variant-row" key={v.id ?? idx}>
                                    <div className="variant-info">
                                        <div className="variant-name">{v.variantName}</div>
                                        <div className="variant-price">{formatCurrency(v.price)}</div>
                                    </div>
                                    <button 
                                        className="add-btn" 
                                        type="button"
                                        onClick={() => addToCart(product, v)}
                                    >
                                        Add
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="product-info">
                <div className="product-title">{masterName}</div>
                {price && <div className="product-price">{formatCurrency(price)}</div>}
                {unit && <div className="product-unit">{unit}</div>}
            </div>
        </div>
    );
};

export default ProductCard;