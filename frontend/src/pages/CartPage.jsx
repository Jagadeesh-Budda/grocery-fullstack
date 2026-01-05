import React from 'react';
import { useCart } from '../context/CartContext';
import './CartPage.css';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

const CartPage = () => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    totalPrice, 
    totalItems,
    clearCart 
  } = useCart();

  const API_BASE = "http://localhost:8080";

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(Number(amount) || 0);
  };

  const getFullImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/150?text=No+Image";
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/images/') ? path : `/images/${path.replace(/^\//, '')}`;
    return `${API_BASE}${cleanPath}`;
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty-state">
        <div className="empty-icon-wrap">
          <ShoppingBag size={64} className="empty-icon" />
        </div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <button className="continue-shopping-btn" onClick={() => window.history.back()}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <span className="items-count">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
      </div>

      <div className="cart-content">
        <div className="cart-items-list">
          {cartItems.map((item) => (
            <div key={item.variantId} className="cart-item-card">
              <div className="item-image-container">
                <img 
                  src={getFullImageUrl(item.imageUrl)} 
                  alt={item.productName} 
                  className="item-image"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=No+Image"; }}
                />
              </div>
              
              <div className="item-details">
                <div className="item-main-info">
                  <h3 className="item-name">{item.productName}</h3>
                  <p className="item-variant">{item.variantName}</p>
                </div>
                
                <div className="item-pricing">
                  <span className="item-price">{formatCurrency(item.price)}</span>
                </div>
              </div>

              <div className="item-actions">
                <div className="quantity-controls">
                  <button 
                    className="qty-btn" 
                    onClick={() => {
                      if (item.quantity > 1) {
                        updateQuantity(item.variantId, item.quantity - 1);
                      } else {
                        removeFromCart(item.variantId);
                      }
                    }}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button 
                    className="qty-btn" 
                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <button 
                  className="remove-item-btn" 
                  type="button"
                  onClick={() => removeFromCart(item.variantId)}
                  aria-label="Remove item"
                  title="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="item-total-price">
                {formatCurrency(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary-sidebar">
          <div className="summary-card">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Charges</span>
              <span className="free-tag">FREE</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span>Total Amount</span>
              <span className="total-value">{formatCurrency(totalPrice)}</span>
            </div>
            <button className="checkout-btn">
              Proceed to Checkout
            </button>
            <button className="clear-cart-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
