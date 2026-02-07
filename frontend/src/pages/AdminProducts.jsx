import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import Badge from "../common/Badge";
import Button from "../common/Button";
import {
  deleteAdminProduct,
  getAdminProducts,
  updateAdminProduct,
} from "../services/adminapi";

function variantBadge(active) {
  if (active === true) return { variant: "success", label: "Active" };
  if (active === false) return { variant: "danger", label: "Inactive" };
  return { variant: "neutral", label: "Unknown" };
}

export default function AdminProducts() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") || 0);
  const size = Number(searchParams.get("size") || 20);
  const q = searchParams.get("q") || "";
  const activeParam = searchParams.get("active");
  const active = useMemo(() => {
    if (activeParam === null || activeParam === "") return undefined;
    if (activeParam === "true") return true;
    if (activeParam === "false") return false;
    return undefined;
  }, [activeParam]);

  const [data, setData] = useState({ content: [], totalElements: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAdminProducts({ page, size, q: q || undefined, active });
      setData(res);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, q, activeParam]);

  const setParam = (next) => {
    const merged = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") merged.delete(k);
      else merged.set(k, String(v));
    });
    setSearchParams(merged, { replace: true });
  };

  const onToggleActive = async (product) => {
    const nextActive = !(product.active === true);
    try {
      await updateAdminProduct(product.id, { active: nextActive });
      toast.success(nextActive ? "Product activated" : "Product deactivated");
      await load();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  const onDelete = async (product) => {
    if (!confirm(`Delete product "${product.name}"?`)) return;
    try {
      await deleteAdminProduct(product.id);
      toast.success("Product deleted");
      await load();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  const totalPages = data?.totalPages ?? 0;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-grocery-body">
            Manage products, variants, and activation.
          </p>
        </div>

        <Button onClick={() => navigate("/admin/products/new")}>Create Product</Button>
      </div>

      <div className="bg-white rounded-xl3 border border-gray-100 p-4 mb-4">
        <div className="flex flex-col md:flex-row md:items-end gap-3">
          <div className="flex-1">
            <label className="block text-xs text-grocery-body mb-1">Search</label>
            <input
              className="w-full border px-3 py-2 rounded"
              placeholder="Search by product name"
              value={q}
              onChange={(e) => setParam({ q: e.target.value, page: 0 })}
            />
          </div>

          <div className="w-full md:w-56">
            <label className="block text-xs text-grocery-body mb-1">Active</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={activeParam ?? ""}
              onChange={(e) => setParam({ active: e.target.value, page: 0 })}
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div className="w-full md:w-40">
            <label className="block text-xs text-grocery-body mb-1">Page size</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={String(size)}
              onChange={(e) => setParam({ size: Number(e.target.value), page: 0 })}
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={String(n)}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl3 border border-gray-100 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-grocery-body">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {loading ? (
              [...Array(8)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-3">
                    <div className="h-4 w-12 bg-gray-200 rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-48 bg-gray-200 rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-5 w-20 bg-gray-200 rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-40 bg-gray-200 rounded ml-auto" />
                  </td>
                </tr>
              ))
            ) : (data?.content?.length ?? 0) === 0 ? (
              <tr>
                <td className="px-4 py-6 text-grocery-body" colSpan={5}>
                  No products found.
                </td>
              </tr>
            ) : (
              data.content.map((p) => {
                const status = variantBadge(p.active);
                return (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-grocery-body">{p.id}</td>
                    <td className="px-4 py-3 font-medium text-grocery-heading">{p.name}</td>
                    <td className="px-4 py-3 text-grocery-body">{p.categoryName || "—"}</td>
                    <td className="px-4 py-3">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => navigate(`/admin/products/${p.id}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-indigo-600 hover:underline"
                          onClick={() => navigate(`/admin/products/${p.id}/variants`)}
                        >
                          Variants
                        </button>
                        <button
                          className="text-grocery-heading hover:underline"
                          onClick={() => onToggleActive(p)}
                        >
                          {p.active ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => onDelete(p)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-grocery-body">
          Total: {data?.totalElements ?? 0}
        </p>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-2 border rounded disabled:opacity-50"
            disabled={page <= 0}
            onClick={() => setParam({ page: Math.max(page - 1, 0) })}
          >
            Prev
          </button>
          <span className="text-sm text-grocery-body">
            Page {page + 1} / {Math.max(totalPages, 1)}
          </span>
          <button
            className="px-3 py-2 border rounded disabled:opacity-50"
            disabled={totalPages === 0 || page >= totalPages - 1}
            onClick={() => setParam({ page: page + 1 })}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
