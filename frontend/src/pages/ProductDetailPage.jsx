import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../services/groceryApi";
import { IMAGE_BASE_URL } from "../api/urls";

function formatInr(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "—";
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `₹${n}`;
  }
}

function formatUnitLabel(raw) {
  const s = (raw ?? "").toString().trim();
  if (!s || s.toLowerCase() === "variant") return "unit";

  const normalized = s
    .replace(/\s+/g, " ")
    .replace(/^(\d+(?:\.\d+)?)(kg|g|gm|l|ml)\b/i, "$1 $2")
    .replace(/\bgm\b/i, "g")
    .replace(/\bpcs\b/i, "unit")
    .replace(/\bpc\b/i, "unit")
    .replace(/\bpacket\b/i, "unit")
    .replace(/\bpack\b/i, "unit")
    .trim();

  if (normalized.toLowerCase() === "unit") return "unit";
  return normalized;
}

function resolveDefaultUnitFromCategory(category) {
  const c = (category ?? "").toString().trim().toLowerCase();
  if (
    c.includes("veget") ||
    c.includes("fruit") ||
    c.includes("grain") ||
    c.includes("pulse")
  ) {
    return "kg";
  }
  if (c.includes("dairy")) return "unit";
  return "unit";
}

function pickCategoryEmoji(category) {
  const c = (category ?? "").toString().toLowerCase();
  if (c.includes("veget")) return "🥦";
  if (c.includes("fruit")) return "🍎";
  if (c.includes("dairy") || c.includes("milk")) return "🥛";
  if (c.includes("grain") || c.includes("wheat") || c.includes("rice")) return "🌾";
  if (c.includes("pulse") || c.includes("lentil")) return "🫘";
  if (c.includes("spice")) return "🧂";
  if (c.includes("oil")) return "🫒";
  return "🛒";
}

function ProductDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10" aria-busy="true" aria-label="Loading product">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-4 w-16 rounded bg-slate-200" />
        <div className="h-4 w-px bg-slate-200" />
        <div className="h-5 w-56 rounded bg-slate-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <section className="rounded-[2rem] bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8">
          <div className="aspect-[4/3] w-full rounded-[2rem] bg-slate-100" />
          <div className="mt-4 flex items-center justify-between">
            <div className="h-3 w-40 rounded bg-slate-200" />
            <div className="h-3 w-24 rounded bg-slate-200" />
          </div>
        </section>

        <section className="rounded-[2rem] bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-10">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="h-8 w-3/4 rounded bg-slate-200" />
              <div className="mt-3 h-4 w-full rounded bg-slate-100" />
              <div className="mt-2 h-4 w-5/6 rounded bg-slate-100" />
            </div>
            <div className="h-7 w-20 rounded-full bg-slate-100" />
          </div>

          <div className="mt-6">
            <div className="h-9 w-44 rounded bg-slate-200" />
            <div className="mt-6">
              <div className="h-4 w-28 rounded bg-slate-200" />
              <div className="mt-3 flex flex-wrap gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-10 w-24 rounded-full bg-slate-100" />
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <div>
                <div className="h-4 w-20 rounded bg-slate-200" />
                <div className="mt-2 h-3 w-40 rounded bg-slate-100" />
              </div>
              <div className="h-11 w-40 rounded-full bg-slate-100" />
            </div>

            <div className="mt-6">
              <div className="h-12 w-full rounded-[2rem] bg-slate-200" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const ProductDetailPage = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  // ---------- helpers ----------
  const getVariantId = (v) => v?.id ?? v?.variantId;

  const getVariantLabel = (v) =>
    v?.variantName || v?.name || v?.size || "Variant";

  const getVariantStock = (v) => {
    const raw =
      v?.stock ??
      v?.stockCount ??
      v?.stockQty ??
      v?.stockQuantity ??
      v?.availableStock ??
      v?.availableQuantity ??
      v?.quantityAvailable;

    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  };

  const getDiscountPercent = (p, v) => {
    const value = Number(
      p?.discount_percent ??
        p?.discountPercent ??
        v?.discount_percent ??
        v?.discountPercent ??
        0
    );
    return Number.isFinite(value) ? value : 0;
  };

  // ---------- fetch product ----------
  useEffect(() => {
    const fetchProduct = async () => {

      try {
        setLoading(true);
        const res = await api.get(`/products/${productId}`);
        const raw = res.data;

        setProduct({
          ...raw,
          variants: raw.variants || raw.productVariants || raw.variantDtos || [],
        });

        setImageError(false);
        setSelectedVariant(null);
        setQuantity(1);
      } catch (err) {
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);
  useEffect(() => {
    if (!selectedVariant && product?.variants?.length > 0) {
      const firstSelectable =
        product.variants.find((v) => getVariantStock(v) !== 0) ||
        product.variants[0];
      setSelectedVariant(firstSelectable);
    }
  }, [product, selectedVariant]);


  // ---------- handlers ----------
  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    setQuantity(1);
    setImageError(false);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    const variantId = getVariantId(selectedVariant);
    if (!variantId) {
      console.error("Variant ID missing", selectedVariant);
      return;
    }

    await addItem(
      {
        variantId,
        productName: product.name,
        variantName:
          selectedVariant.variantName ||
          selectedVariant.name ||
          selectedVariant.size ||
          "",
        price: selectedVariant.price,
        imageUrl:
          selectedVariant.imageUrl ||
          product.imageUrl ||
          "https://via.placeholder.com/400x300?text=No+Image",
      },
      quantity
    );
  };


  // ---------- UI states ----------
  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  if (!product) return null;

  const stock = selectedVariant ? getVariantStock(selectedVariant) : null;
  const isOutOfStock = selectedVariant ? stock === 0 : false;
  const isInStock = selectedVariant ? stock === null || stock > 0 : false;

  const discountPercent = getDiscountPercent(product, selectedVariant);

  const imageSrc = selectedVariant?.imageUrl
  ? `${IMAGE_BASE_URL}${selectedVariant.imageUrl}`
  : product?.imageUrl
    ? `${IMAGE_BASE_URL}${product.imageUrl}`
    : null;

  const canAddToCart = Boolean(selectedVariant) && !isOutOfStock;

  // ---------- render ----------
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          ← Back
        </button>
        <div className="h-4 w-px bg-gray-200" />
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">{product.name}</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left: Product Image Card */}
        <section className="rounded-[2rem] bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8">
          <div className="aspect-[4/3] w-full rounded-[2rem] bg-gray-50/60 flex items-center justify-center overflow-hidden">
            {imageSrc && !imageError ? (
              <img
                src={imageSrc}
                alt={product.name}
                className="w-full max-h-96 object-contain"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full grid place-items-center text-6xl" aria-label="Product image">
                {pickCategoryEmoji(
                  product?.category?.name ?? product?.categoryName ?? product?.category ?? ""
                )}
              </div>
            )}
          </div>

          {/* Small hint row */}
          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            <span>
              {selectedVariant
                ? `Variant: ${getVariantLabel(selectedVariant)}`
                : "No variant selected"}
            </span>
          </div>
        </section>

        {/* Right: Product Info Card */}
        <section className="rounded-[2rem] bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-10">
          {/* Title + badges */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                {product.name}
              </h2>
              <p className="mt-2 text-sm md:text-base text-gray-600">
                {product.description || "Freshly picked, quality guaranteed."}
              </p>
            </div>

            {discountPercent > 0 && (
              <div className="shrink-0">
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                  {discountPercent}% OFF
                </span>
              </div>
            )}
          </div>

          {/* Price + stock status */}
          <div className="mt-5 flex flex-col gap-3">
            <div className="flex items-end justify-between gap-4">
              <div>
                {selectedVariant ? (() => {
                  const rawUnit =
                    selectedVariant?.unit ??
                    product?.unit ??
                    resolveDefaultUnitFromCategory(
                      product?.category?.name ?? product?.categoryName ?? product?.category ?? ""
                    );
                  const unit = formatUnitLabel(rawUnit);
                  return (
                    <div className="text-3xl font-black text-emerald-700 leading-none">
                      {formatInr(selectedVariant.price)}
                      <span className="ml-2 text-sm font-medium text-slate-500">/ {unit}</span>
                    </div>
                  );
                })() : (
                  <div className="text-sm text-gray-500">
                    Select a variant to see the price
                  </div>
                )}
              </div>

              {/* Stock chip */}
              {selectedVariant && (
                <div>
                  {isOutOfStock ? (
                    <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-100">
                      Out of stock
                    </span>
                  ) : isInStock ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                      In stock
                    </span>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          {/* Variants */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900">
              Choose a size
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.variants?.map((variant) => {
                const isSelected =
                  selectedVariant &&
                  getVariantId(selectedVariant) === getVariantId(variant);

                const variantStock = getVariantStock(variant);
                const isDisabled = variantStock === 0;

                return (
                  <button
                    key={getVariantId(variant)}
                    type="button"
                    onClick={() => handleVariantSelect(variant)}
                    disabled={isDisabled}
                    className={
                      "rounded-full px-4 py-2 text-sm font-medium transition " +
                      (isDisabled
                        ? "bg-gray-50 text-gray-400 ring-1 ring-gray-200 cursor-not-allowed"
                        : isSelected
                          ? "bg-emerald-600 text-white ring-2 ring-emerald-200 hover:bg-emerald-700"
                          : "bg-white text-gray-800 ring-1 ring-gray-200 hover:ring-emerald-200 hover:text-emerald-700")
                    }
                  >
                    <span className="inline-flex items-center gap-2">
                      <span>{getVariantLabel(variant)}</span>
                      {isDisabled && (
                        <span className="text-[11px] font-semibold text-gray-400">Sold out</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-6 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-gray-900">
                Quantity
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {isOutOfStock
                  ? "Unavailable"
                  : "Adjust how many you want"}
              </div>
            </div>

            <div className="flex items-center rounded-full bg-gray-50 ring-1 ring-gray-200 px-2 py-1">
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className={
                  "h-9 w-9 rounded-full text-lg font-semibold transition " +
                  (isOutOfStock
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-white active:scale-95")
                }
                aria-label="Decrease quantity"
              >
                
              </button>
              <span className="w-10 text-center text-sm font-semibold text-gray-900">
                {quantity}
              </span>
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={() => setQuantity((q) => q + 1)}
                className={
                  "h-9 w-9 rounded-full text-lg font-semibold transition " +
                  (isOutOfStock
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-white active:scale-95")
                }
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="mt-6">
            <button
              type="button"
              disabled={!canAddToCart}
              onClick={handleAddToCart}
              className={
                "w-full rounded-[2rem] py-4 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition active:scale-[0.99] " +
                (canAddToCart
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-gray-300 cursor-not-allowed")
              }
            >
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>

            {!selectedVariant && (
              <p className="mt-2 text-xs text-gray-500">
                Select a variant to enable adding to cart.
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Nutrition (optional / safe) */}
      {product.nutrients && (
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Nutritional Information</h3>
          <ul className="text-sm text-gray-600 list-disc pl-5">
            {Object.entries(product.nutrients).map(([key, value]) => (
              <li key={key}>
                {key}: {value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
