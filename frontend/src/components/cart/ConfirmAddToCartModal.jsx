/**
 * Confirm Add to Cart Modal
 * 
 * A simple confirmation dialog for add-to-cart actions.
 * Contains NO cart logic - just UI for confirmation flow.
 * 
 * Props:
 * - open: boolean - Whether modal is visible
 * - onConfirm: () => void - Called when user confirms
 * - onCancel: () => void - Called when user cancels
 * - productName?: string - Optional product name to display
 * - isLoading?: boolean - Show loading state on confirm button
 */

import React, { useEffect, useRef } from "react";
import { X, ShoppingCart } from "lucide-react";

export default function ConfirmAddToCartModal({
  open,
  onConfirm,
  onCancel,
  productName,
  isLoading = false,
}) {
  const confirmButtonRef = useRef(null);
  const modalRef = useRef(null);

  // Focus confirm button when modal opens (a11y)
  useEffect(() => {
    if (open && confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }
  }, [open]);

  // Handle Escape key
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  // Trap focus inside modal (basic implementation)
  useEffect(() => {
    if (!open) return;

    // Prevent body scroll when modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  if (!open) return null;

  const displayName = productName || "this item";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm animate-[fadeIn_150ms_ease-out]"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-add-title"
        className="
          fixed z-[101] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          w-[min(400px,90vw)] rounded-2xl p-6
          glass-strong
          animate-[scaleIn_200ms_ease-out]
        "
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onCancel}
          className="
            absolute top-3 right-3 p-2 rounded-full
            text-slate-400 hover:text-slate-600 hover:bg-slate-100
            focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40
            transition-colors
          "
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
          <ShoppingCart size={28} className="text-emerald-600" />
        </div>

        {/* Title */}
        <h2
          id="confirm-add-title"
          className="text-lg font-semibold text-slate-900 text-center"
        >
          Add to Cart?
        </h2>

        {/* Description */}
        <p className="mt-2 text-sm text-slate-600 text-center">
          Would you like to add <span className="font-medium text-slate-800">{displayName}</span> to your cart?
        </p>

        {/* Actions */}
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="
              flex-1 py-2.5 px-4 rounded-full
              text-sm font-medium text-slate-700
              bg-slate-100 hover:bg-slate-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40
              transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            Cancel
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="
              flex-1 py-2.5 px-4 rounded-full
              text-sm font-semibold text-white
              bg-emerald-600 hover:bg-emerald-700
              shadow-sm shadow-emerald-600/20
              focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40
              transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2
            "
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </>
  );
}
