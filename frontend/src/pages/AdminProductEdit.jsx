import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import ProductForm from "../components/admin/ProductForm";
import { getAdminProductById } from "../services/adminapi";

export default function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (isNew) return;
      setLoading(true);
      try {
        const res = await getAdminProductById(id);
        if (mounted) setProduct(res);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [id, isNew]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">{isNew ? "Create Product" : "Edit Product"}</h1>
          <p className="text-sm text-grocery-body">Required fields are marked with *</p>
        </div>
        <button className="px-4 py-2 border rounded" onClick={() => navigate("/admin/products")}>Back</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 animate-pulse">
          <div className="h-48 bg-gray-200 rounded-xl3" />
        </div>
      ) : (
        <ProductForm
          mode={isNew ? "create" : "edit"}
          initial={isNew ? null : product}
          onCancel={() => navigate("/admin/products")}
          onSaved={(savedId) => navigate(`/admin/products/${savedId}`)}
        />
      )}
    </div>
  );
}
