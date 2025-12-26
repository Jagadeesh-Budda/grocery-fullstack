import React from 'react';
import PropTypes from 'prop-types';
import ProductCard from './ProductCard';
import { ChevronRight } from 'lucide-react';

const ProductGrid = ({ 
  products = [], 
  onAddToCart, 
  onToggleFavorite,
  onViewMore,
  title = 'Popular Products',
  showViewMore = false 
}) => {
    return (
        <section className="section">
            <style>
                {`
                .pg-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; gap: 12px; }
                .pg-title { font-size: 16px; font-weight: 700; margin: 0; color: #0f172a; letter-spacing: -0.01em; }
                .pg-grid { 
                  display: grid; 
                  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                  gap: 16px;
                  width: 100%;
                }
                .pg-card { justify-self: center; width: 100%; display: flex; justify-content: center; }
                .pg-empty { padding: 40px 20px; text-align: center; color: #6b7280; font-size: 13px; }
                .pg-view-more { display: flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: 8px; background: transparent; border: 1px solid rgba(15,23,42,0.06); color: #10b981; font-weight: 600; font-size: 12px; cursor: pointer; transition: background 160ms ease, transform 160ms ease; }
                .pg-view-more:hover { background: rgba(16,185,129,0.06); transform: translateY(-1px); }
                @media (max-width: 640px) {
                  .pg-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
                  .pg-title { font-size: 15px; }
                }
                @media (min-width: 768px) and (max-width: 1023px) {
                  .pg-grid { grid-template-columns: repeat(3, 1fr); }
                }
                @media (min-width: 1024px) {
                  .pg-grid { grid-template-columns: repeat(4, 1fr); }
                }
                `}
            </style>

            <div className="pg-header">
              <h2 className="pg-title">{title}</h2>
              {showViewMore && (
                <button 
                  className="pg-view-more"
                  onClick={onViewMore}
                  type="button"
                  aria-label="View all products"
                >
                  View all
                  <ChevronRight size={14} />
                </button>
              )}
            </div>

            <div className="pg-grid">
                {products && products.length > 0 ? (
                    products.map((prod) => (
                        <div className="pg-card" key={prod.id ?? prod._id ?? prod.name}>
                            <ProductCard 
                              product={prod} 
                              onAddToCart={onAddToCart}
                              onToggleFavorite={onToggleFavorite}
                            />
                        </div>
                    ))
                ) : (
                    <div className="pg-empty" style={{ gridColumn: '1 / -1' }}>
                      <p style={{ margin: 0 }}>No products available.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

ProductGrid.propTypes = {
    products: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            name: PropTypes.string,
            image: PropTypes.string,
            description: PropTypes.string,
            pricePerKg: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        })
    ),
    onAddToCart: PropTypes.func,
    onToggleFavorite: PropTypes.func,
    onViewMore: PropTypes.func,
    title: PropTypes.string,
    showViewMore: PropTypes.bool,
};

export default ProductGrid;