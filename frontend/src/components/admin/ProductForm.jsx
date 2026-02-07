import React from "react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import Button from "../../common/Button";
import {
  createAdminProduct,
  getAdminCategories,
  updateAdminProduct,
} from "../../services/adminapi";

function normalizeImages(value) {
  if (!value) return [];
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function ProductForm({
  mode,
  initial,
  onSaved,
  onCancel,
}) {
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    imageUrl: initial?.imageUrl ?? "",
    imagesText: (initial?.images ?? []).join("\n"),
    categoryId: initial?.categoryId ?? "",
    active: initial?.active ?? true,
  });

  useEffect(() => {
    let mounted = true;
    const loadCats = async () => {
      try {
        const res = await getAdminCategories();
        if (mounted) setCategories(res || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load categories");
      }
    };
    loadCats();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setForm({
      name: initial?.name ?? "",
      description: initial?.description ?? "",
      imageUrl: initial?.imageUrl ?? "",
      imagesText: (initial?.images ?? []).join("\n"),
      categoryId: initial?.categoryId ?? "",
      active: initial?.active ?? true,
    });
  }, [initial]);

  const errors = useMemo(() => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.description.trim()) next.description = "Description is required";
    if (!form.imageUrl.trim()) next.imageUrl = "Image URL is required";
    if (!String(form.categoryId).trim()) next.categoryId = "Category is required";

    // Images list is required by backend entity, so ensure at least one.
    const images = normalizeImages(form.imagesText);
    if (images.length === 0) next.imagesText = "At least one image URL is required";

    return next;
  }, [form]);

  const canSubmit = Object.keys(errors).length === 0 && !saving;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) {
      toast.error("Please fix validation errors");
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim(),
      images: normalizeImages(form.imagesText),
      active: !!form.active,
      categoryId: Number(form.categoryId),
    };

    setSaving(true);
    try {
      if (mode === "create") {
        const id = await createAdminProduct(payload);
        toast.success("Product created");
        onSaved?.(id);
      } else {
        const id = await updateAdminProduct(initial.id, payload);
        toast.success("Product updated");
        onSaved?.(id);
      }
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl3 border border-gray-100 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs text-grocery-body mb-1">Name *</label>
          <input
            className={`w-full border px-3 py-2 rounded ${errors.name ? "border-red-400" : ""}`}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Organic Bananas"
          />
          {errors.name ? <p className="text-xs text-red-600 mt-1">{errors.name}</p> : null}
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs text-grocery-body mb-1">Description *</label>
          <textarea
            className={`w-full border px-3 py-2 rounded min-h-[96px] ${errors.description ? "border-red-400" : ""}`}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Short product description"
          />
          {errors.description ? (
            <p className="text-xs text-red-600 mt-1">{errors.description}</p>
          ) : null}
        </div>

        <div>
          <label className="block text-xs text-grocery-body mb-1">Category *</label>
          <select
            className={`w-full border px-3 py-2 rounded ${errors.categoryId ? "border-red-400" : ""}`}
            value={String(form.categoryId)}
            onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.categoryId ? (
            <p className="text-xs text-red-600 mt-1">{errors.categoryId}</p>
          ) : null}
        </div>

        <div>
          <label className="block text-xs text-grocery-body mb-1">Active</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={form.active ? "true" : "false"}
            onChange={(e) => setForm((f) => ({ ...f, active: e.target.value === "true" }))}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs text-grocery-body mb-1">Primary image URL *</label>
          <input
            className={`w-full border px-3 py-2 rounded ${errors.imageUrl ? "border-red-400" : ""}`}
            value={form.imageUrl}
            onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
            placeholder="https://..."
          />
          {errors.imageUrl ? (
            <p className="text-xs text-red-600 mt-1">{errors.imageUrl}</p>
          ) : null}
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs text-grocery-body mb-1">Images (one per line) *</label>
          <textarea
            className={`w-full border px-3 py-2 rounded min-h-[96px] ${errors.imagesText ? "border-red-400" : ""}`}
            value={form.imagesText}
            onChange={(e) => setForm((f) => ({ ...f, imagesText: e.target.value }))}
            placeholder="https://...\nhttps://..."
          />
          {errors.imagesText ? (
            <p className="text-xs text-red-600 mt-1">{errors.imagesText}</p>
          ) : (
            <p className="text-xs text-grocery-body mt-1">
              Required by backend; include at least one.
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 mt-4">
        <button
          type="button"
          className="px-4 py-2 border rounded"
          onClick={() => onCancel?.()}
          disabled={saving}
        >
          Cancel
        </button>
        <Button type="submit" disabled={!canSubmit}>
          {saving ? "Saving..." : mode === "create" ? "Create" : "Save"}
        </Button>
      </div>
    </form>
  );
}
