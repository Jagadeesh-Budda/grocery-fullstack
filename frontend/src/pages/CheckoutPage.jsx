import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, CheckCircle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { createOrder } from '../api/ordersApi';
import { getApiErrorMessage } from '../api/apiError';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const {
    cartItems,
    clearCart,
    loading,
  } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(Number(amount) || 0);
  };

  const handlePlaceOrder = async () => {
    if (isPlacingOrder) return;

    setIsPlacingOrder(true);
    setErrorMessage('');

    try {
      const order = await createOrder();

      await clearCart();
      toast.success('Order placed successfully');

      navigate('/order-success', {
        replace: true,
        state: { order },
      });
    } catch (err) {
      const status = err?.status;
      const code = err?.code;

      if (status === 401) {
        toast.error(getApiErrorMessage(err));
        navigate('/login', {
          replace: true,
          state: { from: location.pathname },
        });
        return;
      }

      if (status === 403) {
        const msg = getApiErrorMessage(err);
        setErrorMessage(msg);
        toast.error(msg);
        return;
      }

      if (code === 'OUT_OF_STOCK') {
        const msg = 'Some items are out of stock. Please update your cart and try again.';
        setErrorMessage(msg);
        toast.error(msg);
        return;
      }

      if (code === 'EMPTY_CART') {
        const msg = 'Your cart is empty. Add items before checking out.';
        setErrorMessage(msg);
        toast.error(msg);
        return;
      }

      const msg = getApiErrorMessage(err);
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-empty-state">
        <p className="animate-pulse text-emerald-600 font-semibold">
          Loading checkout...
        </p>
      </div>
    );
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return (
      <div className="checkout-empty-state">
        <div className="empty-icon-wrap">
          <ShoppingBag size={64} className="empty-icon" />
        </div>
        <h2>Your cart is empty</h2>
        <p>You need to add items to your cart before checking out.</p>
        <button className="back-btn w-full sm:w-auto" onClick={() => navigate('/groceries')}>
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page-container overflow-x-hidden !p-4 sm:!p-8">
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
                <div key={item.variantId} className="checkout-item max-w-full">
                  <div className="checkout-item-info min-w-0">
                    <span className="item-name break-words">{item.productName}</span>
                    <span className="item-variant break-words">{item.variantName}</span>
                  </div>
                  <div className="checkout-item-qty">
                    Qty: {item.quantity}
                  </div>
                  <div className="checkout-item-price">
                    {formatCurrency(item.price)} each
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
          <div className="order-summary-card !p-4 sm:!p-8">
            <h3>Order Summary</h3>
            <div className="summary-details">
              <div className="summary-row">
                <span>Total</span>
                <span className="free-tag">Calculated on server</span>
              </div>
              <div className="summary-row">
                <span>Delivery Charges</span>
                <span className="free-tag">FREE</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>Final total</span>
                <span className="total-value">Shown after order placement</span>
              </div>
            </div>
            {errorMessage ? (
              <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
            ) : null}

            <button
              className="place-order-btn"
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              aria-disabled={isPlacingOrder}
            >
              {isPlacingOrder ? 'Placing order...' : 'Place Order'}
            </button>
            <p className="order-notice">
              By placing your order, you agree to FreshCartFlow terms and conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
