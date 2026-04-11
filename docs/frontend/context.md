# Frontend Context

The frontend uses React Context providers to share auth and cart state throughout the app.

## `src/context/AuthContext.jsx`

`AuthContext` manages the current user, loading state, and login/logout methods.

Example:

```jsx
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get("/user/me");
        setUser(res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (credentials) => {
    await api.post("/auth/login", credentials);
    const res = await api.get("/user/me");
    setUser(res.data);
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

Why it matters:
- auth state is available across every page,
- the app checks the logged-in user on startup,
- login/logout actions are centralized.

## `src/context/CartContext.jsx`

`CartContext` contains cart items, derived totals, and sync logic.

Example patterns:

- loads cart data from the backend when a user is signed in,
- persists guest carts to `localStorage`,
- caches authenticated carts in `sessionStorage`,
- uses debounced quantity updates to avoid too many API calls,
- provides optimistic UI updates for quantity changes.

A key section from `CartContext`:

```jsx
const addItem = async (payload, qty = 1) => {
  setItems((prev) => { ... });
  if (user?.id) {
    await api.post(`/cart/${user.id}/add`, null, {
      params: { variantId: payload.variantId, quantity: qty },
    });
  }
};
```

Why it matters:
- cart actions are available to product and cart pages,
- the UI and backend stay synchronized,
- it supports both authenticated and guest shopping.

## Why context matters

- Context removes prop drilling for global state,
- it keeps auth and cart behavior out of page components,
- it allows consistent state across the storefront and admin screens.
