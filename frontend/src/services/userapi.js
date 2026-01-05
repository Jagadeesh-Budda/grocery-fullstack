const BASE = "http://localhost:8080/products";

export const getUserProductsPaged = async (page, size) => {
  const res = await fetch(`${BASE}/grouped?page=${page}&size=${size}`);
  return res.json();
};

export const getUserProductsCount = async () => {
  const res = await fetch(`${BASE}/grouped?page=0&size=1`);
  const data = await res.json();
  return data.totalElements || 0;
};
