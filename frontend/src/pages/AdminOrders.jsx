import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Badge from "../common/Badge";
import { getAdminOrders } from "../services/adminapi";

const ORDER_STATUSES = [
  "PENDING",
  "CREATED",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

function statusVariant(status) {
  switch (status) {
    case "DELIVERED":
      return "success";
    case "SHIPPED":
    case "CONFIRMED":
      return "info";
    case "PACKED":
    case "CREATED":
    case "PENDING":
      return "warning";
    case "CANCELLED":
      return "danger";
    default:
      return "default";
  }
}

function formatMoney(amount) {
  if (amount == null) return "—";
  const value = typeof amount === "number" ? amount : Number(amount);
  if (Number.isNaN(value)) return String(amount);
  return value.toLocaleString(undefined, { style: "currency", currency: "INR" });
}

export default function AdminOrders() {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [status, setStatus] = useState("");
  const [qInput, setQInput] = useState("");
  const [q, setQ] = useState("");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const request = useMemo(
    () => ({ page, size, status: status || undefined, q: q || undefined }),
    [page, size, status, q]
  );

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAdminOrders(request);
        if (mounted) setData(res);
      } catch (err) {
        if (!mounted) return;
        setError(err);
        toast.error("Failed to load orders");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [request]);

  const content = data?.content || [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  const onSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    setQ(qInput.trim());
  };

  return (
    <div className="p-6 space-y-5 overflow-auto">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Orders</h1>
      </div>

      <form onSubmit={onSearchSubmit} className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-600">Status</label>
          <select
            className="border px-3 py-2 rounded"
            value={status}
            onChange={(e) => {
              setPage(0);
              setStatus(e.target.value);
            }}
          >
            <option value="">All</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-[240px]">
          <label className="text-xs font-semibold text-gray-600">Search</label>
          <input
            className="border px-3 py-2 rounded w-full"
            placeholder="Order ID or user email"
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-600">Page size</label>
          <select
            className="border px-3 py-2 rounded"
            value={size}
            onChange={(e) => {
              setPage(0);
              setSize(Number(e.target.value));
            }}
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </form>

      <div className="bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {loading ? "Loading…" : `${totalElements} orders`}
          </div>

          <div className="flex items-center gap-2">
            <button
              className="border px-3 py-1.5 rounded disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={loading || page <= 0}
              type="button"
            >
              Prev
            </button>
            <div className="text-sm text-gray-700">
              Page {totalPages === 0 ? 0 : page + 1} / {totalPages}
            </div>
            <button
              className="border px-3 py-1.5 rounded disabled:opacity-50"
              onClick={() => setPage((p) => (p + 1 < totalPages ? p + 1 : p))}
              disabled={loading || page + 1 >= totalPages}
              type="button"
            >
              Next
            </button>
          </div>
        </div>

        {error ? (
          <div className="p-6 text-sm text-red-700">Failed to load orders.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-600 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold">Order</th>
                  <th className="px-6 py-4 font-bold">User</th>
                  <th className="px-6 py-4 font-bold">Items</th>
                  <th className="px-6 py-4 font-bold">Total</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {content.length === 0 && !loading ? (
                  <tr>
                    <td className="px-6 py-6 text-gray-600" colSpan={6}>
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  content.map((order) => (
                    <tr
                      key={order.orderId}
                      className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/admin/orders/${order.orderId}`)}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        #{order.orderId}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {order.userEmail || "—"}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {order.itemsCount ?? 0}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {formatMoney(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={statusVariant(order.status)}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {order.createdAt ? new Date(order.createdAt).toLocaleString() : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
