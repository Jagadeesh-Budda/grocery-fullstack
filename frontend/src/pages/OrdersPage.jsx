import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getMyOrders } from "../api/ordersApi";
import { getApiErrorMessage } from "../api/apiError";

export default function OrdersPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const list = await getMyOrders();
        if (cancelled) return;
        setOrders(Array.isArray(list) ? list : []);
      } catch (err) {
        if (cancelled) return;

        const status = err?.status;
        if (status === 401) {
          navigate("/login", {
            replace: true,
            state: { from: location.pathname },
          });
          return;
        }

        setError(getApiErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [navigate, location.pathname]);

  if (loading) {
    return <div className="px-4 py-6 sm:px-0 sm:py-0 overflow-x-hidden">Loading orders...</div>;
  }

  if (error) {
    return <div className="px-4 py-6 sm:px-0 sm:py-0 overflow-x-hidden">{error}</div>;
  }

  if (!orders.length) {
    return <div className="px-4 py-6 sm:px-0 sm:py-0 overflow-x-hidden">No orders found.</div>;
  }

  return (
    <div className="px-4 sm:px-0 overflow-x-hidden">
      <h1 className="mb-3 sm:mb-0">My Orders</h1>
      <ul className="max-w-full">
        {orders.map((o) => (
          <li
            key={String(o.orderId)}
            style={{ marginBottom: 12 }}
            className="max-w-full py-3 sm:py-0"
          >
            <div className="max-w-full break-all sm:break-normal">Order ID: {String(o.orderId)}</div>
            <div>Status: {String(o.status)}</div>
            <div>Total Amount: {Number(o.totalAmount ?? 0)}</div>
            <div>
              Created: {o.createdAt ? new Date(o.createdAt).toLocaleString() : ""}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
