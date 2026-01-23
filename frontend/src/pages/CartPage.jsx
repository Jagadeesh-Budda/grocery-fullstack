import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartPage.css';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

const CartPage = () => {
  const navigate = useNavigate();
  const {
    items: cartItems,
    updateItem,
    removeItem,
    subtotal: totalAmount,
    itemCount,
    loading,
    clearCart
  } = useCart();

  const [updatingId, setUpdatingId] = useState(null);
  const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%2394a3b8'%3ENo Image%3C/text%3E%3C/svg%3E";
  const API_BASE = "http://localhost:8080";

  const formatCurrency = (amount) =>
      new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
      }).format(Number(amount) || 0);

  const getFullImageUrl = (path) => {
    if (!path) return fallbackImage;
    if (path.startsWith('http')) return path;
    return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const handleQtyChange = async (variantId, nextQty) => {
    if (nextQty < 1) return;
    setUpdatingId(variantId);
    try {
      await updateItem(variantId, nextQty);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (variantId) => {
    setUpdatingId(variantId);
    try {
      await removeItem(variantId);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCart();
    }
  };

  if (loading) {
    return (
        <div className="cart-page-loading">
          <p className="animate-pulse text-emerald-600 font-semibold">
            Loading your cart...
          </p>
        </div>
    );
  }

  if (cartItems.length === 0) {
    return (
        <div className="cart-empty-state">
          <div className="empty-icon-wrap">
            <ShoppingBag size={64} className="empty-icon" />
          </div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <button
              className="continue-shopping-btn"
              onClick={() => navigate('/groceries')}
          >
            Continue Shopping
          </button>
        </div>
    );
  }

  return (
      <div className="cart-page-container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <span className="items-count">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </span>
        </div>

        <div className="cart-content">
          <div className="cart-items-list">
            {cartItems.map((item) => {
              const isUpdating = updatingId === item.variantId;

              return (
                  <div key={item.variantId} className="cart-item-card">
                    <div className="item-image-container">
                      <img
                          src={getFullImageUrl(item.imageUrl)}
                          alt={item.productName}
                          className="item-image"
                          onError={(e) => {
                            if (e.target.src !== fallbackImage) {
                              e.target.src = fallbackImage;
                            }
                          }}
                      />
                    </div>

                    <div className="item-details">
                      <h3 className="item-name">{item.productName}</h3>
                      <p className="item-variant">{item.variantName}</p>
                      <span className="item-price">
                    {formatCurrency(item.price)}
                  </span>
                    </div>

                    <div className="item-actions">
                      <div className="quantity-controls">
                        <button
                            className="qty-btn"
                            disabled={loading || isUpdating || item.quantity <= 1}
                            onClick={() =>
                                handleQtyChange(item.variantId, item.quantity - 1)
                            }
                        >
                          <Minus size={16} />
                        </button>

                        <span className="qty-value">{item.quantity}</span>

                        <button
                            className="qty-btn"
                            disabled={loading || isUpdating}
                            onClick={() =>
                                handleQtyChange(item.variantId, item.quantity + 1)
                            }
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                          className="remove-item-btn"
                          disabled={loading || isUpdating}
                          onClick={() => handleRemove(item.variantId)}
                          title="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="item-total-price">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
              );
            })}
          </div>

          <div className="cart-summary-sidebar">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Charges</span>
                <span className="free-tag">FREE</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-row total">
                <span>Total Amount</span>
                <span className="total-value">
                {formatCurrency(totalAmount)}
              </span>
              </div>

              <button
                  className="checkout-btn"
                  disabled={loading}
                  onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </button>

              <button
                  className="clear-cart-btn"
                  disabled={loading}
                  onClick={handleClearCart}
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CartPage;
