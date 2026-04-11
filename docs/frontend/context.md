# Frontend Context

The `src/context/` folder contains React Context providers for shared application state.

## `AuthContext.jsx`

- Manages user authentication state.
- Fetches the current user from `/user/me` when the app loads.
- Provides methods for `login` and `logout`.
- Stores:
  - `user`
  - `loading`
  - `isAuthenticated`
- Why it exists: to make auth state accessible throughout the app without prop drilling.

## `CartContext.jsx`

- Manages the shopping cart state.
- Stores cart items, loading state, and update logic.
- Supports both guest cart storage in `localStorage` and authenticated user cart sync with the backend.
- Uses debounced updates to avoid excessive API requests when quantity changes.
- Why it exists: to centralize cart behavior so product pages and cart pages can share the same cart state.

## Why context matters

- Context is ideal for global state like auth and cart data.
- It keeps shared logic in one place and avoids repeating state management across pages.
- It also enables cross-component communication (e.g. login state influencing header and cart behavior).
