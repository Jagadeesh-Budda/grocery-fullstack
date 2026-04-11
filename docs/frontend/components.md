# Frontend Components

The frontend uses reusable components to keep the UI consistent and maintainable.

## `src/components/`

### `ProductsGrid.jsx`
- Likely renders product cards in a responsive grid.
- Useful for product discovery screens such as the home and browse pages.

### `ProductSkeletonGrid.jsx`
- Displays loading skeletons while data is fetched.
- Useful to keep users engaged before content appears.

### `ShoppingCart.jsx`
- Renders a cart summary or floating mini-cart UI.
- Useful for quickly displaying cart totals and item counts across pages.

### `EmptyState.jsx`
- Shows a placeholder screen when there is no content.
- Useful for good UX on empty carts, no search results, or missing data.

### `Pagination.jsx`
- Provides next/previous page controls.
- Useful for browsing paged product lists.

### `ProductPrice.tsx`
- Formats the display price using a shared price resolver.

Example:

```tsx
import { resolvePrice } from "../utils/priceResolver";

export default function ProductPrice({ product, locale, currency }) {
  const price = resolvePrice(product, { locale, currency });
  return <span>{price.formatted ?? "—"}</span>;
}
```

Why it matters:
- price formatting is centralized,
- every product price appears consistently,
- display logic is separated from page markup.

### `SceneryBackground.jsx`
- Renders decorative backgrounds for the main user layout.
- Useful for visual polish and atmosphere.

## `src/common/`

### `Button.jsx`
- Shared button wrapper for consistent appearance.
- Useful to avoid repeating class names and interaction behaviors.

### `Card.jsx`
- Reusable card container for product and dashboard layouts.
- Useful for standardizing spacing and elevation.

### `Badge.jsx`
- Small label component for status badges.
- Useful for showing stock, promotions, and category labels.

### `SearchBar.jsx`
- Input component for search and filtering.
- Useful across product lists and dashboard screens.

## Why component folders matter

- Components keep UI logic modular and reusable.
- Smaller components are easier to test and refactor.
- Shared components enforce design consistency across the app.
