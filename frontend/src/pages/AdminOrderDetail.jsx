import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Badge from "../common/Badge";
import {
  getAdminOrderById,
  updateAdminOrderStatus,
} from "../services/adminapi";

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

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const orderId = useMemo(() => Number(id), [id]);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const load = async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const res = await getAdminOrderById(orderId);
      setOrder(res);
    } catch (err) {
      if (err?.response?.status === 404) {
        setNotFound(true);
      } else {
        toast.error("Failed to load order");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!Number.isFinite(orderId)) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const onChangeStatus = async (e) => {
    const nextStatus = e.target.value;
    if (!nextStatus || nextStatus === order?.status) return;

    setSaving(true);
    try {
      await updateAdminOrderStatus(orderId, nextStatus);
      toast.success("Order status updated");
      await load();
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to update status";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading…</div>;
  }

  if (notFound) {
    return (
      <div className="p-6 space-y-4">
        <div className="text-xl font-semibold">Order not found</div>
        <button
          className="border px-4 py-2 rounded"
          onClick={() => navigate("/admin/orders")}
        >
          Back to Orders
        </button>
      </div>
    );
  }

  if (!order) {
    return <div className="p-6">Unable to load order.</div>;
  }

  return (
    <div className="p-6 space-y-5 overflow-auto">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-sm text-gray-600">
            <Link to="/admin/orders" className="hover:underline">
              Orders
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-semibold">#{order.orderId}</span>
          </div>
          <h1 className="text-2xl font-semibold">Order #{order.orderId}</h1>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
          <select
            className="border px-3 py-2 rounded disabled:opacity-50"
            value={order.status || ""}
            onChange={onChangeStatus}
            disabled={saving}
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="text-xs uppercase text-gray-500 font-semibold">User</div>
          <div className="text-sm font-semibold text-gray-900 mt-1">
            {order.userEmail || "—"}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="text-xs uppercase text-gray-500 font-semibold">Total</div>
          <div className="text-sm font-semibold text-gray-900 mt-1">
            {formatMoney(order.totalAmount)}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="text-xs uppercase text-gray-500 font-semibold">Created</div>
          <div className="text-sm font-semibold text-gray-900 mt-1">
            {order.createdAt ? new Date(order.createdAt).toLocaleString() : "—"}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="text-sm font-semibold text-gray-900 mb-3">Timeline</div>
        {order.timeline?.length ? (
          <div className="flex flex-wrap gap-2">
            {order.timeline.map((t) => (
              <Badge
                key={t.status}
                variant={t.current ? "info" : t.reached ? "success" : "default"}
              >
                {t.status}
              </Badge>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-600">No timeline available.</div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-900">Items</div>
          <div className="text-sm text-gray-600">{order.itemsCount ?? 0} items</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-600 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">Product</th>
                <th className="px-6 py-4 font-bold">Variant</th>
                <th className="px-6 py-4 font-bold">Qty</th>
                <th className="px-6 py-4 font-bold">Price</th>
                <th className="px-6 py-4 font-bold">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {(order.items || []).map((it) => (
                <tr key={it.id}>
                  <td className="px-6 py-4 font-medium text-gray-900">{it.productName}</td>
                  <td className="px-6 py-4 text-gray-700">{it.variantName || "—"}</td>
                  <td className="px-6 py-4 text-gray-700">{it.quantity}</td>
                  <td className="px-6 py-4 text-gray-700">{formatMoney(it.price)}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{formatMoney(it.subtotal)}</td>
                </tr>
              ))}
              {(order.items || []).length === 0 ? (
                <tr>
                  <td className="px-6 py-6 text-gray-600" colSpan={5}>
                    No items found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
