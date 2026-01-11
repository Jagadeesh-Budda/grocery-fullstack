import React from "react";
import { useNavigate } from "react-router-dom";
import categories from "./categories";
import CategoryCard from "./CategoryCard";

export default function CategoryGrid({ selectedCategory, onSelectCategory, limit = 8, isHorizontal = true }) {
  const navigate = useNavigate();
  const displayCategories = limit ? categories.slice(0, limit) : categories;

  return (
    <section className="section">
      <div className="flex items-center justify-between mb-[14px] sm:mb-[12px]">
        <h3 className="text-[16px] font-bold m-0 text-[#0f172a] tracking-[-0.01em] sm:text-[15px]">
          Categories
        </h3>
        {isHorizontal && (
          <button
            onClick={() => navigate("/groceries/categories")}
            className="text-[14px] font-semibold text-[#10b981] hover:text-[#059669] transition-colors flex items-center gap-1"
          >
            See all <span className="text-[16px]">→</span>
          </button>
        )}
      </div>

      <div
        className={
          isHorizontal
            ? "flex overflow-x-auto gap-[14px] pb-4 scrollbar-hide snap-x snap-mandatory"
            : "grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-[14px] w-full max-sm:grid-cols-3 max-sm:gap-[12px] sm:max-md:grid-cols-4 sm:max-md:gap-[14px] lg:grid-cols-6 lg:gap-[14px]"
        }
        style={isHorizontal ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}
      >
        {displayCategories && displayCategories.length > 0 ? (
          displayCategories.map((cat) => (
            <div className={isHorizontal ? "flex-shrink-0 snap-start" : "flex justify-center"} key={cat.id}>
              <CategoryCard
                category={cat}
                onClick={() => onSelectCategory && onSelectCategory(cat.slug)}
                selected={selectedCategory === cat.slug}
                small={isHorizontal}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-[#6b7280] text-[13px] py-[20px]">
            No categories available
          </div>
        )}
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
