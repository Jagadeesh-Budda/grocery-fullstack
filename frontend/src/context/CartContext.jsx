import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart if user is logged in
  const loadCart = async () => {
    if (user && user.id) {
      try {
        const res = await api.get(`/cart/${user.id}`);
        // Map backend Cart object to cartItems array
        const items = res.data.items.map(item => ({
          id: item.productVariant.id, // using variantId as id
          variantId: item.productVariant.id,
          productId: item.productVariant.productMaster.id,
          productName: item.productVariant.productMaster.name,
          variantName: item.productVariant.variantName,
          price: item.productVariant.price,
          quantity: item.quantity,
          imageUrl: item.productVariant.imageUrl
        }));
        setCartItems(items);
      } catch (err) {
        console.error("Failed to load cart", err);
      }
    } else {
      // Keep local cart for guests
    }
  };

  useEffect(() => {
    loadCart();
  }, [user]);

  const addToCart = async (product) => {
    // Determine variantId and other props based on common product structures
    const variantId = product.variantId || product.id;
    const name = product.productName || product.name;
    const variantName = product.variantName || "";
    const price = product.price;
    const imageUrl = product.imageUrl || product.image;

    if (user && user.id) {
      try {
        await api.post(`/api/cart/${user.id}/add`, null, {
          params: { variantId: variantId, quantity: 1 }
        });
        loadCart();
      } catch (err) {
        console.error("Failed to add to cart", err);
      }
      return;
    }

    // Guest cart logic (local only)
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === variantId);

      if (existing) {
        return prev.map((item) =>
            item.id === variantId
                ? { ...item, quantity: item.quantity + 1 }
                : item
        );
      }

      return [
        ...prev,
        {
          id: variantId,
          variantId: variantId,
          productName: name,
          variantName: variantName,
          price: price,
          quantity: 1,
          imageUrl: imageUrl
        },
      ];
    });
  };

  const increment = async (id) => {
    if (user && user.id) {
      try {
        await api.put(`/api/cart/${user.id}/update`, null, {
          params: { variantId: id, delta: 1 }
        });
        loadCart();
      } catch (err) {
        console.error("Failed to increment", err);
      }
      return;
    }

    setCartItems((prev) =>
        prev.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
    );
  };

  const decrement = async (id) => {
    if (user && user.id) {
      try {
        await api.put(`/api/cart/${user.id}/update`, null, {
          params: { variantId: id, delta: -1 }
        });
        loadCart();
      } catch (err) {
        console.error("Failed to decrement", err);
      }
      return;
    }

    setCartItems((prev) =>
        prev
            .map((item) =>
                item.id === id
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
            .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
  );

  return (
      <CartContext.Provider
          value={{
            cartItems,
            totalItems,
            totalPrice: total,
            addToCart,
            increment,
            decrement,
            updateQuantity: (id, qty) => {
              const item = cartItems.find(i => i.id === id);
              if (item) {
                const delta = qty - item.quantity;
                if (delta !== 0) {
                  if (delta > 0) increment(id);
                  else decrement(id);
                }
              }
            },
            removeFromCart: (id) => {
              const item = cartItems.find(i => i.id === id);
              if (item) {
                // If we want to fully remove, we might need a separate endpoint or call decrement until 0
                // For now, let's just use decrement logic if backend doesn't have a direct remove
                // Actually decrement in backend with large negative delta might work if it supports it
                // But the backend CartController has updateQuantity(delta).
                // Let's call it with -item.quantity to remove.
                if (user && user.id) {
                    api.put(`/api/cart/${user.id}/update`, null, {
                        params: { variantId: id, delta: -item.quantity }
                    }).then(() => loadCart());
                } else {
                    setCartItems(prev => prev.filter(i => i.id !== id));
                }
              }
            },
            clearCart,
            total,
            refreshCart: loadCart
          }}
      >
        {children}
      </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside a CartProvider");
  }
  return context;
};
