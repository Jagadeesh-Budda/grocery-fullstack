import React from "react";
import { useCart } from "../context/CartContext";

const ShoppingCart = () => {
    const { cartItems, increment, decrement, total } = useCart();

    if (cartItems.length === 0) {
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
                    key={item.id}
                    className="flex items-center justify-between border-b pb-2"
                >
                    <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                            ₹{item.price} × {item.quantity}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => decrement(item.id)}
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200"
                        >
                            −
                        </button>

                        <span className="w-6 text-center">{item.quantity}</span>

                        <button
                            onClick={() => increment(item.id)}
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200"
                        >
                            +
                        </button>
                    </div>
                </div>
            ))}

            <div className="pt-2 border-t">
                <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{total}</span>
                </div>

                <button className="w-full mt-3 bg-emerald-600 text-white py-2 rounded-lg">
                    Checkout
                </button>
            </div>
        </div>
    );
};

export default ShoppingCart;
