import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/groceryApi";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);
const GUEST_CART_KEY = "guest_cart_v1";

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------- INITIAL LOAD ----------
  useEffect(() => {
    const initCart = async () => {
      setLoading(true);
      try {
        if (user?.id) {
          // merge guest cart ONCE
          const guest = localStorage.getItem(GUEST_CART_KEY);
          if (guest) {
            const guestItems = JSON.parse(guest).map(i => ({
              productVariant: { id: i.variantId },
              quantity: i.quantity
            }));
            await api.post(`/cart/${user.id}/merge`, guestItems);
            localStorage.removeItem(GUEST_CART_KEY);
          }

          const res = await api.get(`/cart/${user.id}`);
          setItems(normalize(res.data || []));
        } else {
          const guest = localStorage.getItem(GUEST_CART_KEY);
          setItems(guest ? JSON.parse(guest) : []);
        }
      } catch (e) {
        console.error("Cart init failed", e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    initCart();
  }, [user?.id]);

  // ---------- PERSIST GUEST CART ----------
  useEffect(() => {
    if (!user?.id) {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
    }
  }, [items, user?.id]);

  // ---------- ACTIONS ----------
  const addItem = async ({ variantId, productName, variantName, price, imageUrl }, qty = 1) => {
    if (!variantId) return;

    if (user?.id) {
      await api.post(`/cart/${user.id}/add`, null, {
        params: { variantId, quantity: qty },
      });
      const res = await api.get(`/cart/${user.id}`);
      setItems(normalize(res.data || []));
    } else {
      setItems((prev) => upsert(prev, variantId, qty, {
        variantId, productName, variantName, price, imageUrl
      }));
    }
  };

  const updateItem = async (variantId, qty) => {
    if (qty <= 0) return removeItem(variantId);

    if (user?.id) {
      const currentItem = items.find(i => i.variantId === variantId);
      const delta = qty - (currentItem?.quantity || 0);
      if (delta === 0) return;

      await api.put(`/cart/${user.id}/update`, null, {
        params: { variantId, delta },
      });
      const res = await api.get(`/cart/${user.id}`);
      setItems(normalize(res.data || []));
    } else {
      setItems((prev) =>
          prev.map((i) => i.variantId === variantId ? { ...i, quantity: qty } : i)
      );
    }
  };

  const removeItem = async (variantId) => {
    if (user?.id) {
      // Backend doesn't have a direct /remove, but we can use /update with a large negative delta
      // or check if backend has /remove. Looking at CartController, there is NO /remove.
      const currentItem = items.find(i => i.variantId === variantId);
      if (currentItem) {
        await api.put(`/cart/${user.id}/update`, null, {
          params: { variantId, delta: -currentItem.quantity },
        });
      }
      const res = await api.get(`/cart/${user.id}`);
      setItems(normalize(res.data || []));
    } else {
      setItems((prev) => prev.filter((i) => i.variantId !== variantId));
    }
  };

  const clearCart = async () => {
    if (user?.id) await api.delete(`/cart/${user.id}/clear`);
    setItems([]);
  };

  // ---------- DERIVED ----------
  const itemCount = useMemo(
      () => items.reduce((s, i) => s + i.quantity, 0),
      [items]
  );

  const subtotal = useMemo(
      () => items.reduce((s, i) => s + i.price * i.quantity, 0),
      [items]
  );

  return (
      <CartContext.Provider
          value={{
            items,
            loading,
            itemCount,
            subtotal,
            addItem,
            updateItem,
            removeItem,
            clearCart,
          }}
      >
        {children}
      </CartContext.Provider>
  );
};

// ---------- HELPERS ----------
const normalize = (data) =>
    data.map((i) => ({
      variantId: i.variantId,
      productName: i.productName,
      variantName: i.variantName,
      price: Number(i.price),
      quantity: Number(i.quantity),
      imageUrl: i.imageUrl,
    }));

const upsert = (list, variantId, qty, payload) => {
  const existing = list.find((i) => i.variantId === variantId);
  if (existing) {
    return list.map((i) =>
        i.variantId === variantId
            ? { ...i, quantity: i.quantity + qty }
            : i
    );
  }
  return [...list, { ...payload, quantity: qty }];
};

export const useCart = () => useContext(CartContext);
