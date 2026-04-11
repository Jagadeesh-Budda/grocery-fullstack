# Frontend API and Services

This section documents how the frontend calls backend APIs and handles service logic.

## `src/api/axios.js`

The app uses an Axios instance for all JSON API requests.

```js
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
});

export default api;
```

Why it matters:
- `baseURL` centralizes the backend API root,
- `withCredentials: true` sends cookies for Spring Security session auth,
- it allows other modules to reuse the same client.

## `src/api/urls.js`

Static URL constants are kept in one place.

```js
export const API_BASE_URL = "http://localhost:8080/api";
export const IMAGE_BASE_URL = "http://localhost:8080";
```

Why it exists:
- avoids hardcoding backend roots across the app,
- makes it easier to update endpoint hosts or ports.

## `src/api/apiError.ts`

This helper normalizes errors from Axios or fetch into a simple shape.

```ts
export function normalizeApiError(error: unknown) {
  const err = error as any;
  const status = err?.response?.status as number | undefined;
  const data = err?.response?.data as unknown;

  const backendMessage = extractBackendMessage(data);
  const fallbackMessage = typeof err?.message === "string" ? err.message : "Request failed";

  return {
    status,
    code: extractBackendCode(data),
    message: backendMessage || fallbackMessage,
    raw: error,
  };
}
```

Why it matters:
- it keeps error handling consistent,
- it understands backend shape like `{ status, error, message, code }`,
- it provides a single source of truth for UI messages.

### Mapping backend errors to user text

```ts
export function getApiErrorMessage(normalized) {
  if (status === 403) return "Not authorized";
  if (status === 401) return "Please log in to continue";
  if (status === 400) return msg || "Bad request";
  return "Something went wrong. Please try again.";
}
```

## `src/api/homeDashboardApi.ts`

A small API client for the home dashboard endpoint:

```ts
import api from "./axios";

export async function fetchHomeDashboard() {
  const response = await api.get("/home-dashboard");
  return response.data;
}
```

Why it exists:
- keeps dashboard requests isolated,
- avoids duplicating endpoint code in components.

## `src/api/ordersApi.ts`

This module wraps order API calls and normalizes errors.

```ts
export async function createOrder() {
  try {
    const res = await api.post("/orders", undefined, { withCredentials: true });
    return res.data;
  } catch (e) {
    throw normalizeApiError(e);
  }
}
```

Why it exists:
- encapsulates order-specific request logic,
- makes the calling code easier to read,
- returns typed response shapes for order creation and summaries.

## `src/services/groceryApi.js`

Product and category helpers live here.

Example:

```js
export async function fetchGroceries(page = 0, size = 10, category = "") {
  const res = await api.get("/products/grouped", {
    params: { page, size, category }
  });
  return res.data;
}
```

Why it matters:
- it reuses the shared Axios client,
- it returns backend page objects directly,
- it keeps product API calls centralized.

## `src/services/authServices.ts`

This file handles login via the classic browser fetch API.

```ts
export async function loginUser(username, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
}
```

Why it matters:
- it shows an alternative to Axios for auth requests,
- `credentials: "include"` ensures cookies are sent,
- it also contains localStorage helpers for token-based session helpers.

## `src/services/voiceService.js`

This utility parses natural language grocery commands.

Example behavior:
- `add 2 kg onions` → `{ action: 'add', name: 'onions', quantity: 2, unit: 'kg' }`
- `remove a dozen eggs` → `{ action: 'remove', name: 'eggs', quantity: 12, unit: 'pack' }`

Why it matters:
- it adds a voice/intent layer to the app,
- separates parsing logic from UI code,
- supports quantity and unit normalization.

## Why API/services matter

- components can focus on rendering instead of networking,
- changes to endpoint URLs and error handling are isolated,
- services keep the codebase easier to maintain and test.
