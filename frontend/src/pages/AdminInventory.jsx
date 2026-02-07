import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Card from "../common/Card";
import { getAdminLowStockInventory } from "../services/adminapi";

export default function AdminInventory() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAdminLowStockInventory();
      setRows(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load low stock inventory");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-500">Low stock monitoring (stock ≤ threshold)</p>
        </div>
        <button
          onClick={load}
          className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-50 text-sm font-semibold"
          disabled={loading}
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      <Card>
        {loading ? (
          <div className="p-6 text-gray-500">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-6 text-gray-500">No low stock variants.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-3 px-4">Variant</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Threshold</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.variantId} className="border-b last:border-b-0">
                    <td className="py-3 px-4 font-semibold text-gray-900">{r.variantName ?? "—"}</td>
                    <td className="py-3 px-4 text-gray-700">{r.productName ?? "—"}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-lg bg-red-50 text-red-700 font-semibold">
                        {r.stock ?? "—"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{r.threshold ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
