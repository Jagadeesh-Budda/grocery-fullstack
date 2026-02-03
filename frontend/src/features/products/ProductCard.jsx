import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { resolvePrice } from "../../utils/price";

function formatUnitLabel(raw) {
  const s = (raw ?? "").toString().trim();
  if (!s || s.toLowerCase() === "variant") return "pack";

  // normalize common patterns like "500g" -> "500 g" and "1kg" -> "1 kg"
  const normalized = s
    .replace(/\s+/g, " ")
    .replace(/^(\d+(?:\.\d+)?)(kg|g|gm|l|ml)\b/i, "$1 $2")
    .replace(/\bgm\b/i, "g")
    .replace(/\bpcs\b/i, "pack")
    .replace(/\bpc\b/i, "pack")
    .replace(/\bpacket\b/i, "pack")
    .replace(/\bpack\b/i, "pack")
    .trim();

  // Prefer lowercase for pack
  if (normalized.toLowerCase() === "pack") return "pack";
  return normalized;
}

function resolveDefaultUnitFromCategory(category) {
  const c = (category ?? "").toString().trim().toLowerCase();

  // VEGETABLES, FRUITS, GRAINS, PULSES -> kg
  if (
    c.includes("veget") ||
    c.includes("fruit") ||
    c.includes("grain") ||
    c.includes("pulse")
  ) {
    return "kg";
  }

  // DAIRY -> pack
  if (c.includes("dairy")) return "pack";

  return "pack";
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

function getVariants(product) {
  const variants =
    product?.variants ||
    product?.productVariants ||
    product?.variantDtos ||
    product?.items ||
    [];
  return Array.isArray(variants) ? variants : [];
}

const ProductCard = React.memo(function ProductCard({ product }) {
  const navigate = useNavigate();
  const [imageFailed, setImageFailed] = useState(false);

  const variants = useMemo(() => getVariants(product), [product]);
  const firstVariant = useMemo(() => variants[0] ?? null, [variants]);

  const productId = product?.id ?? product?.productId ?? product?.product_id ?? null;

  const name =
    product?.name ??
    product?.productName ??
    product?.masterName ??
    "Unnamed product";

  const categoryName =
    product?.category?.name ??
    product?.categoryName ??
    product?.category ??
    "";

  // Unit resolution requirements:
  // 1) If product.unit exists, always use it.
  // 2) Else derive from category.
  const resolvedUnitRaw =
    (product?.unit ?? null) || resolveDefaultUnitFromCategory(categoryName);
  const unitLabel = formatUnitLabel(resolvedUnitRaw);

  const imageUrl =
    firstVariant?.imageUrl ??
    product?.imageUrl ??
    product?.image ??
    product?.imgUrl ??
    "";

  const priceNumber =
    resolvePrice(firstVariant) ||
    resolvePrice(product) ||
    Number(product?.startingPrice ?? 0);

  const priceText = formatInr(priceNumber);

  const canNavigate = Boolean(productId);

  const handleNavigate = useCallback(() => {
    if (!canNavigate) return;
    navigate(`/groceries/products/${productId}`);
  }, [canNavigate, navigate, productId]);

  const handleKeyDown = useCallback(
    (e) => {
      if (!canNavigate) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleNavigate();
      }
    },
    [canNavigate, handleNavigate]
  );

  const handleButtonClick = useCallback(
    (e) => {
      e?.preventDefault?.();
      e?.stopPropagation?.();
      handleNavigate();
    },
    [handleNavigate]
  );

  return (
    <article
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      role={canNavigate ? "link" : undefined}
      tabIndex={canNavigate ? 0 : -1}
      className={
        "group relative flex h-full flex-col overflow-hidden rounded-[20px] bg-[rgba(255,255,255,0.10)] backdrop-blur-[15px] backdrop-saturate-[160%] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-[transform,shadow,background] duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40 " +
        (canNavigate
          ? "cursor-pointer hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.14)] hover:bg-[rgba(255,255,255,0.18)] "
          : "cursor-default ")
      }
      style={{ contentVisibility: "auto", containIntrinsicSize: "280px 300px" }}
    >
      <div
        className={
          "relative h-44 w-full flex items-center justify-center " +
          (canNavigate ? "cursor-pointer" : "")
        }
      >
        {imageUrl && !imageFailed ? (
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            className="h-full w-auto max-w-[85%] object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-transform duration-200 group-hover:-translate-y-1 group-hover:drop-shadow-[0_12px_28px_rgba(0,0,0,0.16)]"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <div className="grid h-20 w-20 place-items-center rounded-2xl bg-white/40 backdrop-blur-sm text-4xl shadow-sm" aria-hidden="true">
              {pickCategoryEmoji(categoryName)}
            </div>
            <span className="sr-only">Image not available</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3
          className={
            "line-clamp-1 text-[15px] font-bold text-white tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] " +
            (canNavigate ? "cursor-pointer" : "")
          }
          style={{ fontFamily: "var(--font-display)" }}
        >
          {name}
        </h3>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-lg font-black text-white leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
              {priceText}
              <span className="ml-1 text-xs font-medium text-white/70">
                /{unitLabel}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleButtonClick}
            aria-label={`Add ${name} to cart`}
            className="shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40 bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.97]"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
});

export default ProductCard;
