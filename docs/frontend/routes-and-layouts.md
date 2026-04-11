# Frontend Routes and Layouts

The frontend uses React Router v6 to define navigation, route protection, and layout composition.

## `src/App.jsx`

`App.jsx` defines the main route hierarchy.
It uses nested routes so the same layout can wrap multiple pages.

Example:

```jsx
<Route path="/groceries" element={<MainLayout />}>
  <Route index element={<UserDashboard />} />
  <Route path="categories" element={<CategoriesPage />} />
  <Route path="cart" element={<CartPage />} />
  <Route path="checkout" element={<CheckoutPage />} />
  <Route path="products/:id" element={<ProductDetailPage />} />
</Route>
```

Why it matters:
- nested routes allow layouts to render around page content,
- public and private user flows share the same shell,
- the route tree is easy to read and maintain.

### Default routing and redirects

`App.jsx` also redirects `/` and unknown paths to `/groceries`, keeping navigation consistent.

## `src/routes/ProtectedRoute.jsx`

This component protects admin pages by checking auth state and allowed roles.

Example:

```jsx
export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user && allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === "ROLE_ADMIN" ? "/admin" : "/groceries"} replace />;
  }

  return <Outlet />;
}
```

Why it matters:
- it prevents unauthorized admin access in the client,
- it avoids flashing protected UI while auth is unresolved,
- it delegates actual security enforcement to the backend too.

## `src/layouts/user/UserLayout.jsx`

The user layout provides the storefront shell and global UI.

Key features:
- renders `HeaderBar` and `SceneryBackground`,
- exposes search and category state to page content,
- renders a mobile dock navigation with `NavLink`.

It also integrates IFLI surfaces for voice/intent functionality.

Why it matters:
- it keeps the user experience consistent across shopper pages,
- it separates layout chrome from page-specific content.

## `src/layouts/admin/AdminLayout.jsx`

The admin layout provides the admin dashboard shell.

Example:

```jsx
const handleLogout = async () => {
  try {
    await api.post('/auth/logout');
  } finally {
    sessionStorage.clear();
    localStorage.clear();
    navigate('/login', { replace: true });
  }
};
```

Why it matters:
- admin layouts provide a dedicated workspace,
- they include shared admin navigation and logout handling,
- they keep admin UX separate from shopper UX.

## Supporting layout files

- `HeaderBar.jsx` — top bar for the shop layout,
- `AdminSidebar.jsx` — full admin navigation,
- `SidebarItem.jsx` — reusable sidebar link item.

## Why routes and layouts matter

- layouts reduce duplication across pages,
- route-specific pages become easier to reason about,
- they enable both public and admin experiences in the same app.
