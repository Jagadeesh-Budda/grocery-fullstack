/**
 * Buy Again Card
 * 
 * Individual card for a "Buy Again" item with confirmation flow.
 * Uses existing cart logic from CartContext.
 * 
 * Props:
 * - item: BuyAgain item from backend
 * - onNavigate: Optional callback to navigate to product detail
 * 
 * ⚠️ NO cart logic here - reuses existing addToCart from context
 * ⚠️ NO stock calculations - just disables if stock info shows out of stock
 */

import React, { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { ShoppingCart, Package, Check } from "lucide-react";
import { useCart } from "../../context/CartContext";
import ConfirmAddToCartModal from "../cart/ConfirmAddToCartModal";

/**
 * @param {Object} props
 * @param {Object} props.item - BuyAgain item { productVariantId, orderCount, lastOrderedAt, productName?, stock? }
 * @param {(variantId: number) => void} [props.onNavigate] - Optional callback (variantId) => void
 **/
export default function BuyAgainCard({ item, onNavigate }) {
  const { addToCart } = useCart();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Check if item is out of stock (if stock info exists in item)
  const isOutOfStock = item.stock !== undefined && item.stock <= 0;

  // Product name for display (fallback to ID if not provided)
  const productName = item.productName || `Product #${item.productVariantId}`;

  // Handle "Buy Again" button click - opens confirmation modal
  const handleBuyAgainClick = useCallback((e) => {
    e.stopPropagation(); // Prevent card click navigation
    
    if (isOutOfStock) {
      toast.error("This item is currently out of stock");
      return;
    }

    setIsModalOpen(true);
  }, [isOutOfStock]);

  // Handle modal cancel
  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Handle modal confirm - add to cart using existing cart logic
  const handleConfirm = useCallback(async () => {
    setIsLoading(true);

    try {
      // Reuse existing addToCart from CartContext
      // It expects a payload object with variantId, productName, etc.
      await addToCart(
        {
          variantId: item.productVariantId,
          productName: productName,
          variantName: item.variantName || "",
          price: item.price || 0,
          imageUrl: item.imageUrl || "",
        },
        1 // quantity = 1
      );

      // Success feedback
      setJustAdded(true);
      setIsModalOpen(false);
      
      // Reset "just added" state after 2 seconds
      setTimeout(() => setJustAdded(false), 2000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Unable to add item");
    } finally {
      setIsLoading(false);
    }
  }, [addToCart, item, productName]);

  // Handle card click - navigate to product detail
  const handleCardClick = useCallback(() => {
    if (onNavigate) {
      onNavigate(item.productVariantId);
    }
  }, [onNavigate, item.productVariantId]);

  return (
    <>
      <div
        className="
          flex items-center gap-3 p-3 rounded-xl
          glass-card
          cursor-pointer
        "
        onClick={handleCardClick}
      >
        {/* Product Thumbnail */}
        <div className="h-12 w-12 rounded-lg bg-slate-100/80 flex items-center justify-center shrink-0 overflow-hidden">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={productName}
              className="h-full w-full object-cover"
            />
          ) : (
            <Package size={20} className="text-slate-400" />
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 truncate">
            {productName}
          </p>
          <p className="text-xs text-slate-500">
            Ordered {item.orderCount} time{item.orderCount !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Add to Cart Button */}
        <button
          type="button"
          onClick={handleBuyAgainClick}
          disabled={isOutOfStock || isLoading}
          className={`
            shrink-0 p-2.5 rounded-full transition-all duration-200
            focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40
            ${isOutOfStock
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : justAdded
                ? "bg-emerald-600 text-white"
                : "bg-emerald-100/80 text-emerald-600 hover:bg-emerald-200/80"
            }
          `}
          aria-label={isOutOfStock ? "Out of stock" : "Buy again"}
        >
          {justAdded ? (
            <Check size={16} />
          ) : (
            <ShoppingCart size={16} />
          )}
        </button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmAddToCartModal
        open={isModalOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        productName={productName}
        isLoading={isLoading}
      />
    </>
  );
}
