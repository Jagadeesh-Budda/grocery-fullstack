import React from "react";
import { useEffect, useState, useCallback } from "react";
import {
  fetchGroceries,
  deleteGrocery,
  updateGrocery,
} from "../../services/groceryApi.js";
import ShoppingItem from "./ShoppingItem.jsx";

export default function ShoppingList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGroceries();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load groceries");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id) {
    const prev = items;
    setItems((curr) => curr.filter((i) => i.id !== id));
    try {
      await deleteGrocery(id);
    } catch (e) {
      console.error(e);
      setItems(prev);
    }
  }

  async function handleUpdate(updatedItem) {
    const prev = items;
    setItems((curr) =>
      curr.map((it) => (it.id === updatedItem.id ? updatedItem : it))
    );
    try {
      await updateGrocery(updatedItem.id, updatedItem);
    } catch (e) {
      console.error(e);
      setItems(prev);
      throw e;
    }
  }

  if (loading) {
    return <div className="p-4 text-sm text-slate-600">Loading groceries…</div>;
  }

  if (error) {
    return <div className="p-4 text-sm text-red-600">Error: {error}</div>;
  }

  if (!items.length) {
    return (
      <div className="p-4 text-sm text-slate-600">
        No groceries yet. Add some to get started.
      </div>
    );
  }

  return (
    <div className="p-3 grid gap-3">
      {items.map((item) => (
        <ShoppingItem
          key={item.id}
          item={item}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  );
}
