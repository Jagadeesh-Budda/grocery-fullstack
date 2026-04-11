# Frontend Components

The `src/components/` and `src/common/` folders contain reusable UI components.

## `src/components/`

### `ProductsGrid.jsx`
- Renders a grid of product cards.
- Useful for displaying product lists on homepage and category pages.

### `ProductSkeletonGrid.jsx`
- Shows loading skeletons while product data loads.
- Useful for improving perceived performance.

### `ShoppingCart.jsx`
- Displays a mini cart or cart summary.
- Useful for letting users see current cart state without navigating away.

### `EmptyState.jsx`
- Renders placeholder content when no data exists.
- Useful for improving UX when lists are empty.

### `Pagination.jsx`
- Provides pagination controls.
- Useful for browsing paged product lists.

### `ProductPrice.tsx`
- Displays formatted price data.
- Useful for consistent price rendering.

### `SceneryBackground.jsx`
- Likely renders decorative page backgrounds.
- Useful for UI polish and brand styling.

## `src/common/`

### `Button.jsx`
- Shared button component.
- Useful for consistent button styles and behavior.

### `Card.jsx`
- Reusable card wrapper.
- Useful for consistent presentation of item cards.

### `Badge.jsx`
- Shows small labels or status tags.
- Useful for product badges like “new” or “offer”.

### `SearchBar.jsx`
- Search input component.
- Useful for filtering products or categories.

## Why component folders matter

- Components isolate reusable UI pieces from page logic.
- Reuse improves consistency and reduces duplication.
- Small components make the UI easier to test and maintain.
