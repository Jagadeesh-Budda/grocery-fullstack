import React, { useState } from "react";
import PropTypes from "prop-types";

export default function CategoryCard({ category, onClick, selected = false }) {
  const { id, name = "Unnamed", icon = "🛒", color, image } = category || {};
  const [imgError, setImgError] = useState(false);
  const showImage = image && !imgError;

  return (
    <button
      type="button"
      onClick={() => onClick && onClick(category)}
      aria-pressed={selected}
      style={{
        width: 140,
        height: 160,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        padding: 14,
        borderRadius: 16,
        background: "#ffffff",
        border: selected ? "2px solid #10b981" : "1px solid rgba(15,23,42,0.06)",
        boxShadow: selected
          ? "0 8px 24px rgba(16,185,129,0.12)"
          : "0 4px 12px rgba(15,23,42,0.05)",
        cursor: "pointer",
        transition: "all 160ms cubic-bezier(0.4, 0, 0.2, 1)",
        transform: selected ? "scale(1.06) translateY(-4px)" : "scale(1) translateY(0)",
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.transform = "scale(1.04) translateY(-3px)";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(15,23,42,0.08)";
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.transform = "scale(1) translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(15,23,42,0.05)";
        }
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          overflow: "hidden",
          backgroundColor: color || "#f3f4f6",
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        {showImage ? (
          <img
            src={image}
            alt={`${name} category`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {icon}
          </span>
        )}
      </div>

      <div style={{ textAlign: "center", width: "100%", minWidth: 0 }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: 13,
            color: selected ? "#10b981" : "#0f172a",
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            transition: "color 160ms ease",
          }}
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
