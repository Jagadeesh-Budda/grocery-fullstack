import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Heart } from 'lucide-react';

const ProductCard = ({ product, onAddToCart, onToggleFavorite }) => {
    const [hovered, setHovered] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const { name, image, description, pricePerKg } = product || {};

    const cardStyle = {
        width: 220,
        borderRadius: 14,
        overflow: 'hidden',
        background: '#ffffff',
        boxShadow: hovered ? '0 14px 40px rgba(15,23,42,0.08)' : '0 6px 18px rgba(15,23,42,0.06)',
        transform: hovered ? 'scale(1.04) translateY(-4px)' : 'scale(1) translateY(0)',
        transition: 'transform 160ms ease, box-shadow 160ms ease',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
        border: '1px solid rgba(15,23,42,0.06)',
        position: 'relative',
    };

    const imageWrap = {
        width: '100%',
        height: 140,
        background: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
    };

    const imgStyle = {
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'cover',
        display: 'block',
        width: '100%',
        height: '100%',
    };

    const favoriteBtn = {
        position: 'absolute',
        top: 8,
        right: 8,
        background: 'rgba(255,255,255,0.9)',
        border: 'none',
        borderRadius: 8,
        padding: 6,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 160ms ease, transform 160ms ease',
        backdropFilter: 'blur(4px)',
    };

    const body = {
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        alignItems: 'flex-start',
        flex: 1,
    };

    const nameStyle = {
        margin: 0,
        fontSize: 15,
        fontWeight: 700,
        color: '#0f172a',
        lineHeight: 1.3,
    };

    const descStyle = {
        margin: 0,
        fontSize: 12,
        color: '#6b7280',
        lineHeight: 1.4,
    };

    const priceStyle = {
        margin: 0,
        fontSize: 14,
        fontWeight: 700,
        color: '#10b981',
    };

    const btnStyle = {
        marginTop: 'auto',
        padding: '10px 12px',
        borderRadius: 10,
        border: 'none',
        background: 'linear-gradient(180deg, #10b981, #059669)',
        color: '#fff',
        fontWeight: 700,
        cursor: 'pointer',
        alignSelf: 'stretch',
        transition: 'box-shadow 160ms ease, transform 160ms ease',
        boxShadow: '0 4px 12px rgba(16,185,129,0.1)',
    };

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        setIsFavorite(!isFavorite);
        onToggleFavorite && onToggleFavorite(product);
    };

    return (
        <div
            style={cardStyle}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            role="article"
            aria-label={`${name} product card`}
        >
            <div style={imageWrap}>
                {image ? (
                    <img src={image} alt={name} style={imgStyle} loading="lazy" />
                ) : (
                    <div style={{ color: '#9ca3af', fontSize: 13 }}>No image</div>
                )}
                
                <button
                    type="button"
                    style={favoriteBtn}
                    onClick={handleFavoriteClick}
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <Heart
                        size={18}
                        fill={isFavorite ? '#ef4444' : 'none'}
                        color={isFavorite ? '#ef4444' : '#6b7280'}
                    />
                </button>
            </div>

            <div style={body}>
                <h3 style={nameStyle}>{name || 'Unnamed product'}</h3>
                {description && <p style={descStyle}>{description}</p>}
                <p style={priceStyle}>₹{Number(pricePerKg || 0).toFixed(2)} / kg</p>
                <button
                    type="button"
                    style={btnStyle}
                    onClick={() => onAddToCart && onAddToCart(product)}
                    onMouseEnter={(e) => e.target.style.boxShadow = '0 8px 20px rgba(16,185,129,0.15)'}
                    onMouseLeave={(e) => e.target.style.boxShadow = '0 4px 12px rgba(16,185,129,0.1)'}
                >
                    Add to cart
                </button>
            </div>
        </div>
    );
};

ProductCard.propTypes = {
    product: PropTypes.shape({
        name: PropTypes.string,
        image: PropTypes.string,
        description: PropTypes.string,
        pricePerKg: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }).isRequired,
    onAddToCart: PropTypes.func,
    onToggleFavorite: PropTypes.func,
};

export default ProductCard;