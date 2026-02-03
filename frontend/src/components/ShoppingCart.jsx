import React from "react";
import { useCart } from "../context/CartContext";

const ShoppingCart = () => {
    const { 
        cartItems = [], 
        updateQuantity, 
        removeFromCart, 
        totalAmount = 0, 
        loading = false 
    } = useCart() || {};

    if (loading) {
        return (
            <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-8 text-gray-500 border border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.05)] animate-pulse">
                Loading cart...
            </div>
        );
    }

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-8 text-gray-500 border border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                Your cart is empty
            </div>
        );
    }

    return (
        <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-8 space-y-5 border border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-shadow duration-200">
            <h3 className="font-semibold text-lg">Your Cart</h3>

            {cartItems.map((item) => (
                <div
                    key={item.variantId}
                    className="flex items-center justify-between border-b border-gray-100/60 pb-3 last:border-b-0"
                >
                    <div className="flex-1">
                        <p className="font-medium truncate pr-2">{item.productName || "Item"}</p>
                        <p className="text-sm text-gray-500">
                            {item.variantName} • ₹{item.price} × {item.quantity}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            −
                        </button>

                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>

                        <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            +
                        </button>
                    </div>
                </div>
            ))}

            <div className="pt-4 border-t border-white/30">
                <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{totalAmount}</span>
                </div>

                <button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-[2rem] transition-colors duration-200 font-medium shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                    Checkout
                </button>
            </div>
        </div>
    );
};

export default ShoppingCart;
