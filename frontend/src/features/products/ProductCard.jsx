import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Heart } from 'lucide-react';

const ProductCard = ({ product, onAddToCart, onToggleFavorite }) => {
    const [hovered, setHovered] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const { name, image, description, pricePerKg, category } = product || {};

    const cardStyle = {
        width: 260,
        borderRadius: 12,
        overflow: 'hidden',
        background: '#ffffff',
        boxShadow: hovered ? '0 10px 30px rgba(2,6,23,0.08)' : '0 6px 18px rgba(2,6,23,0.06)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform 180ms ease, box-shadow 180ms ease',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
        border: '1px solid rgba(15,23,42,0.04)',
        position: 'relative',
    };

    const imageWrap = {
        width: '100%',
        height: 140,
        background: '#f8fafc',
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
        top: 10,
        right: 10,
        background: 'rgba(255,255,255,0.95)',
        border: 'none',
        borderRadius: 8,
        padding: 6,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 160ms ease, transform 160ms ease',
        boxShadow: '0 2px 8px rgba(2,6,23,0.06)',
    };

    const body = {
        padding: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        alignItems: 'flex-start',
        flex: 1,
    };

    const headerRow = {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
    };

    const nameStyle = {
        margin: 0,
        fontSize: 15,
        fontWeight: 800,
        color: '#0f172a',
        lineHeight: 1.2,
        flex: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    };

    const categoryLabel = {
        fontSize: 12,
        color: '#6b7280',
        background: '#f3f4f6',
        padding: '4px 8px',
        borderRadius: 999,
        fontWeight: 600,
        whiteSpace: 'nowrap',
    };

    const descStyle = {
        margin: 0,
        fontSize: 12,
        color: '#6b7280',
        lineHeight: 1.4,
    };

    const priceRow = {
        display: 'flex',
        alignItems: 'baseline',
        gap: 6,
        width: '100%',
        marginTop: 4,
    };

    const priceStyle = {
        margin: 0,
        fontSize: 16,
        fontWeight: 800,
        color: '#059669', // highlighted green
    };

    const unitStyle = {
        fontSize: 12,
        color: '#065f46',
        opacity: 0.85,
        marginLeft: 4,
    };

    const btnStyle = {
        marginTop: '12px',
        padding: '10px 12px',
        borderRadius: 10,
        border: 'none',
        background: 'linear-gradient(180deg, #10b981, #059669)',
        color: '#fff',
        fontWeight: 700,
        cursor: 'pointer',
        alignSelf: 'stretch',
        transition: 'box-shadow 160ms ease, transform 160ms ease',
        boxShadow: '0 4px 12px rgba(16,185,129,0.08)',
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
                <div style={headerRow}>
                    <h3 style={nameStyle} title={name || 'Unnamed product'}>{name || 'Unnamed product'}</h3>
                    {category && <span style={categoryLabel}>{category}</span>}
                </div>

                {description && <p style={descStyle}>{description}</p>}

                <div style={priceRow}>
                    <p style={priceStyle}>₹{Number(pricePerKg || 0).toFixed(2)}</p>
                    <small style={unitStyle}>/ kg</small>
                </div>

                <button
                    type="button"
                    style={btnStyle}
                    onClick={() => onAddToCart && onAddToCart(product)}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 20px rgba(16,185,129,0.12)'}
                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(16,185,129,0.08)'}
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
        category: PropTypes.string,
    }).isRequired,
    onAddToCart: PropTypes.func,
    onToggleFavorite: PropTypes.func,
};

export default ProductCard;