const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export default API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not defined. Check your .env file.");
}

/* ---------- GROCERIES ---------- */

export async function fetchGroceries() {
  const res = await fetch(`${API_BASE_URL}/api/groceries`, {
    credentials: "include",
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("API Error:", res.status, errorText);
    throw new Error(`Failed to load groceries: ${res.status}`);
  }

  return res.json();
}

export async function createGrocery(grocery) {
  const res = await fetch(`${API_BASE_URL}/api/groceries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    redirect: "manual",
    body: JSON.stringify(grocery),
  });

  if (res.status === 302) {
    throw new Error("Session expired or not authenticated");
  }

  if (!res.ok) {
    throw new Error("Failed to add grocery");
  }
}

export async function deleteGrocery(id) {
  const res = await fetch(`${API_BASE_URL}/api/groceries/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("API Error:", res.status, errorText);
    throw new Error(`Delete grocery failed: ${res.status}`);
  }
}

export async function updateGrocery(id, data) {
  const res = await fetch(`${API_BASE_URL}/api/groceries/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("API Error:", res.status, errorText);
    throw new Error(`Update grocery failed: ${res.status}`);
  }

  return res.json();
}

/* ---------- CATEGORIES ---------- */

export async function fetchCategories() {
  const res = await fetch(`${API_BASE_URL}/api/categories`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Categories failed");
  }

  return res.json();
}
