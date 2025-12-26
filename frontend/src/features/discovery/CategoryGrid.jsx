import React from "react";
import categories from "./categories";
import CategoryCard from "./CategoryCard";

export default function CategoryGrid({ selectedCategory, onSelectCategory }) {
  return (
    <section className="section">
      <style>{`
        .cg-title { font-size: 16px; font-weight: 700; margin: 0 0 14px 0; color: #0f172a; letter-spacing: -0.01em; }
        .cg-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 14px;
          width: 100%;
        }
        .cg-item { display: flex; justify-content: center; }
        @media (max-width: 640px) {
          .cg-grid { grid-template-columns: repeat(3, 1fr); gap: 12px; }
          .cg-title { font-size: 15px; margin-bottom: 12px; }
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          .cg-grid { grid-template-columns: repeat(4, 1fr); gap: 14px; }
        }
        @media (min-width: 1025px) {
          .cg-grid { grid-template-columns: repeat(6, 1fr); gap: 14px; }
        }
      `}</style>

      <h3 className="cg-title">Categories</h3>

      <div className="cg-grid">
        {categories && categories.length > 0 ? (
          categories.map((cat) => (
            <div className="cg-item" key={cat.id}>
              <CategoryCard
                category={cat}
                onClick={() => onSelectCategory && onSelectCategory(cat.slug)}
                selected={selectedCategory === cat.slug}
              />
            </div>
          ))
        ) : (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "#6b7280", fontSize: 13, padding: "20px" }}>
            No categories available
          </div>
        )}
      </div>
    </section>
  );
}
