# Frontend Styles and Assets

This document explains the frontend styling system, Tailwind setup, and static assets.

## `src/index.css`

This file is the main stylesheet entrypoint and imports Tailwind base styles.
It usually contains global CSS resets and base typography rules.

Why it matters:
- it applies root styles across the app,
- it imports Tailwind utilities once,
- it ensures consistent font and layout behavior.

## `tailwind.config.js`

Tailwind is configured to scan all frontend source files and extend the default theme.

Example:

```js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        grocery: {
          primary: "#0aad0a",
          bg: "#f0f3f2",
          card: "#ffffff",
          success: "#dcfce7",
          danger: "#fee2e2"
        }
      },
      borderRadius: {
        xl2: "12px",
        xl3: "16px",
        xl4: "24px",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
        card: "0 2px 4px rgba(0,0,0,0.02), 0 1px 0 rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};
```

Why it matters:
- custom color tokens support the grocery brand,
- rounded corners and shadows are standardized,
- Tailwind purges unused utilities from the production build.

## `postcss.config.cjs`

PostCSS runs Tailwind and autoprefixer.

```js
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {}, } }
```

Why it matters:
- ensures modern CSS features are compatible,
- integrates Tailwind into the Vite build.

## Page-specific CSS

The app includes individual CSS files for pages such as:
- `CartPage.css`
- `CheckoutPage.css`
- `Home.css`
- `Login.css`
- `Products.css`

Why it matters:
- page CSS keeps layout and experience-specific styles scoped,
- it avoids bloating global styles with one-off classes.

## `src/styles/`

This folder contains reusable style utilities such as `cards.css` and theme helper classes.

Why it matters:
- shared visual patterns are centralized,
- custom classes that do not fit Tailwind utilities can still be reused.

## `src/assets/`

Static assets such as images and illustrations are stored here.

Why it matters:
- assets are organized separately from code,
- they are referenced consistently from components and pages.

## Why styling matters

- a clear style system keeps the app visually coherent,
- Tailwind allows fast UI development without extensive custom CSS,
- separating page, component, and global styles makes maintenance easier.
