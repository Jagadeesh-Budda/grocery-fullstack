import api from "../api/axios";

/* ---------- PRODUCTS ---------- */

export async function fetchGroceries(page = 0, size = 10) {
  const res = await api.get("/products/grouped", {
    params: { page, size }
  });
  // Return the full Page object so the caller can check last/totalPages
  return res.data;
}

export async function createGrocery(product) {
  return api.post("/products", product);
}

export async function deleteGrocery(id) {
  return api.delete(`/products/${id}`);
}

export async function updateGrocery(id, data) {
  return api.put(`/products/${id}`, data);
}

/* ---------- CATEGORIES ---------- */

export async function fetchCategories() {
  const res = await api.get("/categories");
  return res.data;
}