import React, { useState } from "react";
import PropTypes from "prop-types";

export default function CategoryCard({ category, onClick, selected = false, small = false }) {
  const { name = "Unnamed", icon = "🛒", color, image } = category || {};
  const [imgError, setImgError] = useState(false);
  const showImage = image && !imgError;

  return (
    <button
      type="button"
      onClick={() => onClick && onClick(category)}
      aria-pressed={selected}
      className={`
        ${small ? "w-[110px] h-[120px] p-2" : "w-[140px] h-[160px] p-[14px]"} 
        flex flex-col items-center gap-2 rounded-[24px] bg-white cursor-pointer
        transition-all duration-[160ms] ease-[cubic-bezier(0.4,0,0.2,1)]
        ${
          selected
            ? "border-2 border-[#10b981] shadow-[0_8px_24px_rgba(16,185,129,0.12)] scale-[1.06] -translate-y-1"
            : "border border-[rgba(15,23,42,0.06)] shadow-[0_4px_12px_rgba(15,23,42,0.05)] scale-100 translate-y-0 hover:scale-[1.04] hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
        }
      `}
    >
      <div
        className={`${small ? "w-[50px] h-[50px] text-[24px]" : "w-[60px] h-[60px] text-[28px]"} rounded-[12px] flex items-center justify-center overflow-hidden shrink-0`}
        style={{ backgroundColor: color || "#f3f4f6" }}
        aria-hidden="true"
      >
        {showImage ? (
          <img
            src={image}
            alt={`${name} category`}
            className="w-full h-full object-cover block"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <span className="flex items-center justify-center">
            {icon}
          </span>
        )}
      </div>

      <div className="text-center w-full min-w-0">
        <div
          className={`
            font-semibold ${small ? "text-[12px]" : "text-[13px]"} truncate transition-colors duration-[160ms] ease-out
            ${selected ? "text-[#10b981]" : "text-[#0f172a]"}
          `}
          title={name}
        >
          {name}
        </div>
      </div>
    </button>
  );
}

CategoryCard.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    icon: PropTypes.node,
    color: PropTypes.string,
    image: PropTypes.string,
  }),
  onClick: PropTypes.func,
  selected: PropTypes.bool,
};
