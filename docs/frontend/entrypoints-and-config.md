# Frontend Entrypoints and Configuration

This file explains the main startup files and project configuration used by the frontend.

## `package.json`

- Lists dependencies used by the frontend.
- Defines scripts:
  - `dev` / `start` — run the development server.
  - `build` — create a production bundle.
  - `preview` — preview the production build.
  - `test` — run frontend tests with Vitest.
- Useful for understanding what tools and libraries the app depends on.

## `vite.config.js`

- Vite configuration for the frontend build.
- Useful for controlling development server behavior and build target.
- If needed, this file can add plugins or proxy rules.

## `tailwind.config.js`

- Defines Tailwind CSS customization and content scanning.
- Useful for adjusting theme values, adding custom utilities, and ensuring Tailwind processes the right files.

## `postcss.config.cjs`

- Configures PostCSS plugins for CSS processing.
- Useful for integrating Tailwind CSS with Vite.

## `tsconfig.json`

- Contains TypeScript compiler settings.
- Useful even in a JavaScript project because some TypeScript types and tooling are used.

## `src/main.jsx`

- The React entrypoint.
- Renders the application into the DOM.
- Wraps the app with providers:
  - `BrowserRouter` for client-side navigation.
  - `AuthProvider` for authentication state.
  - `CartProvider` for shopping cart state.

## `src/App.jsx`

- Defines routes for the app.
- Connects pages to URLs.
- Uses `ProtectedRoute` for admin-only routes.
- Includes global UI features like toast notifications.
