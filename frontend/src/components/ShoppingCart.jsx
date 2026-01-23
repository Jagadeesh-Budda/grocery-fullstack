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
            <div className="bg-white rounded-xl p-4 text-gray-500 animate-pulse">
                Loading cart...
            </div>
        );
    }

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="bg-white rounded-xl p-4 text-gray-500">
                Your cart is empty
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-4 space-y-4">
            <h3 className="font-semibold text-lg">Your Cart</h3>

            {cartItems.map((item) => (
                <div
                    key={item.variantId}
                    className="flex items-center justify-between border-b pb-2"
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

            <div className="pt-2 border-t">
                <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{totalAmount}</span>
                </div>

                <button className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg transition-colors font-medium">
                    Checkout
                </button>
            </div>
        </div>
    );
};

export default ShoppingCart;
