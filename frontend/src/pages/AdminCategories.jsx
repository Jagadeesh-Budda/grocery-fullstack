import React from "react";
import { useEffect, useState } from "react";
import {
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/adminapi";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", imageUrl: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await getAdminCategories();
    setCategories(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await updateCategory(editingId, form);
    } else {
      await createCategory(form);
    }

    setForm({ name: "", imageUrl: "" });
    setEditingId(null);
    loadCategories();
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, imageUrl: cat.imageUrl });
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this category?")) {
      await deleteCategory(id);
      loadCategories();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Manage Categories</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
        <input
          className="border px-3 py-2 rounded w-1/3"
          placeholder="Category name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="border px-3 py-2 rounded w-1/3"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          required
        />
        <button className="bg-indigo-600 text-white px-4 rounded">
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      {/* Table */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Image</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td className="p-2 border">{cat.id}</td>
              <td className="p-2 border">{cat.name}</td>
              <td className="p-2 border">{cat.imageUrl}</td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => handleEdit(cat)}
                  className="text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
