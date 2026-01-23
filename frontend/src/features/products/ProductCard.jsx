import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const fallbackImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%2394a3b8'%3ENo Image%3C/text%3E%3C/svg%3E";

  const {
    id,
    name,
    imageUrl,
    startingPrice
  } = product;

  const handleClick = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer flex flex-col h-full bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full bg-slate-50 overflow-hidden">
        <img
          src={imageUrl || fallbackImage}
          alt={name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-contain"
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
        />
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="line-clamp-2 text-[14px] font-semibold text-slate-900 mb-1">
          {name}
        </h3>

        <p className="text-[15px] font-bold text-emerald-600">
          ₹{startingPrice}
          <span className="text-[12px] font-normal text-slate-500">
            {" "}onwards
          </span>
        </p>
      </div>
    </div>
  );
}
