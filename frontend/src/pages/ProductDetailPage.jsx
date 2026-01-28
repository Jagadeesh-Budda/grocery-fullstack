import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../services/groceryApi";
import { IMAGE_BASE_URL } from "../api/urls";

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
          variants:
            raw.variants ||
            raw.productVariants ||
            raw.variantDtos ||
            [],
        });

                    setImageError(false);
        setSelectedVariant(null); // 🔒 explicit user selection required
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
    setSelectedVariant(product.variants[0]);
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
    return <div className="p-6 text-center">Loading product…</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  if (!product) return null;

  const stock = selectedVariant ? getVariantStock(selectedVariant) : null;
  const isOutOfStock = selectedVariant ? stock === 0 : false;
  const isLowStock = selectedVariant ? typeof stock === "number" && stock > 0 && stock <= 5 : false;
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
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
           Back
        </button>
        <div className="h-4 w-px bg-gray-200" />
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
          {product.name}
        </h1>
      </div>

      {/* Main: 2-column (desktop-first), stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left: Product Image Card */}
        <section className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 p-4">
          <div className="aspect-[4/3] w-full rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden">
            {imageSrc && !imageError ? (
              <img
                src={imageSrc}
                alt={product.name}
                className="w-full max-h-96 object-contain"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center px-6 text-center">
                <div className="text-sm font-medium text-gray-900">
                  {product.name}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {selectedVariant
                    ? "Image unavailable"
                    : "Select a variant to preview"}
                </div>
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
            {typeof stock === "number" && selectedVariant && (
              <span className="font-medium text-gray-600">Stock: {stock}</span>
            )}
          </div>
        </section>

        {/* Right: Product Info Card */}
        <section className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 p-5 md:p-6">
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
                {selectedVariant ? (
                  <div className="text-3xl font-extrabold text-emerald-600">
                    	{selectedVariant.price}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    Select a variant to see the price
                  </div>
                )}
                {selectedVariant && (
                  <div className="mt-1 text-xs text-gray-500">
                    Price for {getVariantLabel(selectedVariant)}
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
                  ) : isLowStock ? (
                    <span className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-100">
                      Low stock
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
                    {getVariantLabel(variant)}
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
                
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
                "w-full rounded-xl py-3.5 text-sm font-semibold text-white shadow-sm transition active:scale-[0.99] " +
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
