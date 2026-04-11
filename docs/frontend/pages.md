# Frontend Pages

The `src/pages/` folder contains page-level components representing the main screens of the application.

## User-facing page examples

### `Home.jsx`
- The main storefront screen.
- Loads products in pages and renders them in a grid.
- Uses `useInView` for infinite scrolling and `useCart` to add products to the cart.

Example code from `Home.jsx`:

```jsx
const loadMore = useCallback(async () => {
  if (loading || !hasMore) return;
  const data = await getUserProductsPaged(currentPage, pageSize);
  setProducts((prev) => [...prev, ...data]);
  setCurrentPage((prev) => prev + 1);
}, [currentPage, loading, hasMore]);
```

Why it matters:
- the page fetches products incrementally,
- it keeps the UI responsive,
- it adapts to both guest and signed-in users.

### `CartPage.jsx`
- Displays cart items, quantity controls, and order summary.
- Uses `useCart()` to update and remove items.
- Shows an empty state when the cart is empty.

Example code from `CartPage.jsx`:

```jsx
const handleQtyChange = async (variantId, nextQty) => {
  if (nextQty < 1) return;
  setUpdatingId(variantId);
  try {
    await updateItem(variantId, nextQty);
  } finally {
    setUpdatingId(null);
  }
};
```

Why it matters:
- quantity changes are handled optimistically,
- the page displays totals and checkout flow,
- it uses guard logic for loading and invalid carts.

### `CheckoutPage.jsx` and `OrderSuccess.jsx`
- `CheckoutPage` collects order submission details.
- `OrderSuccess` confirms the purchase.
- They complete the user checkout flow after cart review.

### `OrdersPage.jsx`
- Shows the logged-in user’s past orders.
- Useful for order history and tracking.

## Auth pages

### `Login.jsx`
- Handles sign-in with backend authentication.
- Likely calls auth services or `AuthContext.login()`.

### `Register.jsx`
- Handles new user registration.
- Useful for capturing account details and creating users.

## Admin pages

The admin section is built with page components for store management:
- `AdminDashboard.jsx` — high-level admin summary,
- `AdminProducts.jsx` — product list and inventory actions,
- `AdminProductEdit.jsx` — create/edit product details,
- `AdminProductVariants.jsx` — manage variant pricing and stock,
- `AdminCategories.jsx` — category administration,
- `AdminInventory.jsx` — inventory stock management,
- `AdminOrders.jsx` — order list and search,
- `AdminOrderDetail.jsx` — order detail and status updates.

Why page files matter

- Pages map directly to routes and user workflows.
- They orchestrate components, layout, and state.
- Keeping them grouped helps new developers understand screens quickly.
