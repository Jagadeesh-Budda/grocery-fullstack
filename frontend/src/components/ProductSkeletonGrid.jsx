import React from 'react';
import PropTypes from 'prop-types';

const ProductSkeletonGrid = ({ count = 8 }) => {
  const items = Array.from({ length: count });

  const gridStyle = {
    display: 'grid',
    gap: 16,
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    alignItems: 'start',
  };

  return (
    <>
      <style>{`
        .psg-skeleton { 
          border-radius: 12px;
          overflow: hidden;
          background: #fff;
          border: 1px solid rgba(15,23,42,0.04);
          box-shadow: 0 6px 18px rgba(2,6,23,0.04);
          user-select: none;
          display: flex;
          flex-direction: column;
        }

        .psg-image {
          height: 140px;
          background: linear-gradient(90deg, #f3f4f6 0%, #eceff1 50%, #f3f4f6 100%);
          background-size: 200% 100%;
          animation: psg-shimmer 1.2s linear infinite;
        }

        .psg-body {
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .psg-line {
          height: 12px;
          border-radius: 8px;
          background: linear-gradient(90deg, #f3f4f6 0%, #eceff1 50%, #f3f4f6 100%);
          background-size: 200% 100%;
          animation: psg-shimmer 1.2s linear infinite;
        }

        .psg-line.short { width: 30%; height: 10px; border-radius: 6px; }
        .psg-line.medium { width: 60%; }
        .psg-line.long { width: 80%; height: 14px; border-radius: 8px; }

        .psg-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .psg-pill {
          width: 56px;
          height: 20px;
          border-radius: 999px;
          background: linear-gradient(90deg, #f3f4f6 0%, #eceff1 50%, #f3f4f6 100%);
          background-size: 200% 100%;
          animation: psg-shimmer 1.2s linear infinite;
        }

        .psg-price {
          width: 80px;
          height: 18px;
          border-radius: 8px;
          background: linear-gradient(90deg, #def7ec 0%, #d1fae5 50%, #def7ec 100%);
          background-size: 200% 100%;
          animation: psg-shimmer 1.2s linear infinite;
        }

        .psg-btn {
          margin-top: 8px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(90deg, #f3f4f6 0%, #eceff1 50%, #f3f4f6 100%);
          background-size: 200% 100%;
          animation: psg-shimmer 1.2s linear infinite;
        }

        @keyframes psg-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div style={gridStyle} aria-hidden="true">
        {items.map((_, i) => (
          <div className="psg-skeleton" key={i}>
            <div className="psg-image" />
            <div className="psg-body">
              <div className="psg-row">
                <div className="psg-line long" />
                <div className="psg-pill" />
              </div>

              <div className="psg-line medium" />

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', justifyContent: 'space-between' }}>
                <div className="psg-price" />
                <div style={{ width: 36, height: 12 }} className="psg-line short" />
              </div>

              <div className="psg-btn" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

ProductSkeletonGrid.propTypes = {
  count: PropTypes.number,
};

export default ProductSkeletonGrid;