# Frontend API and Services

The frontend communicates with the backend using both Axios and native fetch helpers.

## `src/api/axios.js`

- Creates an Axios instance with a base URL pointing to the backend API.
- Sets `withCredentials: true` so the browser sends cookies for Spring Security session auth.
- Why it exists: centralizes API client configuration and makes it easy to call endpoints consistently.

## `src/api/urls.js`

- Defines constant backend URLs:
  - `API_BASE_URL`
  - `IMAGE_BASE_URL`
- Why it exists: to keep API endpoint roots in one place and avoid hardcoding them across the app.

## `src/api/apiError.ts`

- Normalizes API error responses.
- Useful for converting backend errors into user-friendly messages.
- Why it exists: to keep error handling consistent across API calls.

## `src/api/homeDashboardApi.ts` and `src/api/ordersApi.ts`

- Likely contain API wrappers for dashboard data and orders.
- Why they exist: to keep specialized API logic separated by feature.

## `src/services/groceryApi.js`

- Defines product and category API helper functions.
- Examples:
  - `fetchGroceries`
  - `createGrocery`
  - `deleteGrocery`
  - `updateGrocery`
  - `fetchCategories`
- Why it exists: to keep product-related API calls reusable and centralized.

## `src/services/authServices.ts`

- Handles auth-related fetch calls, including login.
- Uses `credentials: "include"` for cookie-based auth.
- Also contains token helper functions for localStorage.
- Why it exists: to separate auth request behavior from UI components.

## `src/services/voiceService.js`

- Likely provides voice input or speech integration.
- Why it exists: to add specialized support for voice-driven features.

## Why API/services matter

- They decouple network requests from components.
- They make it easier to update backend endpoints later.
- They keep HTTP logic consistent and reusable.
