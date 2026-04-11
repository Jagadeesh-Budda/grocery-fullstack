# Frontend Pages

The `src/pages/` folder contains page-level components, each representing a distinct screen in the app.

## Key page files

### `Home.jsx`
- The main storefront page for product discovery.
- Likely displays featured products, categories, and promotions.
- Why it exists: this is the default user experience for browsing groceries.

### `Products.jsx`
- Lists available products and allows filtering.
- Why it exists: to show product search results and browsing views.

### `ProductDetailPage.jsx`
- Displays details for a selected product variant.
- Why it exists: to show product description, pricing, and add-to-cart actions.

### `CartPage.jsx`
- Shows the current shopping cart contents.
- Includes cart update and checkout actions.
- Why it exists: to let the user review cart items before purchase.

### `CheckoutPage.jsx`
- Handles checkout form and order submission.
- Why it exists: to place orders and gather shipping/payment information.

### `OrderSuccess.jsx`
- A confirmation page after a successful order.
- Why it exists: to inform the user that checkout completed.

### `OrdersPage.jsx`
- Displays a user’s order history.
- Why it exists: to allow users to review past orders.

### `Login.jsx` and `Register.jsx`
- Authentication pages for sign-in and sign-up.
- Why they exist: to let users create accounts and log in.

### Admin pages
- `AdminDashboard.jsx`
- `AdminProducts.jsx`
- `AdminProductEdit.jsx`
- `AdminProductVariants.jsx`
- `AdminCategories.jsx`
- `AdminInventory.jsx`
- `AdminOrders.jsx`
- `AdminOrderDetail.jsx`

These pages provide administrative views for managing the store, products, categories, inventory, and orders.

## Why page files matter

- Pages represent the main screens of the app.
- They are usually the only components mapped directly to routes.
- Keeping them in one folder helps developers find route-specific logic quickly.
