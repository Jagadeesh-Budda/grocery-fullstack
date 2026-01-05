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
  const res = await api.post("/categories", data);
  return res.data;
};

export const updateCategory = async (id, data) => {
  const res = await api.put(`/categories/${id}`, data);
  return res.data;
};

export const deleteCategory = async (id) => {
  await api.delete(`/categories/${id}`);
};
/* ============ PRODUCTS ============ */

export const getAdminProductsPaged = async (page, size) => {
  const res = await axios.get(`http://localhost:8080/products/grouped?page=${page}&size=${size}`, { withCredentials: true });
  return res.data;
};

export const getAdminProductsCount = async () => {
  const res = await axios.get(`http://localhost:8080/products/grouped?page=0&size=1`, { withCredentials: true });
  return res.data.totalElements || 0;
};
