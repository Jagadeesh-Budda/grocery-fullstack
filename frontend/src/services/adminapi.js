import axios from "axios";

const BASE_URL = "http://localhost:8080/api/admin";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

/* ================= DASHBOARD ================= */

export const fetchAdminDashboard = async () => {
  const res = await api.get("/dashboard");
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
