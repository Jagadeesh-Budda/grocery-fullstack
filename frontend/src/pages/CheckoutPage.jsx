import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, CheckCircle, ArrowLeft } from 'lucide-react';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const API_BASE = "http://localhost:8080";

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(Number(amount) || 0);
  };

  const handlePlaceOrder = () => {
    alert("Order placed successfully! Thank you for shopping with groceRythm.");
    clearCart();
    navigate('/groceries');
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-empty-state">
        <div className="empty-icon-wrap">
          <ShoppingBag size={64} className="empty-icon" />
        </div>
        <h2>Your cart is empty</h2>
        <p>You need to add items to your cart before checking out.</p>
        <button className="back-btn" onClick={() => navigate('/groceries')}>
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page-container">
      <div className="checkout-header">
        <button className="back-link" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Back to Cart
        </button>
        <h1>Checkout</h1>
      </div>

      <div className="checkout-content">
        <div className="checkout-main">
          <section className="order-items-section">
            <h3>Review Your Order</h3>
            <div className="checkout-items-list">
              {cartItems.map((item) => (
                <div key={item.variantId} className="checkout-item">
                  <div className="checkout-item-info">
                    <span className="item-name">{item.productName}</span>
                    <span className="item-variant">{item.variantName}</span>
                  </div>
                  <div className="checkout-item-qty">
                    Qty: {item.quantity}
                  </div>
                  <div className="checkout-item-price">
                    {formatCurrency(item.price)} each
                  </div>
                  <div className="checkout-item-total">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="payment-method-section">
            <h3>Payment Method</h3>
            <div className="payment-option selected">
              <div className="option-info">
                <CheckCircle size={20} className="check-icon" />
                <span>Cash on Delivery</span>
              </div>
              <span className="option-desc">Pay when your groceries arrive at your door.</span>
            </div>
          </section>
        </div>

        <div className="checkout-sidebar">
          <div className="order-summary-card">
            <h3>Order Summary</h3>
            <div className="summary-details">
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
            </div>
            <button className="place-order-btn" onClick={handlePlaceOrder}>
              Place Order
            </button>
            <p className="order-notice">
              By placing your order, you agree to groceRythm's terms and conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
