# Frontend Styles and Assets

This section explains how styling and static assets are organized in the frontend.

## `src/index.css`

- The main CSS entrypoint for the app.
- Imports Tailwind directives and global styles.
- Why it exists: to define base styles and global CSS rules.

## `tailwind.config.js`

- Configures Tailwind CSS for the project.
- Defines which files Tailwind should scan for class names.
- Useful for customizing theme values and ensuring unused CSS is purged.

## `postcss.config.cjs`

- Configures PostCSS to use Tailwind and other plugins.
- Why it exists: to transform CSS during the build process.

## Component-specific CSS

- `CartPage.css`, `CheckoutPage.css`, `Home.css`, `Login.css`, `Products.css`
- These files contain page-specific styles.
- Why they exist: to scope custom styling to individual pages where needed.

## `src/assets/`

- Stores static assets such as product images or UI illustrations.
- Useful for keeping non-code resources organized.

## `src/styles/`

- Contains custom style files that support the app UI.
- Example: `cards.css` and theme styling.
- Why it exists: to centralize reusable CSS across the app.

## Why styling matters

- Clear style organization makes it easier to maintain the app’s visual system.
- Tailwind enables quick UI prototyping through utility classes.
- Asset organization ensures static images are easy to find and manage.
