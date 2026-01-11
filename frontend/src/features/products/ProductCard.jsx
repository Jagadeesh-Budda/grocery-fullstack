import React from "react";

export default function ProductCard({ product, onAdd }) {
    const placeholder = "https://via.placeholder.com/400x300?text=No+Image";
    const { name, price, unit, image } = product || {};

    const baseUrl = "http://localhost:8080";
    const fullImageUrl = image 
        ? (image.startsWith("http") ? image : `${baseUrl}${image.startsWith("/") ? "" : "/"}${image}`)
        : placeholder;

    return (
        <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-lg group">
            {/* Fixed aspect ratio container (4:3) */}
            <div className="relative aspect-[4/3] w-full bg-slate-50 overflow-hidden">
                <img
                    src={fullImageUrl}
                    alt={name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                        if (e.currentTarget.src !== placeholder) {
                            e.currentTarget.src = placeholder;
                        }
                    }}
                />
            </div>

            <div className="flex flex-1 flex-col p-4">
                <div className="mb-auto">
                    <h3 className="line-clamp-2 text-[14px] font-bold text-slate-900 leading-tight mb-1">
                        {name}
                    </h3>
                    <p className="text-[12px] font-medium text-slate-500">
                        {unit}
                    </p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2">
          <span className="text-[15px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
            ₹{price}
          </span>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onAdd();
                        }}
                        className="flex items-center justify-center h-8 px-4 bg-[#3B1E54] hover:bg-[#2D1640] text-white text-[13px] font-bold rounded-full transition-all active:scale-95 shadow-sm"
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}
