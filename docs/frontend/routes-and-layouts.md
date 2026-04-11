# Frontend Routes and Layouts

The frontend uses React Router to manage navigation and layout structure.

## `src/App.jsx`

- Defines all application routes.
- Uses nested routes to share layout components.
- Redirects default and unknown paths to the groceries page.
- Protects admin routes using `ProtectedRoute`.
- Why it exists: route definitions connect URLs to page components.

## `src/routes/ProtectedRoute.jsx`

- Guards routes based on authentication and user role.
- Returns `null` while auth is loading and redirects users to appropriate pages when roles do not match.
- Why it exists: to enforce frontend route-level restrictions and improve navigation logic.

## `src/layouts/user/UserLayout.jsx`

- Provides the common layout for user-facing pages.
- Likely contains header, footer, and main content container.
- Why it exists: to keep user page structure consistent.

## `src/layouts/admin/AdminLayout.jsx`

- Provides the common layout for admin pages.
- Likely contains admin navigation and a different visual structure.
- Why it exists: to separate admin experience from the public storefront experience.

## Supporting layout files

- `HeaderBar.jsx`, `Sidebar.jsx`, `SidebarItem.jsx` help build the user layout.
- `AdminSidebar.jsx` provides admin navigation.
- `sidebar.config.js` defines user sidebar items.

## Why routes and layouts matter

- Layouts prevent UI duplication across pages.
- Proper routing keeps the app predictable and navigable.
- Role-specific routes help support both public users and admin users in the same codebase.
