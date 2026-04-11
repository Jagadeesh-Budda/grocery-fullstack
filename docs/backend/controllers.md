# Backend Controllers

The `controller` package maps HTTP requests from the frontend or API clients to service operations. Each controller in this project is intentionally thin and delegates business logic to service classes.

## AuthController.java

`AuthController` handles `/api/auth` endpoints for registration, login, and logout.

Example: login flow

```java
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
    try {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        var context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, httpRequest, httpResponse);

        User user = userService.findByUsername(request.getUsername()).orElseThrow();
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "role", user.getRole()
        ));
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
    }
}
```

Why this matters:
- `AuthenticationManager` validates credentials.
- `SecurityContextHolder` stores the authenticated user for the current thread.
- `HttpSessionSecurityContextRepository` persists authentication so the session remains logged in.

Example: registration flow

```java
@PostMapping("/register")
public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
    if (userService.findByUsername(request.getUsername()).isPresent()) {
        return ResponseEntity.badRequest().body("Username already exists");
    }
    if (userService.findByEmail(request.getEmail()).isPresent()) {
        return ResponseEntity.badRequest().body("Email already exists");
    }
    User user = userService.registerUser(request.getUsername(), request.getEmail(), request.getPassword());
    return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
            "id", user.getId(),
            "username", user.getUsername(),
            "role", user.getRole()
    ));
}
```

## ProductController.java

`ProductController` exposes product browsing endpoints under `/api/products`.

Example: list products with pagination

```java
@GetMapping
public ResponseEntity<Page<UserProductDTO>> getAllProducts(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
    return ResponseEntity.ok(productService.getUserProducts(PageRequest.of(page, size)));
}
```

Example: get product details

```java
@GetMapping("/{id}")
public ResponseEntity<ProductDetailDTO> getProductDetail(@PathVariable Long id) {
    return ResponseEntity.ok(productService.getProductDetail(id));
}
```

Example: recommendations

```java
@GetMapping("/{id}/recommendations")
public ResponseEntity<List<UserProductDTO>> getRecommendations(
        @PathVariable Long id,
        @RequestParam(required = false) Long userId) {
    return ResponseEntity.ok(productService.getRecommendations(id, userId));
}
```

Why this matters:
- Shows how one controller can serve multiple related endpoints.
- Demonstrates use of DTOs for both list and detail views.

## CategoryController.java

`CategoryController` exposes public category listings.

Example:

```java
@GetMapping
public ResponseEntity<List<Category>> getAll() {
    return ResponseEntity.ok(categoryService.getAllCategories());
}
```

Why this matters:
- Uses dual mapping `@RequestMapping({"/categories", "/api/categories"})` so the same data is available to both site and API clients.
- Demonstrates a simple read-only controller.

## CartController.java

`CartController` manages cart operations and returns cart DTOs.

Examples:

```java
@PostMapping("/{userId}/add")
public ResponseEntity<List<CartItemResponse>> addItem(
        @PathVariable Long userId,
        @RequestParam Long variantId,
        @RequestParam(defaultValue = "1") Integer quantity) {
    return ResponseEntity.ok(cartService.addItemAndReturn(userId, variantId, quantity));
}
```

```java
@PostMapping("/{userId}/merge")
public ResponseEntity<List<CartItemResponse>> mergeCart(
        @PathVariable Long userId,
        @RequestBody List<CartItemRequest> items) {
    return ResponseEntity.ok(cartService.mergeAndReturn(userId, items));
}
```

Why this matters:
- Demonstrates both `@RequestParam` and `@RequestBody` usage.
- Shows how controllers return typed lists and DTOs.

## OrderController.java

`OrderController` creates and retrieves user orders.

Example: create an order

```java
@PostMapping
public ResponseEntity<OrderCreateResponse> createOrder(
        HttpSession session,
        @RequestParam(name = "couponCode", required = false) String couponCode) {
    Long userId = (Long) session.getAttribute("userId");
    if (userId == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    if (couponCode == null || couponCode.isBlank()) {
        return ResponseEntity.ok(orderCreateService.createOrderSafely(userId));
    }
    return ResponseEntity.ok(orderCreateService.createOrderSafely(userId, couponCode));
}
```

Example: get current user orders

```java
@GetMapping("/me")
public ResponseEntity<List<OrderSummaryResponse>> getMyOrders(HttpSession session) {
    Long userId = (Long) session.getAttribute("userId");
    if (userId == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    List<OrderSummaryResponse> orders = orderService.getOrdersByUser(userId)
            .stream()
            .filter(Objects::nonNull)
            .map(OrderController::toOrderSummaryResponse)
            .toList();
    return ResponseEntity.ok(orders);
}
```

Why this matters:
- Shows server-side session authentication.
- Demonstrates returning filtered results transformed into response DTOs.

## UserController.java

`UserController` exposes `/api/user/me` for the current authenticated user.

Example:

```java
@GetMapping("/me")
public ResponseEntity<?> me(Authentication authentication) {
    if (authentication == null || !authentication.isAuthenticated()) {
        return ResponseEntity.status(401).build();
    }

    String username = authentication.getName();
    User user = userRepository.findByUsername(username).orElseThrow();
    return ResponseEntity.ok(Map.of(
            "id", user.getId(),
            "username", user.getUsername(),
            "role", user.getRole()
    ));
}
```

Why this matters:
- Shows how Spring Security injects the current authentication object.
- Demonstrates a profile endpoint that returns minimal user data.

## HomeDashboardController.java

`HomeDashboardController` serves home dashboard metrics.

Example:

```java
@GetMapping("/api/home-dashboard")
public ResponseEntity<HomeDashboardDTO> getDashboard(@AuthenticationPrincipal UserPrincipal principal) {
    Long userId = principal.getId();
    return ResponseEntity.ok(homeDashboardService.getDashboard(userId));
}
```

Why this matters:
- Uses `@AuthenticationPrincipal` to access a custom principal object.
- Keeps the controller very thin.

## InventoryController.java

`InventoryController` exposes admin inventory status and adjustment endpoints.

Examples:

```java
@GetMapping("/variants/{variantId}")
public ResponseEntity<InventoryResponse> getVariantInventory(@PathVariable Long variantId) {
    return ResponseEntity.ok(inventoryService.getVariantInventory(variantId));
}
```

```java
@PutMapping("/variants/{variantId}/adjust")
public ResponseEntity<InventoryResponse> adjustVariantInventory(
        @PathVariable Long variantId,
        @RequestBody InventoryAdjustRequest request) {
    InventoryResponse res = inventoryService.adjustVariantInventory(variantId, request);
    log.info("AUDIT admin_inventory_adjust variantId={} delta={} actor={}",
            variantId,
            request != null ? request.getDelta() : null,
            currentUsername());
    return ResponseEntity.ok(res);
}
```

Why this matters:
- Demonstrates how to write both GET and PUT endpoints.
- Shows audit logging inside a controller method.

## AdminProductController.java

Example: list products with pagination and filtering

```java
@GetMapping
public ResponseEntity<Page<ProductMasterDTO>> listProducts(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(required = false) String q,
        @RequestParam(required = false) Boolean active,
        Authentication authentication) {
    int safeSize = Math.min(Math.max(size, 1), 100);
    PageRequest pageable = PageRequest.of(Math.max(page, 0), safeSize, Sort.by(Sort.Direction.ASC, "name"));
    Page<ProductMasterDTO> result = adminProductService.listProducts(q, active, pageable);

    log.info("AUDIT admin_products_list admin={} page={} size={} q={} active={}",
            authentication != null ? authentication.getName() : "anonymous",
            page,
            safeSize,
            q,
            active);
    return ResponseEntity.ok(result);
}
```

Example: create product

```java
@PostMapping
public ResponseEntity<Long> createProduct(
        @Valid @RequestBody ProductCreateRequest request,
        Authentication authentication) {
    Long id = adminProductService.createProduct(request);
    log.info("AUDIT admin_product_create admin={} productId={}",
            authentication != null ? authentication.getName() : "anonymous",
            id);
    return ResponseEntity.ok(id);
}
```

Why this matters:
- Uses `@Valid` to validate request DTOs.
- Exposes multiple CRUD endpoints for product management.

## AdminCategoryController.java

Example: update category

```java
@PutMapping("/{id}")
public ResponseEntity<Category> update(@PathVariable Long id, @RequestBody Category updated) {
    Category category = categoryService.getCategoryById(id);
    if (category == null) {
        return ResponseEntity.notFound().build();
    }
    category.setName(updated.getName());
    category.setImageUrl(updated.getImageUrl());
    Category saved = categoryService.saveCategory(category);
    log.info("admin={} action=updateCategory id={} name={}", currentUsername(), saved.getId(), saved.getName());
    return ResponseEntity.ok(saved);
}
```

Why this matters:
- Demonstrates an update pattern with existence checking.
- Shows using entity objects directly in admin endpoints.

## AdminCouponController.java

Example: create coupon

```java
@PostMapping
public ResponseEntity<AdminCouponDTO> create(
        @Valid @RequestBody AdminCouponUpsertRequest request,
        Authentication authentication) {
    Coupon created = adminCouponService.create(request);
    log.info("AUDIT admin_coupon_create admin={} couponId={} code={}",
            authentication != null ? authentication.getName() : "anonymous",
            created.getId(),
            created.getCode());
    return ResponseEntity.ok(adminCouponService.get(created.getId()));
}
```

Why this matters:
- Shows request validation and mapping to a DTO response.
- Keeps admin create and update flows readable.

## AdminOrderController.java

Example: update order status

```java
@PatchMapping("/{orderId}/status")
public ResponseEntity<Order> updateOrderStatus(@PathVariable Long orderId, @RequestBody OrderStatus status) {
    Order updatedOrder = orderService.updateOrderStatus(orderId, status);
    log.info("admin={} action=updateOrderStatus orderId={} newStatus={}", currentUsername(), orderId, status);
    return ResponseEntity.ok(updatedOrder);
}
```

Why this matters:
- Illustrates `PATCH` usage for partial updates.
- Shows using domain value objects like `OrderStatus`.

## AdminInventoryController.java

Example: low stock list

```java
@GetMapping("/low-stock")
public ResponseEntity<List<AdminLowStockInventoryItemDTO>> lowStock(Authentication authentication) {
    List<AdminLowStockInventoryItemDTO> result = adminInventoryService.lowStock();
    log.info("AUDIT admin_inventory_low_stock admin={} count={}",
            authentication != null ? authentication.getName() : "anonymous",
            result != null ? result.size() : 0);
    return ResponseEntity.ok(result);
}
```

Why this matters:
- Demonstrates admin read-only endpoints.
- Uses typed DTOs for inventory summaries.

## AdminInventoryTransactionController.java

Example: paged transaction history

```java
@GetMapping
public ResponseEntity<Page<AdminInventoryTransactionDTO>> history(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "50") int size,
        @RequestParam(required = false) Long variantId,
        @RequestParam(required = false) Long orderId,
        @RequestParam(required = false) String type,
        Authentication authentication) {
    int safeSize = Math.min(Math.max(size, 1), 200);
    PageRequest pageable = PageRequest.of(Math.max(page, 0), safeSize, Sort.by(Sort.Direction.DESC, "id"));
    Page<AdminInventoryTransactionDTO> result = inventoryTransactionRepository
            .findAdminHistory(variantId, orderId, type, pageable)
            .map(this::toDto);
    log.info("AUDIT admin_inventory_transactions_list admin={} page={} size={} variantId={} orderId={} type={}",
            authentication != null ? authentication.getName() : "anonymous",
            page,
            safeSize,
            variantId,
            orderId,
            type);
    return ResponseEntity.ok(result);
}
```

Why this matters:
- Shows optional filtering and pagination.
- Supports admin reporting and audit review.

## AdminStoreController.java

Example: list stores

```java
@GetMapping
public ResponseEntity<List<AdminStoreDTO>> list(Authentication authentication) {
    List<AdminStoreDTO> result = adminStoreService.listStores();
    log.info("AUDIT admin_store_list admin={} count={}",
            authentication != null ? authentication.getName() : "anonymous",
            result != null ? result.size() : 0);
    return ResponseEntity.ok(result);
}
```

Why this matters:
- Shows a resource collection endpoint for store management.
- Demonstrates using `Authentication` just for auditing.

## AdminStoreInventoryController.java

Example: low stock for a store

```java
@GetMapping("/low-stock")
public ResponseEntity<List<AdminStoreInventoryItemDTO>> lowStock(
        @PathVariable long storeId,
        Authentication authentication) {
    List<AdminStoreInventoryItemDTO> result = adminStoreInventoryService.lowStock(storeId);
    log.info("AUDIT admin_store_inventory_low_stock admin={} storeId={} count={}",
            authentication != null ? authentication.getName() : "anonymous",
            storeId,
            result != null ? result.size() : 0);
    return ResponseEntity.ok(result);
}
```

Why this matters:
- Shows nested route mapping with `@PathVariable`.
- Demonstrates store-specific admin APIs.

## AdminDashboardController.java

Example: admin stats endpoint

```java
@GetMapping("/stats")
public DashboardStatsDTO getStats() {
    return dashboardService.getDashboardStats();
}
```

Why this matters:
- Demonstrates the simplest controller pattern: return a DTO directly.
- Keeps dashboard endpoints clean and focused.

## AdminAuditLogController.java

Example: audit log filter endpoint

```java
@GetMapping
public ResponseEntity<Page<AdminAuditLogDTO>> list(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(required = false) String entity,
        @RequestParam(required = false) String entityId,
        @RequestParam(required = false) String actor,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
        Authentication authentication) {
    int safeSize = Math.min(Math.max(size, 1), 200);
    PageRequest pageable = PageRequest.of(Math.max(page, 0), safeSize, Sort.by(Sort.Direction.DESC, "createdAt"));
    Page<AdminAuditLogDTO> result = adminAuditLogService.list(entity, entityId, actor, from, to, pageable);
    log.info("AUDIT admin_audit_logs_list admin={} page={} size={} entity={} entityId={} actor={} from={} to={} count={}",
            authentication != null ? authentication.getName() : "anonymous",
            page,
            safeSize,
            entity,
            entityId,
            actor,
            from,
            to,
            result.getNumberOfElements());
    return ResponseEntity.ok(result);
}
```

Why this matters:
- Shows date/time filtering and paged responses.
- Reveals how audit logs are exposed for admin tooling.

## Shared controller patterns

- Use `@RestController` for REST APIs and `ResponseEntity` when you need status control.
- Use `@RequestBody` for JSON input and `@RequestParam` / `@PathVariable` for URL values.
- Keep controllers thin: let services hold business logic.
- Use `Authentication` or `@AuthenticationPrincipal` when endpoints need current user context.
- Log admin actions consistently for auditability.

## Why controllers matter

- They are the public API boundary of the backend.
- Controllers handle request validation, auth checks, and response shaping.
- Well-defined controllers make frontend integration predictable and easier to test.
