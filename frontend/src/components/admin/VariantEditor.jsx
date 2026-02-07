import React from "react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import Button from "../../common/Button";
import {
  createAdminVariant,
  deleteAdminVariant,
  updateAdminVariant,
} from "../../services/adminapi";

function toNumberOrNull(v) {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export default function VariantEditor({ productId, variants, onChanged }) {
  const [savingId, setSavingId] = useState(null);
  const [newVariant, setNewVariant] = useState({
    variantName: "",
    unit: "",
    mrp: "",
    discountPercent: "0",
    imageUrl: "",
    stock: "0",
  });

  const newErrors = useMemo(() => {
    const e = {};
    if (!newVariant.variantName.trim()) e.variantName = "Variant name is required";
    if (!newVariant.unit.trim()) e.unit = "Unit is required";
    const mrp = toNumberOrNull(newVariant.mrp);
    if (mrp === null || mrp <= 0) e.mrp = "MRP must be > 0";
    const disc = toNumberOrNull(newVariant.discountPercent);
    if (disc === null || disc < 0 || disc > 100) e.discountPercent = "Discount must be 0-100";
    if (!newVariant.imageUrl.trim()) e.imageUrl = "Image URL is required";
    const stock = toNumberOrNull(newVariant.stock);
    if (stock === null || stock < 0) e.stock = "Stock must be >= 0";
    return e;
  }, [newVariant]);

  const canCreate = Object.keys(newErrors).length === 0 && savingId === null;

  const onCreate = async (e) => {
    e.preventDefault();
    if (!canCreate) {
      toast.error("Please fix validation errors");
      return;
    }

    try {
      setSavingId("new");
      await createAdminVariant(productId, {
        variantName: newVariant.variantName.trim(),
        unit: newVariant.unit.trim(),
        mrp: Number(newVariant.mrp),
        discountPercent: Number(newVariant.discountPercent || 0),
        imageUrl: newVariant.imageUrl.trim(),
        stock: Number(newVariant.stock || 0),
      });
      toast.success("Variant created");
      setNewVariant({
        variantName: "",
        unit: "",
        mrp: "",
        discountPercent: "0",
        imageUrl: "",
        stock: "0",
      });
      await onChanged?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create variant");
    } finally {
      setSavingId(null);
    }
  };

  const onSaveExisting = async (variantId, patch) => {
    try {
      setSavingId(variantId);
      await updateAdminVariant(variantId, patch);
      toast.success("Variant updated");
      await onChanged?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update variant");
    } finally {
      setSavingId(null);
    }
  };

  const onDelete = async (variantId) => {
    if (!confirm("Delete this variant?")) return;
    try {
      setSavingId(variantId);
      await deleteAdminVariant(variantId);
      toast.success("Variant deleted");
      await onChanged?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete variant");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl3 border border-gray-100 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-grocery-body">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name *</th>
              <th className="px-4 py-3">Unit *</th>
              <th className="px-4 py-3">MRP *</th>
              <th className="px-4 py-3">Discount %</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Image URL *</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {(variants?.length ?? 0) === 0 ? (
              <tr>
                <td className="px-4 py-6 text-grocery-body" colSpan={8}>
                  No variants yet.
                </td>
              </tr>
            ) : (
              variants.map((v) => (
                <VariantRow
                  key={v.variantId}
                  v={v}
                  saving={savingId === v.variantId}
                  onSave={onSaveExisting}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <form onSubmit={onCreate} className="bg-white rounded-xl3 border border-gray-100 p-4">
        <h3 className="text-lg font-semibold mb-3">Add Variant</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Name *"
            value={newVariant.variantName}
            onChange={(val) => setNewVariant((s) => ({ ...s, variantName: val }))}
            error={newErrors.variantName}
            placeholder="e.g. SKU / Pack name"
          />
          <Field
            label="Unit *"
            value={newVariant.unit}
            onChange={(val) => setNewVariant((s) => ({ ...s, unit: val }))}
            error={newErrors.unit}
            placeholder="e.g. 1 kg, 500 g"
          />
          <Field
            label="MRP *"
            type="number"
            value={newVariant.mrp}
            onChange={(val) => setNewVariant((s) => ({ ...s, mrp: val }))}
            error={newErrors.mrp}
            placeholder="e.g. 99"
          />
          <Field
            label="Discount %"
            type="number"
            value={newVariant.discountPercent}
            onChange={(val) => setNewVariant((s) => ({ ...s, discountPercent: val }))}
            error={newErrors.discountPercent}
            placeholder="0"
          />
          <Field
            label="Stock"
            type="number"
            value={newVariant.stock}
            onChange={(val) => setNewVariant((s) => ({ ...s, stock: val }))}
            error={newErrors.stock}
            placeholder="0"
          />
          <Field
            label="Image URL *"
            value={newVariant.imageUrl}
            onChange={(val) => setNewVariant((s) => ({ ...s, imageUrl: val }))}
            error={newErrors.imageUrl}
            placeholder="https://..."
          />
        </div>

        <div className="flex justify-end mt-4">
          <Button type="submit" disabled={!canCreate}>
            {savingId === "new" ? "Creating..." : "Create Variant"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, error, placeholder, type = "text" }) {
  return (
    <div>
      <label className="block text-xs text-grocery-body mb-1">{label}</label>
      <input
        className={`w-full border px-3 py-2 rounded ${error ? "border-red-400" : ""}`}
        value={value}
        type={type}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {error ? <p className="text-xs text-red-600 mt-1">{error}</p> : null}
    </div>
  );
}

function VariantRow({ v, saving, onSave, onDelete }) {
  const [draft, setDraft] = useState({
    variantName: v.variantName ?? "",
    unit: v.unit ?? "",
    mrp: v.mrp ?? "",
    discountPercent: v.discountPercent ?? 0,
    imageUrl: v.imageUrl ?? "",
    stock: v.stock ?? 0,
  });

  useEffect(() => {
    setDraft({
      variantName: v.variantName ?? "",
      unit: v.unit ?? "",
      mrp: v.mrp ?? "",
      discountPercent: v.discountPercent ?? 0,
      imageUrl: v.imageUrl ?? "",
      stock: v.stock ?? 0,
    });
  }, [v]);

  const errors = useMemo(() => {
    const e = {};
    if (!String(draft.variantName).trim()) e.variantName = true;
    if (!String(draft.unit).trim()) e.unit = true;
    const mrp = toNumberOrNull(draft.mrp);
    if (mrp === null || mrp <= 0) e.mrp = true;
    const disc = toNumberOrNull(draft.discountPercent);
    if (disc === null || disc < 0 || disc > 100) e.discountPercent = true;
    if (!String(draft.imageUrl).trim()) e.imageUrl = true;
    const stock = toNumberOrNull(draft.stock);
    if (stock === null || stock < 0) e.stock = true;
    return e;
  }, [draft]);

  const canSave = Object.keys(errors).length === 0 && !saving;

  return (
    <tr className={saving ? "opacity-60" : ""}>
      <td className="px-4 py-3 text-grocery-body">{v.variantId}</td>
      <td className="px-4 py-3">
        <input
          className={`w-48 border px-2 py-1 rounded ${errors.variantName ? "border-red-400" : ""}`}
          value={draft.variantName}
          onChange={(e) => setDraft((s) => ({ ...s, variantName: e.target.value }))}
        />
      </td>
      <td className="px-4 py-3">
        <input
          className={`w-24 border px-2 py-1 rounded ${errors.unit ? "border-red-400" : ""}`}
          value={draft.unit}
          onChange={(e) => setDraft((s) => ({ ...s, unit: e.target.value }))}
        />
      </td>
      <td className="px-4 py-3">
        <input
          className={`w-24 border px-2 py-1 rounded ${errors.mrp ? "border-red-400" : ""}`}
          value={String(draft.mrp ?? "")}
          type="number"
          onChange={(e) => setDraft((s) => ({ ...s, mrp: e.target.value }))}
        />
      </td>
      <td className="px-4 py-3">
        <input
          className={`w-20 border px-2 py-1 rounded ${errors.discountPercent ? "border-red-400" : ""}`}
          value={String(draft.discountPercent ?? 0)}
          type="number"
          onChange={(e) => setDraft((s) => ({ ...s, discountPercent: e.target.value }))}
        />
      </td>
      <td className="px-4 py-3">
        <input
          className={`w-20 border px-2 py-1 rounded ${errors.stock ? "border-red-400" : ""}`}
          value={String(draft.stock ?? 0)}
          type="number"
          onChange={(e) => setDraft((s) => ({ ...s, stock: e.target.value }))}
        />
      </td>
      <td className="px-4 py-3">
        <input
          className={`w-64 border px-2 py-1 rounded ${errors.imageUrl ? "border-red-400" : ""}`}
          value={draft.imageUrl}
          onChange={(e) => setDraft((s) => ({ ...s, imageUrl: e.target.value }))}
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            disabled={!canSave}
            onClick={() =>
              onSave(v.variantId, {
                variantName: String(draft.variantName).trim(),
                unit: String(draft.unit).trim(),
                mrp: Number(draft.mrp),
                discountPercent: Number(draft.discountPercent ?? 0),
                imageUrl: String(draft.imageUrl).trim(),
                stock: Number(draft.stock ?? 0),
              })
            }
          >
            {saving ? "Saving..." : "Save"}
          </Button>
          <button
            type="button"
            className="text-red-600 hover:underline"
            disabled={saving}
            onClick={() => onDelete(v.variantId)}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
