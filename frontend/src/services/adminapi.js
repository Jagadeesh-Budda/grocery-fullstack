import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

/* ================= DASHBOARD ================= */

export const fetchAdminDashboard = async () => {
  const res = await api.get("/admin/dashboard/stats");
  return res.data;
};

/* ================= CATEGORIES ================= */

export const getAdminCategories = async () => {
  const res = await api.get("/categories");
  return res.data;
};

export const createCategory = async (data) => {
  const res = await api.post("/admin/categories", data);
  return res.data;
};

export const updateCategory = async (id, data) => {
  const res = await api.put(`/admin/categories/${id}`, data);
  return res.data;
};

export const deleteCategory = async (id) => {
  await api.delete(`/admin/categories/${id}`);
};
/* ============ PRODUCTS ============ */

export const getAdminProducts = async ({ page = 0, size = 20, q, active } = {}) => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(size));
  if (q) params.set("q", q);
  if (active !== undefined && active !== null && active !== "") params.set("active", String(active));

  const res = await api.get(`/admin/products?${params.toString()}`);
  return res.data;
};

export const getAdminProductById = async (productId) => {
  const res = await api.get(`/admin/products/${productId}`);
  return res.data;
};

export const createAdminProduct = async (payload) => {
  const res = await api.post(`/admin/products`, payload);
  return res.data;
};

export const updateAdminProduct = async (productId, payload) => {
  const res = await api.put(`/admin/products/${productId}`, payload);
  return res.data;
};

export const deleteAdminProduct = async (productId) => {
  await api.delete(`/admin/products/${productId}`);
};

export const createAdminVariant = async (productId, payload) => {
  const res = await api.post(`/admin/products/${productId}/variants`, payload);
  return res.data;
};

export const updateAdminVariant = async (variantId, payload) => {
  const res = await api.put(`/admin/products/variants/${variantId}`, payload);
  return res.data;
};

export const deleteAdminVariant = async (variantId) => {
  await api.delete(`/admin/products/variants/${variantId}`);
};

/* ============ ADMIN ORDERS ============ */

export const getAdminOrders = async ({ page = 0, size = 20, status, q } = {}) => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(size));
  if (status) params.set("status", status);
  if (q) params.set("q", q);

  const res = await api.get(`/admin/orders?${params.toString()}`);
  return res.data;
};

export const getAdminOrderById = async (id) => {
  const res = await api.get(`/admin/orders/${id}`);
  return res.data;
};

export const updateAdminOrderStatus = async (id, newStatus) => {
  const res = await api.patch(`/admin/orders/${id}/status`, newStatus, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

/* ============ INVENTORY ============ */

export const getAdminLowStockInventory = async () => {
  const res = await api.get("/admin/inventory/low-stock");
  return res.data;
};
