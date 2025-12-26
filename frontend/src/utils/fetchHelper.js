/**
 * Safe fetch wrapper with automatic error handling
 * @param {string} url - API endpoint URL
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<object>} Parsed JSON response
 * @throws {Error} If request fails or response is not OK
 */
export async function apiFetch(url, options = {}) {
  try {
    const response = await fetch(url, {
      credentials: "include",
      ...options,
    });

    // Handle 401 Unauthorized - redirect to login
    if (response.status === 401) {
      window.location.href = "/login";
      throw new Error("Unauthorized: Redirecting to login");
    }

    // Handle other error statuses
    if (!response.ok) {
      throw new Error(
        `API Error: ${response.status} ${response.statusText}`
      );
    }

    // Check if response has content
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Invalid response format: Expected JSON");
    }

    // Safe JSON parsing
    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

/**
 * GET request helper
 */
export function apiGet(url) {
  return apiFetch(url, { method: "GET" });
}

/**
 * POST request helper
 */
export function apiPost(url, body) {
  return apiFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/**
 * POST with form-encoded data (for login)
 */
export function apiPostForm(url, data) {
  return apiFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(data),
  });
}

/**
 * PUT request helper
 */
export function apiPut(url, body) {
  return apiFetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/**
 * DELETE request helper
 */
export function apiDelete(url) {
  return apiFetch(url, { method: "DELETE" });
}

// In AdminDashboard.jsx
import { apiGet } from "../utils/fetchHelper";

useEffect(() => {
  const fetchAdminStats = async () => {
    try {
      const data = await apiGet("http://localhost:8080/admin/stats");
      setStats(data);
      setError(null);
    } catch (err) {
      setError("Failed to load dashboard stats. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  fetchAdminStats();
}, []);

// In Login.jsx
import { apiPostForm, apiGet } from "../utils/fetchHelper";

const handleLogin = async (e) => {
  e.preventDefault();
  if (loading) return;

  setLoading(true);
  setError("");

  try {
    await apiPostForm("http://localhost:8080/login", {
      username: identifier,
      password: password,
    });

    const user = await apiGet("http://localhost:8080/me");
    const isAdmin = user.roles?.includes("ROLE_ADMIN");

    navigate(isAdmin ? "/admin" : "/groceries", { replace: true });
  } catch (err) {
    setError("Invalid username/email or password");
  } finally {
    setLoading(false);
  }
};