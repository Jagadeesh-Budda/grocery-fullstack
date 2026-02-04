import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "./AuthContext";
import { getApiErrorMessage, normalizeApiError } from "../api/apiError";

const CartContext = createContext();

const GUEST_CART_KEY = "guest_cart";

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const pendingRemovalsRef = useRef(new Map());
  const pendingQtyUpdatesRef = useRef(new Map());
  const UNDO_TIMEOUT_MS = 4500;
  const QTY_DEBOUNCE_MS = 400;

  const cancelPendingQtySync = (variantId) => {
    const pending = pendingQtyUpdatesRef.current.get(variantId);
    if (pending?.timerId) clearTimeout(pending.timerId);
    pendingQtyUpdatesRef.current.delete(variantId);
  };

  const cancelAllPendingQtySync = () => {
    for (const pending of pendingQtyUpdatesRef.current.values()) {
      if (pending?.timerId) clearTimeout(pending.timerId);
    }
    pendingQtyUpdatesRef.current.clear();
  };

  const queueQtySyncDelta = (variantId, delta) => {
    if (!user?.id) return;
    if (!Number.isInteger(delta) || delta === 0) return;

    const existing = pendingQtyUpdatesRef.current.get(variantId);
    const nextDelta = (existing?.delta ?? 0) + delta;
    if (existing?.timerId) clearTimeout(existing.timerId);

    const userId = user.id;
    const timerId = setTimeout(async () => {
      const pending = pendingQtyUpdatesRef.current.get(variantId);
      if (!pending) return;

      pendingQtyUpdatesRef.current.delete(variantId);
      if (!pending.userId) return;

      try {
        await api.put(`/cart/${pending.userId}/update`, null, {
          params: { variantId, delta: pending.delta },
        });
      } catch (e) {
        const normalized = normalizeApiError(e);
        if (normalized.status === 401) {
          window.location.assign("/login");
          return;
        }
        toast.error(getApiErrorMessage(normalized));
        console.error(normalized.raw ?? e);
      }
    }, QTY_DEBOUNCE_MS);

    pendingQtyUpdatesRef.current.set(variantId, {
      delta: nextDelta,
      timerId,
      userId,
    });
  };

  /* ----------------------------------------
     NORMALIZE BACKEND / STORAGE RESPONSES
  ---------------------------------------- */
  const normalize = (data) => {
    const list = Array.isArray(data)
      ? data
      : data?.items ?? data?.cartItems ?? data?.data ?? [];

    if (!Array.isArray(list)) return [];

    return list.map((i) => {
      const item = i ?? {};
      const v = item.productVariant || item.variant || item;
      const product = v?.product || item.product || {};

      const priceValue = Number(
        v?.price ?? item.price ?? item.unitPrice ?? 0
      );
      const quantityValue = Number(
        item.quantity ?? item.qty ?? 1
      );

      return {
        variantId:
          v?.id ??
          item.variantId ??
          item.productVariantId ??
          item.productVariant?.id ??
          item.variant?.id ??
          null,

        productName:
          product?.name ??
          item.productName ??
          item.name ??
          "",

        variantName:
          v?.variantName ??
          v?.name ??
          item.variantName ??
          "",

        price: Number.isFinite(priceValue) ? priceValue : 0,
        quantity: Number.isFinite(quantityValue) ? quantityValue : 1,

        imageUrl:
          product?.imageUrl ??
          product?.image ??
          v?.imageUrl ??
          item.imageUrl ??
          "",
      };
    });
  };

  /* ----------------------------------------
     INIT CART (ON LOGIN / REFRESH)
  ---------------------------------------- */
  useEffect(() => {
    const initCart = async () => {
      setLoading(true);
      if (user?.id) {
        const initKey = `cart_initialized_user_${user.id}`;
        const cacheKey = `cart_cache_user_${user.id}`;

        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          setItems(JSON.parse(cached));
          setLoading(false);
          return;
        }

        try {
          const res = await api.get(`/cart/${user.id}`);
          const normalized = normalize(res.data);
          setItems(normalized);
          sessionStorage.setItem(cacheKey, JSON.stringify(normalized));
          sessionStorage.setItem(initKey, "1");
        } catch (e) {
          const normalized = normalizeApiError(e);
          if (normalized.status === 401) {
            window.location.assign("/login");
            return;
          }
          toast.error(getApiErrorMessage(normalized));
          console.error("Failed to load cart", normalized.raw ?? e);
        } finally {
          setLoading(false);
        }
      } else {
        const guest = localStorage.getItem(GUEST_CART_KEY);
        setItems(guest ? JSON.parse(guest) : []);
        setLoading(false);
      }
    };

    initCart();
  }, [user?.id]);

  // If auth context changes/unmounts, prevent syncing queued deltas to wrong user.
  useEffect(() => {
    return () => {
      cancelAllPendingQtySync();
    };
  }, [user?.id]);

  /* ----------------------------------------
     PERSIST GUEST CART
  ---------------------------------------- */
  useEffect(() => {
    if (!user?.id) {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
    }
  }, [items, user?.id]);

  /* ----------------------------------------
     PERSIST AUTH CART CACHE
  ---------------------------------------- */
  useEffect(() => {
    if (user?.id) {
      sessionStorage.setItem(
        `cart_cache_user_${user.id}`,
        JSON.stringify(items)
      );
    }
  }, [items, user?.id]);

  /* ----------------------------------------
     ADD ITEM
  ---------------------------------------- */
  const addItem = async (payload, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.variantId === payload.variantId
      );

      if (existing) {
        return prev.map((i) =>
          i.variantId === payload.variantId
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }

      return [
        ...prev,
        {
          variantId: payload.variantId,
          productName: payload.productName,
          variantName: payload.variantName,
          price: payload.price,
          quantity: qty,
          imageUrl: payload.imageUrl,
        },
      ];
    });

    toast.success(`${payload.productName} added to cart`);

    if (user?.id) {
      try {
        await api.post(`/cart/${user.id}/add`, null, {
          params: { variantId: payload.variantId, quantity: qty },
        });
      } catch (e) {
        const normalized = normalizeApiError(e);
        if (normalized.status === 401) {
          window.location.assign("/login");
          return;
        }
        toast.error(getApiErrorMessage(normalized));
        console.error(normalized.raw ?? e);
      }
    }
  };

  /* ----------------------------------------
     UPDATE QUANTITY (DELTA-BASED)
     - Supports legacy callers passing nextQty
     - Auto-removes item when next quantity <= 0
     - Optimistic UI update; backend sync after
     - No rollback on backend failure
  ---------------------------------------- */
  const updateQuantity = async (variantId, delta) => {
    const current = items.find((i) => i.variantId === variantId);
    if (!current) return;

    const raw = Number(delta);
    if (!Number.isFinite(raw)) return;

    let deltaToApply;
    // Preferred: delta-based API (+1 / -1)
    if (raw === 1 || raw === -1) {
      deltaToApply = raw;
    } else {
      // Legacy: some callers pass nextQty (absolute)
      const desired = Math.trunc(raw);
      deltaToApply = desired - current.quantity;
    }

    if (!Number.isInteger(deltaToApply) || deltaToApply === 0) return;

    const nextQty = current.quantity + deltaToApply;
    if (nextQty <= 0) {
      await removeItem(variantId);
      return;
    }

    setItems((prev) =>
      prev.map((i) =>
        i.variantId === variantId
          ? { ...i, quantity: i.quantity + deltaToApply }
          : i
      )
    );

    // Debounced backend sync; UI stays optimistic.
    queueQtySyncDelta(variantId, deltaToApply);
  };


  /* ----------------------------------------
     UPDATE ITEM (ABSOLUTE QUANTITY)
     Used by some pages/components
  ---------------------------------------- */
  const updateItem = async (variantId, nextQty) => {
    const current = items.find((i) => i.variantId === variantId);
    if (!current) return;

    const desired = Number(nextQty);
    if (!Number.isFinite(desired) || desired < 0) return;

    if (desired === 0) {
      await removeItem(variantId);
      return;
    }

    const delta = Math.trunc(desired) - current.quantity;
    await updateQuantity(variantId, delta);
  };

  /* ----------------------------------------
     INCREMENT
  ---------------------------------------- */
  const incrementItem = async (variantId) => {
    await updateQuantity(variantId, 1);
  };

  /* ----------------------------------------
     DECREMENT (FIXED)
  ---------------------------------------- */
  const decrementItem = async (variantId) => {
    await updateQuantity(variantId, -1);
  };

  /* ----------------------------------------
     REMOVE ITEM (FIXED)
  ---------------------------------------- */
  const removeItem = async (variantId) => {
    // Cancel pending quantity syncs for this item (it may be removed or undone).
    cancelPendingQtySync(variantId);

    const existingPending = pendingRemovalsRef.current.get(variantId);
    if (existingPending?.timerId) {
      clearTimeout(existingPending.timerId);
      pendingRemovalsRef.current.delete(variantId);
    }

    let removedItem;
    setItems((prev) => {
      removedItem = prev.find((i) => i.variantId === variantId);
      return prev.filter((i) => i.variantId !== variantId);
    });

    if (!removedItem) return;

    const removedName =
      removedItem.productName ?? removedItem.variantName ?? "Item";
    const userIdAtRemoval = user?.id;

    const undo = (toastId) => {
      const pending = pendingRemovalsRef.current.get(variantId);
      if (pending?.timerId) {
        clearTimeout(pending.timerId);
      }
      pendingRemovalsRef.current.delete(variantId);

      setItems((prev) => {
        const alreadyThere = prev.some(
          (i) => i.variantId === variantId
        );
        return alreadyThere ? prev : [...prev, removedItem];
      });

      toast.dismiss(toastId);
      toast.success(`${removedName} restored`);
    };

    const toastId = toast(
      (t) => (
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span>{removedName} removed</span>
          <button
            onClick={() => undo(t.id)}
            style={{
              background: "#059669",
              color: "white",
              border: 0,
              borderRadius: 8,
              padding: "6px 10px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Undo
          </button>
        </div>
      ),
      { duration: UNDO_TIMEOUT_MS }
    );

    const timerId = setTimeout(async () => {
      pendingRemovalsRef.current.delete(variantId);

      // Sync backend only after undo window expires.
      if (!userIdAtRemoval) return;

      try {
        await api.put(`/cart/${userIdAtRemoval}/update`, null, {
          params: { variantId, delta: -9999 },
        });
      } catch (e) {
        const normalized = normalizeApiError(e);
        if (normalized.status === 401) {
          window.location.assign("/login");
          return;
        }
        toast.error(getApiErrorMessage(normalized));
        console.error(normalized.raw ?? e);
      }
    }, UNDO_TIMEOUT_MS);

    pendingRemovalsRef.current.set(variantId, {
      timerId,
      item: removedItem,
      toastId,
      userId: userIdAtRemoval ?? null,
    });
  };

  /* ----------------------------------------
     CLEAR CART
  ---------------------------------------- */
  const clearCart = async () => {
    // Cancel any pending removals (we're clearing everything anyway)
    for (const pending of pendingRemovalsRef.current.values()) {
      if (pending?.timerId) clearTimeout(pending.timerId);
    }
    pendingRemovalsRef.current.clear();

    // Cancel any pending debounced quantity syncs
    cancelAllPendingQtySync();

    setItems([]);
    toast.success("Cart cleared");

    if (user?.id) {
      sessionStorage.removeItem(
        `cart_cache_user_${user.id}`
      );
      sessionStorage.removeItem(
        `cart_initialized_user_${user.id}`
      );

      try {
        await api.delete(`/cart/${user.id}/clear`);
      } catch (e) {
        const normalized = normalizeApiError(e);
        if (normalized.status === 401) {
          window.location.assign("/login");
          return;
        }
        toast.error(getApiErrorMessage(normalized));
        console.error(normalized.raw ?? e);
      }
    }
  };

  /* ----------------------------------------
     DERIVED VALUES
  ---------------------------------------- */
  const itemCount = useMemo(
    () => items.reduce((s, i) => s + i.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (s, i) => s + i.price * i.quantity,
        0
      ),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        // preferred names
        items,
        updateQuantity,
        updateItem,
        loading,

        // aliases used by different parts of the app
        cartItems: items,
        addToCart: addItem,
        removeFromCart: removeItem,
        totalAmount: subtotal,

        itemCount,
        subtotal,
        addItem,
        incrementItem,
        decrementItem,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
