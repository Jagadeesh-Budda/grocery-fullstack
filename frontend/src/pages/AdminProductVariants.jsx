import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import VariantEditor from "../components/admin/VariantEditor";
import { getAdminProductById } from "../services/adminapi";

export default function AdminProductVariants() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAdminProductById(id);
      setProduct(res);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Variants</h1>
          <p className="text-sm text-grocery-body">
            {product ? (
              <>
                Product: <span className="font-medium text-grocery-heading">{product.name}</span>
              </>
            ) : (
              ""
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded" onClick={() => navigate(`/admin/products/${id}`)}>
            Back to Product
          </button>
          <button className="px-4 py-2 border rounded" onClick={() => navigate("/admin/products")}>
            Products
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl3 border border-gray-100 p-6 animate-pulse">
          <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      ) : product ? (
        <VariantEditor productId={Number(id)} variants={product.variants || []} onChanged={load} />
      ) : (
        <div className="text-grocery-body">Product not found.</div>
      )}
    </div>
  );
}
