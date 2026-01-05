import React from 'react';
import '../../styles/ProductCard.css';

const ProductCard = ({ product = {} }) => {
  const variants = product.variants || [];
  const variant = variants[0] || {};
  
  const name = product.name || product.masterName || variant.variantName || 'Unnamed product';
  const price = variant.price || product.price;
  const unit = variant.unit || product.unit;
  const stock = variant.stock || product.stock;
  
  const IMAGE_BASE = "http://localhost:8080";
  const rawPath = variant.image_url || variant.imageUrl || product.imageUrl || product.imagePath || "";
  const imagePath = rawPath ? (rawPath.startsWith("/images/") ? rawPath : (rawPath.startsWith("/") ? `/images${rawPath}` : `/images/${rawPath}`)) : "";
  const src = imagePath ? `${IMAGE_BASE}${imagePath}` : null;

  const formatCurrency = (amount) => {
    const numericAmount = Number(amount) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(numericAmount);
  };

  return (
    <div className="product-card">
      <div className="card-media">
        {src ? (
          <img
            className="product-image"
            src={src}
            alt={name}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/150?text=No+Image";
            }}
          />
        ) : (
          <div className="product-image placeholder-image">No Image</div>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{name || 'Unnamed product'}</h3>

        <div className="product-price">
          {price !== undefined ? formatCurrency(price) : '-'}
        </div>

        <div className="product-unit">
          {unit ?? '-'}
        </div>

        <div className={`product-stock ${typeof stock === 'number' ? (stock > 0 ? 'in-stock' : 'out-of-stock') : ''}`}>
          {typeof stock === 'number' ? (stock > 0 ? `In stock: ${stock}` : 'Out of stock') : 'Stock: -'}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;